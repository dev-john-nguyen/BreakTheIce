import { INSERT_HISTORY, RESET_HISTORY } from './actionTypes';
import { AppDispatch } from '../../App';
import { fireDb } from '../firebase';
import { UsersDb, FriendsDb } from '../../utils/variables';
import { ProfileUserProps } from './types';
import { RootProps } from '..';
import { NearByUsersProps } from '../near_users/types';
import _ from 'lodash';
import { cacheImage } from '../../utils/functions';
import { cache_user_images } from '../user/utils';
import { BlockUserProps } from '../user/types';

export const set_current_profile = (profileUid: string) => async (dispatch: AppDispatch, getState: () => RootProps) => {
    //find user in nearUsers
    var profileUserObj: ProfileUserProps | undefined;

    //search history to see if profile was already fetched
    const profileHistory = getState().profile.history

    profileUserObj = _.find(profileHistory, (profile) => {
        return profile.uid === profileUid
    })

    if (profileUserObj) return profileUserObj;

    //if nothing was found in history then fetch and config profile
    const allNearUsers = getState().nearUsers.all

    var profilePreviewData: NearByUsersProps | undefined = _.find(allNearUsers, (user) => {
        return user.uid === profileUid
    })

    var friend = false;

    if (profilePreviewData) {
        var { sentInvite, distance, receivedInvite, updatedAt } = profilePreviewData
        friend = profilePreviewData.friend
    } else {
        //search friends list
        const friends = getState().friends.users
        var friend = _.find(friends, (user) => user.uid === profileUid) ? true : false
    }

    //check to see if the profileObj is empty... if it is fetch it from server
    const profileData = await fireDb.collection(UsersDb).doc(profileUid).get()
        .then(async (doc) => {
            if (!doc.exists) throw 'No data exists';

            const docData = doc.data();

            if (!docData) throw 'No data exists';

            const { location, name, bioShort, bioLong, ctryStateCity, gender, age, username, gallery, hideOnMap, offline, profileImg, blockedUsers } = docData

            if (blockedUsers) {
                const { uid } = getState().user
                if (blockedUsers.find((user: BlockUserProps) => user.uid === uid)) throw 'Access Denied'
            }

            const profileData: ProfileUserProps = {
                uid: doc.id,
                username,
                location,
                name,
                bioShort,
                bioLong,
                ctryStateCity,
                gender,
                age,
                hideOnMap,
                gallery: gallery ? gallery : [],
                offline,
                profileImg,
                receivedInvite: receivedInvite ? receivedInvite : false,
                friend: friend ? friend : false,
                distance: distance ? distance : 0,
                sentInvite: sentInvite ? sentInvite : false,
                updatedAt
            }

            ///cache gallery images
            if (profileData.gallery && profileData.gallery.length > 0) {
                await cache_user_images(profileData.gallery)
            }

            //cache profile image
            if (profileData.profileImg) {
                let cachedUrl = await cacheImage(profileData.profileImg.uri)
                profileData.profileImg.cachedUrl = cachedUrl;
            }

            dispatch({
                type: INSERT_HISTORY,
                payload: profileData
            })

            return profileData

        })

    if (profileData.friend && profileData.profileImg) {
        //update friend profile picture
        const { uid } = getState().user;

        const { uri } = profileData.profileImg;

        fireDb.collection(FriendsDb).doc(uid).collection(UsersDb).doc(profileData.uid).update({ profileImg: { uri, updatedAt: new Date() } })
            .then(() => {
                console.log('updated friend profile img')
            })
            .then((err) => {
                console.log(err)
            })
    }

    return profileData;
}

export const reset_history = () => ({ type: RESET_HISTORY, payload: undefined })