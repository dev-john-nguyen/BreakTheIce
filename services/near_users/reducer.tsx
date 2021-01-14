import { SET_NEAR_USERS, REMOVE_NEAR_USERS, UPDATE_NEAR_USERS, UPDATE_INVITE_NEAR_USER, INIT_NEAR_USERS } from './actionTypes'
import { NearUsersActionProps, NearUsersRootProps } from './tsTypes';

const INITIAL_STATE = {
    nearBy: [],
    all: [],
    fetched: false,
    nearUsersListener: undefined
}

export default (state: any = INITIAL_STATE, action: NearUsersActionProps) => {
    switch (action.type) {
        case SET_NEAR_USERS:
            return {
                nearBy: action.payload.nearBy,
                all: action.payload.all,
                fetched: true
            }
        case INIT_NEAR_USERS:
            return {
                ...state,
                nearUsersListener: action.payload.nearUsersListener
            }
        case REMOVE_NEAR_USERS:
            return {
                users: [],
                fetched: false
            }
        case UPDATE_NEAR_USERS:
            return {
                ...state,
                nearBy: action.payload.nearBy
            }
        case UPDATE_INVITE_NEAR_USER:
            //find the nearUser in nearBy and update sentInvite to true
            //??? What will happen if the user is in the all state? 
            for (let i = 0; i < state.nearBy.length; i++) {
                if (action.payload === state.nearBy[i].uid) {
                    state.nearBy[i].sentInvite = true
                    break;
                }
            }
            return state;
        default:
            return state
    }
}