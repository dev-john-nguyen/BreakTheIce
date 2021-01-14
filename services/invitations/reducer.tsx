import { SEND_INVITATION, SET_INVITATIONS_INBOUND, SET_INVITATIONS_OUTBOUND, SET_INVITATIONS } from './actionTypes';
import { InvitationsActionProps } from './tsTypes'

const INITIAL_STATE = {
    outbound: [],
    inbound: [],
    fetched: false,
    invitationListener: undefined
}

export default (state = INITIAL_STATE, action: InvitationsActionProps) => {
    switch (action.type) {
        case SET_INVITATIONS_INBOUND:
            return { ...state, inbound: action.payload }
        case SET_INVITATIONS_OUTBOUND:
            return {
                ...state,
                outbound: action.payload,
                invitationListener: action.payload.invitationListener
            }
        case SET_INVITATIONS:
            return { ...state, fetched: true, }
        case SEND_INVITATION:
            return { ...state, outbound: [...state.outbound, action.payload] }
        default:
            return state;
    }
} 