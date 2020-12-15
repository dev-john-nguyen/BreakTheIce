
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
    uid: string,
    message: string,
    date: Date,
    status: InvitationStatusOptions
}

export interface InvitationsDispatchActionProps {
    send_invitation: (uid: UserRootStateProps['uid'], invitationContent: InvitationObject) => Promise<undefined>;
    set_and_listen_invitations: (uid: UserRootStateProps['uid']) => void;
    update_inviter_invitation: (inviterUid: InvitationObject['uid'], status: InvitationObject['status']) => void;
}