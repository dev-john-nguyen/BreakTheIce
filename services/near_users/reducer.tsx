import { SET_NEAR_USERS, REMOVE_NEAR_USERS, UPDATE_NEAR_USERS } from './actionTypes'
import { NearUsersActionProps } from './tsTypes';

const INITIAL_STATE = {
    nearBy: [],
    all: [],
    fetched: false
}

export default (state = INITIAL_STATE, action: NearUsersActionProps) => {
    switch (action.type) {
        case SET_NEAR_USERS:
            if (!action.payload) return state;
            return {
                nearBy: action.payload.nearBy,
                all: action.payload.all,
                fetched: true
            }
        case REMOVE_NEAR_USERS:
            return {
                users: [],
                fetched: false
            }
        case UPDATE_NEAR_USERS:
            if (!action.payload) return state;
            return {
                ...state,
                nearBy: action.payload.nearBy
            }
        default:
            return state
    }
}