import { SET_FRIENDS } from './actionTypes';
import { AppDispatch } from '../../App';
import { fireDb } from '../firebase';
import { FriendsDb, FriendsUsersDb } from '../../utils/variables';
import { FriendObjProps } from './tsTypes';
import { SET_ERROR } from '../utils/actionTypes';

export const set_and_listen_friends = (uid: string) => (dispatch: AppDispatch) => {

    fireDb.collection(FriendsDb).doc(uid).collection(FriendsUsersDb).onSnapshot((querySnapShot) => {
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

    return Promise.resolve('success')
}