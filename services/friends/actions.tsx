import { SET_FRIENDS, INIT_FRIENDS, RESET_FRIENDS } from './actionTypes';
import { AppDispatch } from '../../App';
import { fireDb } from '../firebase';
import { FriendsDb, FriendsUsersDb } from '../../utils/variables';
import { FriendObjProps } from './tsTypes';
import { RootProps } from '..';
import { set_banner } from '../utils/actions';
import { UNFRIEND_USER } from '../near_users/actionTypes';
import { UPDATE_UNFRIEND_PROFILE } from '../profile/actionTypes';

export const set_and_listen_friends = () => (dispatch: AppDispatch, getState: () => RootProps) => {
    const { uid } = getState().user;

    if (!uid) {
        dispatch(set_banner("Failed to find your user id.", "error"))
        return;
    }

    const friendListener = fireDb.collection(FriendsDb).doc(uid).collection(FriendsUsersDb).where('active', '==', true).onSnapshot((querySnapShot) => {
        //prepare friendsArr
        var friendsArr: Array<FriendObjProps> = [];

        querySnapShot.docs.forEach((doc) => {
            if (doc.exists) {
                const friend = doc.data()

                if (friend) {

                    friendsArr.push({
                        uid: doc.id,
                        dateCreated: friend.dateCreated,
                        active: friend.active,
                        username: friend.username
                    })

                }
            }
        })
        dispatch({
            type: SET_FRIENDS,
            payload: friendsArr
        })
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
        dateUpdated: new Date()
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