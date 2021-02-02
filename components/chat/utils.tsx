import { ChatPreviewProps } from "../../services/chat/types";

export const renderDate = (date: Date) => {
    if (!date) return
    return (date.getMonth() + 1) + '/' + date.getDay() + '/' + date.getFullYear()
}

export const renderOtherUser = (userInfo: ChatPreviewProps['usersInfo'], uid: string) => {
    return userInfo.find(user => uid !== user.uid)
}