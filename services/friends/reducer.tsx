import { SET_FRIENDS, INIT_FRIENDS, RESET_FRIENDS } from './actionTypes';
import { FriendsActionProps } from './tsTypes';
const INITIAL_STATE = {
    users: [],
    fetched: false,
    friendListener: undefined
}

export default (state = INITIAL_STATE, action: FriendsActionProps) => {
    switch (action.type) {
        case SET_FRIENDS:
            return {
                users: action.payload
            }
        case INIT_FRIENDS:
            return {
                ...state,
                fetched: true,
                friendListener: action.payload.friendListener
            }
        case RESET_FRIENDS:
            return INITIAL_STATE
        default:
            return state;
    }
}