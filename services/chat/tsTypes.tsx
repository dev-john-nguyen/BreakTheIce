export interface ChatActionProps {
    type: string;
    payload?: any;
}

export interface MessageProps {
    sentAt: Date;
    sentBy: string;
    sentTo: string;
    message: string;
}

export interface ChatObjectProps {
    uid: string;
    messages: Array<MessageProps>;
}

export type ChatPreviewProps = {
    docId: string;
    usersInfo: Array<{ uid: string, username: string }>;
    uids: Array<string>;
    recentMsg: string;
    recentUsername: string;
    dateSent: Date;
}

export interface ChatRootProps {
    fetched: boolean;
    ids: Array<string>;
    rooms: Array<ChatObjectProps>;
    previews: Array<ChatPreviewProps>
}

export interface ChatDispatchActionsProps {
    set_and_listen_messages: (uid: string) => void;
}