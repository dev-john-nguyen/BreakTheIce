import { ProfileImgProps } from "../user/types";


export interface InvitationsActionProps {
    type: string;
    payload: { invitationListener: () => void };
}

export interface InvitationsRootProps {
    inbound: Array<InvitationObject>
    outbound: Array<InvitationObject>
    fetched: boolean;
}

export enum InvitationStatusOptions {
    pending = 'pending',
    accepted = 'accepted',
    denied = 'denied'
}

export interface InvitationUserInfo {
    uid: string;
    username: string;
    age: number;
    profileImg: ProfileImgProps | null;
}

export interface InvitationObject {
    docId: string,
    sentBy: InvitationUserInfo
    sentTo: InvitationUserInfo,
    createdAt: Date,
    updatedAt: Date,
    message: string,
    status: InvitationStatusOptions
}

export interface InvitationsDispatchActionProps {
    send_invitation: (invitationContent: Omit<InvitationObject, 'docId'>) => Promise<any>;
    set_and_listen_invitations: () => undefined | (() => void);
    update_invitation_from_invitations: (invitationObj: InvitationObject, updatedStatus: InvitationObject['status']) => void;
    update_invitation: (inviterUid: string, status: InvitationStatusOptions) => Promise<void>;
    reset_invitations: () => void;
}