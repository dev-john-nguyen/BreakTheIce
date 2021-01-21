import { SEND_INVITATION, SET_INVITATIONS_INBOUND, SET_INVITATIONS_OUTBOUND, SET_INVITATIONS, RESET_INVITATIONS } from './actionTypes';
import { InvitationsActionProps } from './types'

const INITIAL_STATE = {
    outbound: [],
    inbound: [],
    fetched: false
}

export default (state = INITIAL_STATE, action: InvitationsActionProps) => {
    switch (action.type) {
        case SET_INVITATIONS_INBOUND:
            return {
                ...state,
                inbound: action.payload
            }
        case SET_INVITATIONS_OUTBOUND:
            return {
                ...state,
                outbound: action.payload
            }
        case SET_INVITATIONS:
            return { ...state, fetched: true, }
        case SEND_INVITATION:
            return { ...state, outbound: [...state.outbound, action.payload] }
        case RESET_INVITATIONS:
            return INITIAL_STATE;
        default:
            return state;
    }
} 