import { SET_MESSAGES } from './actionTypes';
import { ChatActionProps } from './tsTypes';

const INITIAL_STATE = {
    ids: [],
    rooms: []
}


export default (state = INITIAL_STATE, action: ChatActionProps) => {
    switch (action.type) {
        case SET_MESSAGES:
            return {
                ids: action.payload
            }
        default:
            return state;
    }
}