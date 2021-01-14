import { SET_MESSAGES, SET_CHAT_PREVIEWS, SET_FETCHED } from './actionTypes';
import { ChatActionProps, ChatRootProps } from './types';

const INITIAL_STATE = {
    fetched: false,
    ids: [],
    rooms: [],
    previews: [],
    chatListener: undefined
}


export default (state = INITIAL_STATE, action: ChatActionProps) => {
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
                fetched: true,
                chatListener: action.payload.chatListener
            }
        default:
            return state;
    }
}