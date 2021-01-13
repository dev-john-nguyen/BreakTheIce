import { INSERT_HISTORY } from './actionTypes';
import { TimelineActionProp } from './tsTypes';

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
        default:
            return state;
    }
}