import { timestamp, ChatDb } from '../../../utils/variables';
import { fireDb } from "../../../services/firebase";
import { TargetUserProps } from "./Message";
import { UserRootStateProps } from "../../../services/user/types";
import { ChatPreviewProps, MessageProps } from '../../../services/chat/types';
import { BannerDispatchActionProps } from '../../../services/banner/tsTypes';

export function update_if_read(user: UserRootStateProps, msgDocId: string, setRead: boolean) {
    if (setRead) {
        //set message read
        //update usersInfo with profileImg

        var updatedObj: {
            unread: boolean,
            [uid: string]: any
        } = {
            unread: false,
            timestamp,
            updatedAt: new Date()
        }

        if (user.profileImg) {
            updatedObj[`profileImgs.${user.uid}`] = {
                uri: user.profileImg.uri,
                updatedAt: new Date()
            }
        }

        fireDb.collection(ChatDb).doc(msgDocId).update(updatedObj)
    }

}

export const database_fetch_chat = async (targetUser: TargetUserProps, user: UserRootStateProps, setMessages: (msg: MessageProps[] | 'empty') => void, set_banner: BannerDispatchActionProps['set_banner']) => {
    return fireDb.collection(ChatDb)
        .where('usersInfo', 'array-contains', { uid: user.uid, username: user.username })
        .get()
        .then(querySnapShot => {
            const { docs } = querySnapShot;

            const chatDoc = docs.find(doc => {
                var chatFound: boolean = false
                if (doc.exists) {
                    const { usersInfo } = doc.data() as ChatPreviewProps;

                    usersInfo.forEach(userInfo => {
                        if (userInfo.uid === targetUser.uid) {
                            chatFound = true
                        }
                    })
                }

                if (chatFound) {
                    return doc
                }
            })

            if (chatDoc) {

                const { unread, recentUid } = chatDoc.data() as ChatPreviewProps;

                set_if_read(chatDoc.id, unread, recentUid, user.uid)

                return { docId: chatDoc.id }
            }

            setMessages('empty')
        })
        .catch((err) => {
            console.log(err)
            set_banner('Oops! Something went wrong getting the chat messages.', 'error')
            setMessages('empty')
        })

}

export const set_if_read = (docId: string, unread: boolean, recentUid: string, userId: string) => {
    if (unread && recentUid !== userId) {
        //update unread status to false;
        fireDb.collection(ChatDb).doc(docId).update({ unread: false })
            .then(() => {
                console.log('unread status updated!')
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const search_redux_chat = (targetUser: TargetUserProps, chatPreviews: ChatPreviewProps[]) => {
    return chatPreviews.find((chat) => {
        const chatUser = chat.usersInfo.find(user => user.uid === targetUser.uid)
        if (chatUser) return chat;
    })
}
