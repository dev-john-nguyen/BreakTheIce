import { ProfileImgProps } from "../user/types";

export interface FriendsRootProps {
    users: Array<FriendObjProps>;
    fetched: boolean;
}

export interface FriendsActionProps {
    type: string;
    payload: any
}

export interface FriendObjProps {
    dateCreated: Date;
    active: boolean;
    uid: string;
    username: string;
    profileImg: ProfileImgProps | null;
}

export interface FriendDispatchActionProps {
    set_and_listen_friends: () => (() => void) | undefined;
    unfriend_user: (friendUid: string) => Promise<undefined | void>
    reset_friends: () => void;
}