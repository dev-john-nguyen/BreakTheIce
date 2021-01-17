import { INSERT_HISTORY, UPDATE_INVITE_STATUS_PROFILE_HISTORY, RESET_HISTORY, SENT_INVITE_PROFILE_HISTORY } from './actionTypes';
import { ProfileActionProps, } from './tsTypes';
import { update_nearBy } from '../../utils/functions';

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
        case UPDATE_INVITE_STATUS_PROFILE_HISTORY:
            return {
                ...state,
                history: update_nearBy(state.history, action.payload.uid, action.payload.status)
            }
        case SENT_INVITE_PROFILE_HISTORY:
            return {
                ...state,
                history: update_nearBy(state.history, action.payload.uid)
            }
        case RESET_HISTORY:
            return INITIAL_STATE;
        default:
            return state;
    }
}