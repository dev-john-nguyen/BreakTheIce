import { SET_FRIENDS, INIT_FRIENDS, RESET_FRIENDS } from './actionTypes';
import { FriendsActionProps } from './types';
const INITIAL_STATE = {
    users: [],
    fetched: false
}

export default (state = INITIAL_STATE, action: FriendsActionProps) => {
    switch (action.type) {
        case SET_FRIENDS:
            return {
                users: action.payload,
                fetched: true
            }
        case INIT_FRIENDS:
            return {
                ...state,
                fetched: true
            }
        case RESET_FRIENDS:
            return INITIAL_STATE
        default:
            return state;
    }
}