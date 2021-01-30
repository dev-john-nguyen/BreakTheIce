import { INSERT_HISTORY, UPDATE_INVITE_STATUS_PROFILE_HISTORY, RESET_HISTORY, SENT_INVITE_PROFILE_HISTORY, UPDATE_UNFRIEND_PROFILE, UPDATE_PROFILE_HISTORY, UPDATE_RECEIVED_INVITE_PROFILE_HISTORY, UPDATE_FRIENDS_PROFILES } from './actionTypes';
import { ProfileActionProps } from './types';
import { update_profile_to_current, update_invite_status, unfriend_user, update_received_status, update_friends_status } from '../utils';

const INITIAL_STATE = {
    history: []
}

export default (state = INITIAL_STATE, action: ProfileActionProps) => {
    switch (action.type) {
        case INSERT_HISTORY:
            return {
                ...state,
                history: [...state.history, action.payload]
            }
        case UPDATE_PROFILE_HISTORY:
            return {
                ...state,
                history: update_profile_to_current(action.payload, state.history)
            }
        case UPDATE_INVITE_STATUS_PROFILE_HISTORY:
            return {
                ...state,
                history: update_invite_status(state.history, action.payload.uid, action.payload.status)
            }
        case SENT_INVITE_PROFILE_HISTORY:
            return {
                ...state,
                history: update_invite_status(state.history, action.payload.uid)
            }
        case UPDATE_UNFRIEND_PROFILE:
            return {
                ...state,
                history: unfriend_user(state.history, action.payload.uid)
            }
        case UPDATE_RECEIVED_INVITE_PROFILE_HISTORY:
            return {
                ...state,
                history: update_received_status(state.history, action.payload.invitations)
            }
        case UPDATE_FRIENDS_PROFILES:
            return {
                ...state,
                history: update_friends_status(state.history, action.payload.friends)
            }
        case RESET_HISTORY:
            return INITIAL_STATE;
        default:
            return state;
    }
}