import { SET_MESSAGES, SET_CHAT_PREVIEWS, SET_FETCHED } from './actionTypes';
import { ChatActionProps, ChatRootProps } from './tsTypes';

const INITIAL_STATE = {
    fetched: false,
    ids: [],
    rooms: [],
    previews: [],
}


export default (state: ChatRootProps = INITIAL_STATE, action: ChatActionProps) => {
    switch (action.type) {
        case SET_CHAT_PREVIEWS:
            return {
                ...state,
                previews: action.payload
            }
        case SET_MESSAGES:
            return {
                ids: action.payload
            }
        case SET_FETCHED:
            return {
                ...state,
                fetched: true
            }
        default:
            return state;
    }
}