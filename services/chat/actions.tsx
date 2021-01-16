import { SET_CHAT_PREVIEWS, SET_FETCHED, RESET_CHAT } from './actionTypes';
import { fireDb } from '../firebase';
import { AppDispatch } from '../../App';
import { RootProps } from '../';
import { ChatDb } from '../../utils/variables';
import { SET_ERROR } from '../utils/actionTypes';
import { ChatPreviewProps } from './types';
import { set_banner } from '../utils/actions';

export const set_and_listen_messages = () => (dispatch: AppDispatch, getState: () => RootProps) => {

    const { uid, username } = getState().user;

    if (!uid) {
        dispatch(set_banner("Failed to find your user id.", "error"))
        return;
    }

    var chatListener = fireDb.collection(ChatDb).where('usersInfo', 'array-contains', { uid, username }).onSnapshot(querySnapshot => {
        var chatPreviews: ChatPreviewProps[] = [];

        querySnapshot.docs.forEach(doc => {
            if (doc.exists) {
                const { unread, recentUid, recentMsg, dateSent, usersInfo, dateCreated } = doc.data()
                chatPreviews.push({
                    docId: doc.id,
                    recentMsg,
                    dateSent: dateSent.toDate(),
                    dateCreated: dateCreated.toDate(),
                    usersInfo,
                    unread,
                    recentUid
                })
            }
        })

        dispatch({
            type: SET_CHAT_PREVIEWS,
            payload: chatPreviews
        })
    },
        err => {
            console.log(err);
            dispatch({
                type: SET_ERROR,
                payload: 'Oops! We had trouble retrieving your messages.'
            })

            return false;
        }
    )


    dispatch({ type: SET_FETCHED, payload: { chatListener } })

    return chatListener

}

export const reset_chat = () => ({ type: RESET_CHAT, payload: undefined })