import { SET_NEAR_USERS, REMOVE_NEAR_USERS, UPDATE_NEAR_USERS, SENT_INVITATION_UPDATE_USER } from './actionTypes'
import { NearUsersActionProps, NearUsersRootProps } from './tsTypes';
import { UserRootStateProps } from '../user/tsTypes';
const INITIAL_STATE = {
    nearBy: [],
    all: [],
    fetched: false
}

export default (state: NearUsersRootProps = INITIAL_STATE, action: NearUsersActionProps) => {
    switch (action.type) {
        case SET_NEAR_USERS:
            let payloadSet = action.payload as NearUsersRootProps
            return {
                nearBy: payloadSet.nearBy,
                all: payloadSet.all,
                fetched: true
            }
        case REMOVE_NEAR_USERS:
            return {
                users: [],
                fetched: false
            }
        case UPDATE_NEAR_USERS:
            let payloadUpdate = action.payload as NearUsersRootProps
            return {
                ...state,
                nearBy: payloadUpdate.nearBy
            }
        case SENT_INVITATION_UPDATE_USER:
            let uid = action.payload as UserRootStateProps['uid'];
            //find the nearUser in nearBy and update sentInvite to true
            for (let i = 0; i < state.nearBy.length; i++) {
                if (uid === state.nearBy[i].uid) {
                    state.nearBy[i].sentInvite = true
                    break;
                }
            }
            return state;
        default:
            return state
    }
}