import { INSERT_HISTORY, UPDATE_INVITATION_HISTORY } from './actionTypes';
import { TimelineActionProp, ProfileUserProps } from './tsTypes';

const INITIAL_STATE = {
    history: []
}

export default (state = INITIAL_STATE, action: TimelineActionProp) => {
    switch (action.type) {
        case INSERT_HISTORY:
            return {
                ...state,
                history: [...state.history, action.payload]
            }
        case UPDATE_INVITATION_HISTORY:
            const newHistory = update_profile_invitation(state.history, action.payload.uid);

            if (!newHistory) return state;
            return {
                ...state,
                history: newHistory
            }
        default:
            return state;
    }
}

function update_profile_invitation(history: ProfileUserProps[], targetUid: string) {
    var update = false;

    var updatedHistory = history.map(profile => {
        if (profile.uid === targetUid) {
            profile.sentInvite = true;
            update = true
        }

        return profile
    })

    if (!update) return false;

    return updatedHistory
}