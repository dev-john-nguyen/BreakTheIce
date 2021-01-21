import { SET_USER, REMOVE_USER, REMOVE_LOCATION, SET_LOCATION, UPDATE_LOCATION, USER_FETCHED_FAILED, SET_GALLERY, GO_OFFILINE, GO_ONLINE, UPDATE_PROFILE, UPDATE_PRIVACY } from './actionTypes';
import { UserActionProps } from './types';

const INITIAL_STATE = {
    uid: '',
    username: '',
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
    fetchFail: false,
    gallery: [],
    timeline: [],
    hideOnMap: false,
    offline: false,
    locationListener: undefined
}

export default (state: any = INITIAL_STATE, action: UserActionProps) => {

    switch (action.type) {
        case USER_FETCHED_FAILED:
            return {
                ...INITIAL_STATE,
                fetchFail: true
            }
        case SET_USER:
            return action.payload;
        case REMOVE_USER:
            if (state.locationListener) {
                state.locationListener.remove()
            }
            return INITIAL_STATE
        case SET_LOCATION:
            return {
                ...state,
                location: action.payload.location,
                stateCity: action.payload.stateCity,
                locationListener: action.payload.locationListener,
                offline: false
            }
        case REMOVE_LOCATION:
            return {
                ...state,
                location: null,
                stateCity: null
            }
        case UPDATE_LOCATION:
            return {
                ...state,
                location: action.payload.location
            }
        case SET_GALLERY:
            return {
                ...state,
                gallery: action.payload.gallery
            }
        case GO_OFFILINE:
            return {
                ...state,
                offline: true
            }
        case GO_ONLINE:
            return {
                ...state,
                offline: false
            }
        case UPDATE_PROFILE:
        case UPDATE_PRIVACY:
            return {
                ...state,
                ...action.payload
            }

        default:
            return state;
    }
}