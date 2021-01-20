import { INSERT_HISTORY, UPDATE_INVITE_STATUS_PROFILE_HISTORY, RESET_HISTORY, SENT_INVITE_PROFILE_HISTORY, UPDATE_UNFRIEND_PROFILE } from './actionTypes';
import { ProfileActionProps, ProfileUserProps, } from './tsTypes';
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
        case UPDATE_UNFRIEND_PROFILE:
            const unfriendHistory = state.history.map((profile: ProfileUserProps) => {
                if (profile.uid === action.payload.uid) {
                    profile.friend = false
                }
                return profile
            })
            return {
                ...state,
                history: unfriendHistory
            }
        case RESET_HISTORY:
            return INITIAL_STATE;
        default:
            return state;
    }
}