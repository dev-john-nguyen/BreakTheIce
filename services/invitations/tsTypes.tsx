
import { UserRootStateProps } from '../user/types';

export interface InvitationsActionProps {
    type: string;
    payload: { invitationListener: () => void };
}

export interface InvitationsRootProps {
    inbound: Array<InvitationObject>
    outbound: Array<InvitationObject>
    fetched: boolean;
    invitationListener?: () => void;
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
    set_and_listen_invitations: () => undefined | (() => void);
    update_inviter_invitation: (invitationObj: InvitationObject, updatedStatus: InvitationObject['status']) => void;
    reset_invitations: () => void;
}