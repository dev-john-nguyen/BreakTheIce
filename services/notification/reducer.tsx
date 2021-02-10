import { SET_EXPO_PUSH_TOKEN, REMOVE_EXPO_PUSH_TOKEN } from './actionTypes';


const INITIAL_STATE = {
    expoPushToken: ''
}

export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case SET_EXPO_PUSH_TOKEN:
            return {
                expoPushToken: action.payload
            }
        case REMOVE_EXPO_PUSH_TOKEN:
            return {
                expoPushToken: ''
            }
        default:
            return state;
    }
}