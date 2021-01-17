import { INSERT_HISTORY, RESET_HISTORY } from './actionTypes';
import { AppDispatch } from '../../App';
import { fireDb } from '../firebase';
import { UsersDb } from '../../utils/variables';
import { ProfileUserProps } from './tsTypes';
import { RootProps } from '..';
import { NearByUsersProps } from '../near_users/types';
import _ from 'lodash';
import { cacheImage } from '../../utils/functions';
import { cache_user_images } from '../user/utils';

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


    if (profilePreviewData) {
        var { friend, sentInvite, distance, receivedInvite } = profilePreviewData
    }

    //check to see if the profileObj is empty... if it is fetch it from server
    return await fireDb.collection(UsersDb).doc(profileUid).get()
        .then(async (doc) => {
            if (!doc.exists) throw 'No data exists';

            const docData = doc.data();

            if (!docData) throw 'No data exists';

            const { location, name, bioShort, bioLong, stateCity, gender, age, username, gallery, hideOnMap, offline, profileImg } = docData

            const profileData: ProfileUserProps = {
                uid: doc.id,
                username,
                location,
                name,
                bioShort,
                bioLong,
                stateCity,
                gender,
                age,
                hideOnMap,
                gallery,
                offline,
                profileImg,
                receivedInvite: receivedInvite ? receivedInvite : false,
                friend: friend ? friend : false,
                distance: distance ? distance : 0,
                sentInvite: sentInvite ? sentInvite : false,
            }
            ///cache gallery images
            if (profileData.gallery.length > 0) {
                await cache_user_images(profileData.gallery, 'nearUserUri')
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
}

export const reset_history = () => ({ type: RESET_HISTORY, payload: undefined })