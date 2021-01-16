export interface FriendsRootProps {
    users: Array<FriendObjProps>;
    fetched: boolean;
    friendListener?: () => void;
}

export interface FriendsActionProps {
    type: string;
    payload: {
        friendListener: () => void
    }
}

export interface FriendObjProps {
    dateCreated: Date;
    active: boolean;
    uid: string;
    username: string;
}

export interface FriendDispatchActionProps {
    set_and_listen_friends: () => (() => void) | undefined;
    reset_friends: () => void;
}