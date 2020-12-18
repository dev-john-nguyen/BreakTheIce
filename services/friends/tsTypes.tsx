export interface FriendsRootProps {
    users: Array<FriendObjProps>;
    fetched: boolean;
}

export interface FriendsActionProps {
    type: string;
    payload?: any
}

export interface FriendObjProps {
    dateCreated: Date;
    active: boolean;
    uid: string;
    username: string;
}

export interface FriendDispatchActionProps {
    set_and_listen_friends: (uid: string) => Promise<any>
}