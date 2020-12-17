import { fireDb } from '../firebase';
import { AppDispatch } from '../../App';
import { RootProps } from '../';
import { ChatDb, ChatMessageDb } from '../../utils/variables';
import { SET_ERROR } from '../utils/actionTypes';
//@ts-ignore
import { firestore } from 'firebase';

export const set_and_listen_messages = () => (dispatch: AppDispatch, getState: () => RootProps) => {
    const uid: string = getState().user.uid;
    const chatIds: Array<string> = getState().chat.ids;
    if (!uid) return dispatch({
        type: SET_ERROR,
        payload: "Couldn't find your user id to fetch your messages"
    });

    //check if there are any messages
    if (chatIds.length < 1) return;


    fireDb.collection(ChatDb).where(firestore.FieldPath.documentId(), 'in', chatIds).get()
        .then((querySnapshot) => {
            querySnapshot.docs.forEach(doc => {
                doc.ref.collection(ChatMessageDb).get()
            })
        })
    // var  = fireDb.batch();

    // for (let i = 0; i < chatIds.length; i++) {
    //     var chatMessageRef = fireDb.collection(ChatDb).doc(chatIds[i]).collection(ChatMessageDb);

    //     batch.
    // }
    // fireDb.collection(ChatDb).doc()collection(ChatMessageDb)
}