import { SET_USER, REMOVE_USER, REMOVE_LOCATION, SET_LOCATION, UPDATE_LOCATION, USER_FETCHED_FAILED, SET_GALLERY, GO_OFFILINE, GO_ONLINE, UPDATE_PROFILE, UPDATE_PRIVACY } from './actionTypes';
import { UserActionProps } from './user.types';
import { TimelineLocationProps, PlaceProp } from '../profile/tsTypes';


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
    fetchFail: false,
    gallery: [],
    timeline: []
}

export default (state = INITIAL_STATE, action: UserActionProps) => {

    switch (action.type) {
        case USER_FETCHED_FAILED:
            return {
                ...state,
                fetchFail: true
            }
        case SET_USER:
            return action.payload;
        case REMOVE_USER:
            return {
                ...state,
                uid: null
            }
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

function update_timeline(timeline: TimelineLocationProps[], { timelineLocDocId, placesVisited }: { timelineLocDocId: string, placesVisited: PlaceProp[] }) {

    for (let i = 0; i < timeline.length; i++) {
        if (timeline[i].docId == timelineLocDocId) {
            timeline[i].placesVisited = placesVisited
            break;
        }
    }

    return [...timeline]
}