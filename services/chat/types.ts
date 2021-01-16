import { ProfileImgProps } from "../user/types";

export interface ChatActionProps {
    type: string;
    payload: {
        chatListener: () => void;
    };
}

export interface MessageProps {
    sentAt: Date;
    sentBy: string;
    message: string;
    docId: string;
}

export interface ChatObjectProps {
    uid: string;
    messages: Array<MessageProps>;
}

export type ChatPreviewProps = {
    dateCreated: Date;
    docId: string;
    usersInfo: Array<{ uid: string, username: string, profileImg: ProfileImgProps }>;
    recentMsg: string;
    recentUid: string;
    dateSent: Date;
    unread: boolean;
}

export interface ChatRootProps {
    fetched: boolean;
    ids: Array<string>;
    rooms: Array<ChatObjectProps>;
    previews: Array<ChatPreviewProps>;
    chatListener: () => void | undefined;
}

export interface ChatDispatchActionsProps {
    set_and_listen_messages: () => undefined | (() => void);
    reset_chat: () => void;
}