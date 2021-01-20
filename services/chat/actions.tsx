import { SET_CHAT_PREVIEWS, SET_FETCHED, RESET_CHAT } from './actionTypes';
import { fireDb } from '../firebase';
import { AppDispatch } from '../../App';
import { RootProps } from '../';
import { ChatDb } from '../../utils/variables';
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
            dispatch(set_banner('Oops! We had trouble retrieving your messages', 'error'));
            return false;
        }
    )


    dispatch({ type: SET_FETCHED, payload: { chatListener } })

    return chatListener

}

export const delete_chat = (docId: string) => (dispatch: AppDispatch, getState: () => RootProps) => {
    const { uid } = getState().user;

    if (!docId) {
        dispatch(set_banner("Couldn't find chat id to remove", "error"))
        return;
    }

    fireDb.collection(ChatDb).doc(docId).delete()
        .then(() => {
            console.log('successfully deleted')
        })
        .catch(err => {
            console.log(err)
            dispatch(set_banner('Oops! Looks like we are having trouble removing the chat.', 'error'))
        })
}

export const reset_chat = () => ({ type: RESET_CHAT, payload: undefined })