import { SET_USER, REMOVE_USER, REMOVE_LOCATION, SET_LOCATION, UPDATE_LOCATION, USER_FETCHED_FAILED } from './actionTypes';
import { UserActionProps, UserRootStateProps } from './tsTypes';


const INITIAL_STATE = {
    uid: null,
    username: null,
    location: {
        coords: null,
        timestamp: null
    },
    stateCity: null,
    name: null,
    age: null,
    bioLong: null,
    bioShort: null,
    gender: null,
    private: false,
    fetchFail: false
}

export default (state: Object = INITIAL_STATE, action: UserActionProps) => {
    switch (action.type) {
        case USER_FETCHED_FAILED:
            return {
                ...state,
                fetchFail: true
            }
        case SET_USER:
            if (!action.payload) return state;
            return action.payload;
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
            if (!action.payload || !action.payload.location) return state;
            return {
                ...state,
                location: action.payload.location
            }
        default:
            return state;
    }
}