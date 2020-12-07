import { SET_USER, REMOVE_USER, REMOVE_LOCATION, SET_LOCATION, UPDATE_LOCATION } from './actionTypes';
import { UserActionProps } from './tsTypes';


const INITIAL_STATE = {
    uid: null,
    location: {
        coords: null,
        timestamp: null
    },
    stateCity: null
}

export default (state: Object = INITIAL_STATE, action: UserActionProps) => {
    switch (action.type) {
        case SET_USER:
            if (!action.payload) return state;
            return {
                ...state,
                uid: action.payload.uid
            }
        case REMOVE_USER:
            return {
                ...state,
                uid: null
            }
        case SET_LOCATION:
            if (!action.payload) return state;
            return {
                ...state,
                location: action.payload.location,
                stateCity: action.payload.stateCity
            }
        case REMOVE_LOCATION:
            return {
                ...state,
                location: null,
                stateCity: null
            }
        case UPDATE_LOCATION:
            if (!action.payload || !action.payload.location) return;
            return {
                ...state,
                location: action.payload.location
            }
        default:
            return state;
    }
}