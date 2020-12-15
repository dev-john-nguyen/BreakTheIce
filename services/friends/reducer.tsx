import { SET_FRIENDS } from './actionTypes';
import { FriendsActionProps } from './tsTypes';
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
        default:
            return state;
    }
}