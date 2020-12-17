import { SET_FRIENDS } from './actionTypes';
import { AppDispatch } from '../../App';
import { fireDb } from '../firebase';
import { FriendsDb, FriendsUsersDb } from '../../utils/variables';
import { FriendObjProps } from './tsTypes';

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
                        active: friend.active
                    })
                }
            }
        })
        dispatch({
            type: SET_FRIENDS,
            payload: friendsArr
        })
    })
}