import { SET_USER, REMOVE_USER, REMOVE_LOCATION, SET_LOCATION, UPDATE_LOCATION, USER_FETCHED_FAILED, SET_USER_TIMELINE, UPDATE_PLACES_VISITED, ADD_NEW_TIMELINE_LOCATION, REMOVE_NEW_TIMELINE_LOCATION, UPDATE_NEW_TIMELINE_LOCATION, SET_GALLERY } from './actionTypes';
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
                stateCity: action.payload.stateCity
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



        case SET_USER_TIMELINE:
            return {
                ...state,
                timeline: action.payload
            }
        case UPDATE_PLACES_VISITED:
            return {
                ...state,
                timeline: update_timeline(state.timeline, action.payload)
            }
        case ADD_NEW_TIMELINE_LOCATION:
            return {
                ...state,
                timeline: [...state.timeline, action.payload]
            }
        case REMOVE_NEW_TIMELINE_LOCATION:
            return {
                ...state,
                timeline: () => {
                    const docId: string = action.payload.timelineLocDocId;
                    const timeline: TimelineLocationProps[] = state.timeline;

                    for (let i = 0; i < timeline.length; i++) {
                        if (timeline[i].docId == docId) {
                            timeline.splice(i, 1)
                            break;
                        }
                    }
                    return [...timeline]
                }
            }
        case UPDATE_NEW_TIMELINE_LOCATION:
            return {
                ...state,
                timeline: () => {
                    const timelineLocObj: TimelineLocationProps = action.payload.timelineLocObj;
                    const timeline: TimelineLocationProps[] = state.timeline;

                    for (let i = 0; i < timeline.length; i++) {
                        if (timeline[i].docId == timelineLocObj.docId) {
                            timeline[i] = timelineLocObj
                            break;
                        }
                    }

                    return [...timeline]
                }
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