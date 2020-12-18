
import { UserRootStateProps } from '../user/tsTypes';

export interface InvitationsActionProps {
    type: string;
    payload?: Array<InvitationObject>;
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

export interface InvitationObject {
    docId?: string,
    sentBy: string,
    sentByUsername: string,
    sentByAge: number,
    sentTo: string,
    createdAt: Date,
    updatedAt: Date,
    message: string,
    status: InvitationStatusOptions
}

export interface InvitationsDispatchActionProps {
    send_invitation: (invitationContent: InvitationObject) => Promise<any>;
    set_and_listen_invitations: (uid: UserRootStateProps['uid']) => void;
    update_inviter_invitation: (invitationObj: InvitationObject, updatedStatus: InvitationObject['status']) => void;
}