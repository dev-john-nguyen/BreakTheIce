import { SET_NEAR_USERS, REMOVE_NEAR_USERS, UPDATE_NEAR_USERS, SENT_INVITE_NEAR_USER, UPDATE_INVITE_STATUS_NEAR_USER, INIT_NEAR_USERS, RESET_NEAR_USERS } from './actionTypes'
import { NearUsersActionProps, NearByUsersProps } from './types';
import { InvitationStatusOptions } from '../invitations/tsTypes';
import { update_nearBy } from '../../utils/functions';

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
        case UPDATE_INVITE_STATUS_NEAR_USER:
            return {
                ...state,
                nearBy: update_nearBy(state.nearBy, action.payload.uid, action.payload.status)
            }
        case SENT_INVITE_NEAR_USER:
            return {
                ...state,
                nearBy: update_nearBy(state.nearBy, action.payload.uid)
            }
        case RESET_NEAR_USERS:
            return INITIAL_STATE
        default:
            return state
    }
}