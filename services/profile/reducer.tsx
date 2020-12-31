import { SET_TIMELINE, SET_CUR_PROFILE, REMOVE_CUR_PROFILE } from './actionTypes';
import { TimelineActionProp } from './tsTypes';

const INITIAL_STATE = {
    current: {},
    history: []
}

export default (state = INITIAL_STATE, action: TimelineActionProp) => {
    switch (action.type) {
        case SET_TIMELINE:
            return {
                history: action.payload
            }
        case SET_CUR_PROFILE:
            return {
                ...state,
                current: action.payload
            }
        case REMOVE_CUR_PROFILE:
            return {
                ...state,
                current: {}
            }
        default:
            return state;
    }
}