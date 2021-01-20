import { ChatPreviewProps } from "../../services/chat/types";
import { fireDb } from "../../services/firebase";
import { ChatDb } from "../../utils/variables";
import { TargetUserProps } from "./components/Message";
import { UserRootStateProps } from "../../services/user/types";

export const renderDateDiff = (date: any) => {
    if (!date) return;

    const date1: any = new Date();
    const diffTime = Math.abs(date1 - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return diffDays + " days ago"
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours < 24 && diffHours > 1) return diffHours + " hours ago"
    const diffMins = Math.ceil(diffTime / (1000 * 60));
    if (diffMins < 60 && diffMins > 1) return diffMins + " mins ago"
    const diffSec = Math.ceil(diffTime / (1000));
    return diffSec + " secs ago";
}

export const renderDate = (date: Date) => {
    if (!date) return
    return date.getMonth() + '/' + date.getDay() + '/' + date.getFullYear()
}

export const renderOtherUser = (userInfo: ChatPreviewProps['usersInfo']) => {
    return userInfo.find(user => user.uid !== user.uid)
}

export const handleUpdateUnread = (docId: string, unread: boolean, recentUid: string, userId: string) => {
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


export const searchReduxChat = (targetUser: TargetUserProps, chatPreviews: ChatPreviewProps[]) => {
    return chatPreviews.find((chat) => {
        const chatUser = chat.usersInfo.find(user => user.uid === targetUser.uid)
        if (chatUser) return chat;
    })
}