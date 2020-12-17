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

export interface ChatRootProps {
    ids: Array<string>;
    rooms: Array<ChatObjectProps>
}