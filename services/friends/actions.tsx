import { SET_FRIENDS, INIT_FRIENDS, RESET_FRIENDS } from './actionTypes';
import { AppDispatch } from '../../App';
import { fireDb } from '../firebase';
import { FriendsDb, FriendsUsersDb } from '../../utils/variables';
import { FriendObjProps } from './tsTypes';
import { SET_ERROR } from '../utils/actionTypes';
import { RootProps } from '..';
import { set_banner } from '../utils/actions';

export const set_and_listen_friends = () => (dispatch: AppDispatch, getState: () => RootProps) => {
    const { uid } = getState().user;

    if (!uid) {
        dispatch(set_banner("Failed to find your user id.", "error"))
        return;
    }

    const friendListener = fireDb.collection(FriendsDb).doc(uid).collection(FriendsUsersDb).onSnapshot((querySnapShot) => {
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
        dispatch({
            type: SET_ERROR,
            payload: 'Oops! Something went wrong with getting your friends.'
        })
    })

    dispatch({
        type: INIT_FRIENDS,
        payload: { friendListener }
    })

    return friendListener
}

export const reset_friends = () => ({ type: RESET_FRIENDS, payload: undefined })