import { SET_USER, REMOVE_USER, REMOVE_LOCATION, SET_LOCATION, UPDATE_LOCATION, USER_FETCHED_FAILED, SET_USER_TIMELINE, UPDATE_PLACES_VISITED } from './actionTypes';
import { UserActionProps, UserRootStateProps } from './tsTypes';
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
            if (!action.payload) return state;
            return {
                ...state,
                location: action.payload.location
            }
        case SET_USER_TIMELINE:
            return {
                ...state,
                timeline: action.payload
            }
        case UPDATE_PLACES_VISITED:
            if (!action.payload) return state;
            return {
                ...state,
                timeline: update_timeline(state.timeline, action.payload)
            }
        default:
            return state;
    }
}

function update_timeline(timeline: TimelineLocationProps[], { locationDocId, placesVisited }: { locationDocId: string, placesVisited: PlaceProp[] }) {

    for (let i = 0; i < timeline.length; i++) {
        if (timeline[i].docId == locationDocId) {
            timeline[i].placesVisited = placesVisited
            break;
        }
    }

    return [...timeline]
}