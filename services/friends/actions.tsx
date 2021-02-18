import { SET_FRIENDS, INIT_FRIENDS, RESET_FRIENDS } from './actionTypes';
import { AppDispatch } from '../../App';
import { fireDb } from '../firebase';
import { FriendsDb, FriendsUsersDb } from '../../utils/variables';
import { FriendObjProps } from './types';
import { RootProps } from '..';
import { set_banner } from '../banner/actions';
import { UNFRIEND_USER, UPDATE_FRIENDS_NEAR_USERS } from '../near_users/actionTypes';
import { UPDATE_UNFRIEND_PROFILE, UPDATE_FRIENDS_PROFILES } from '../profile/actionTypes';
import { cacheImage } from '../../utils/functions';
import firebase from 'firebase';

export const set_and_listen_friends = () => (dispatch: AppDispatch, getState: () => RootProps) => {
    const { uid } = getState().user;

    if (!uid) {
        dispatch(set_banner("Failed to find your user id.", "error"))
        return;
    }

    const friendListener = fireDb.collection(FriendsDb).doc(uid).collection(FriendsUsersDb).where('active', '==', true).onSnapshot(async (querySnapShot) => {
        //prepare friendsArr
        var friendsArr: FriendObjProps[] = [];

        for (let i = 0; i < querySnapShot.docs.length; i++) {
            const doc = querySnapShot.docs[i];

            if (doc.exists) {
                const friend = doc.data()

                if (friend) {
                    var newFriend: FriendObjProps = {
                        uid: doc.id,
                        dateCreated: friend.dateCreated,
                        active: friend.active,
                        username: friend.username.toLowerCase(),
                        profileImg: null
                    }

                    if (friend.profileImg) {
                        const cachedUrl = await cacheImage(friend.profileImg.uri);
                        newFriend.profileImg = {
                            ...friend.profileImg,
                            cachedUrl
                        }
                    }

                    friendsArr.push(newFriend)
                }
            }
        }

        dispatch({ type: UPDATE_FRIENDS_PROFILES, payload: { friends: friendsArr } })
        dispatch({ type: UPDATE_FRIENDS_NEAR_USERS, payload: { friends: friendsArr } })

        dispatch({ type: SET_FRIENDS, payload: friendsArr })
    }, err => {
        console.log(err)
        dispatch(set_banner('Oops! Something went wrong with getting your friends.', 'error'))
    })

    dispatch({
        type: INIT_FRIENDS,
        payload: undefined
    })

    return friendListener
}

export const unfriend_user = (friendUid: string) => async (dispatch: AppDispatch, getState: () => RootProps) => {
    const { uid } = getState().user

    if (!uid || !friendUid) {
        dispatch(set_banner("Couldn't find user information. Please refresh and try again.", "error"))
        return;
    }

    var batch = fireDb.batch()

    const myRef = fireDb.collection(FriendsDb).doc(uid).collection(FriendsUsersDb).doc(friendUid);
    const friendRef = fireDb.collection(FriendsDb).doc(friendUid).collection(FriendsUsersDb).doc(uid);

    const updatedData = {
        active: false,
        dateUpdated: new Date(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }

    batch.update(myRef, updatedData)
    batch.update(friendRef, updatedData)

    try {
        await batch.commit()
    } catch (err) {
        console.log(err)
        dispatch(set_banner("Oops! Something went wrong unlinking you to the other user. Please try again.", "error"))
        return;
    }

    //update redux stores
    //friend listener will pick update friend update and update friend redux store

    //will need to update near_users and remove friends
    dispatch({ type: UNFRIEND_USER, payload: { uid: friendUid } })
    //will need to update profile history
    dispatch({ type: UPDATE_UNFRIEND_PROFILE, payload: { uid: friendUid } })

    dispatch(set_banner("Successfully unlinked", 'success'))

}

export const reset_friends = () => ({ type: RESET_FRIENDS, payload: undefined })