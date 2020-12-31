import { SET_USER, REMOVE_USER, SET_LOCATION, UPDATE_LOCATION, USER_FETCHED_FAILED, SET_USER_TIMELINE, UPDATE_PLACES_VISITED } from './actionTypes';
import { set_loading, remove_loading } from '../utils/actions';
import { firebase, fireDb } from '../firebase';
import { AppDispatch } from '../../App';
import { StateCityProps, UserRootStateProps } from './tsTypes';
import { LocationObject } from 'expo-location';
import { fireDb_init_user_location, fetch_profile, fireDb_update_user_location } from './utils';
import { validate_near_users } from '../near_users/actions';
import * as Location from 'expo-location';
import { RootProps } from '..';
import { locationSpeedToUpdate, locationDistanceIntervalToUpdate, UsersDb, UsersTimelineDb } from '../../utils/variables'
import { SET_MESSAGES } from '../chat/actionTypes';
import { SET_ERROR } from '../utils/actionTypes';
import { PlaceProp } from '../profile/tsTypes';
// const baseUrl = 'http://localhost:5050';

interface FetchUserProps {
    profile: UserRootStateProps;
    chatIds: Array<any>;
}

export const verifyAuth = (): any => (dispatch: AppDispatch) => {
    firebase.auth().onAuthStateChanged(async (user) => {
        dispatch(set_loading)
        if (user) {

            //get the user profile and chatIds
            var fetchUserRes: FetchUserProps | undefined;

            try {
                fetchUserRes = await fetch_profile(user.uid)
            } catch (err) {
                console.log(err);
                dispatch({
                    type: USER_FETCHED_FAILED,
                    payload: "Oops! Something went wrong getting your profile."
                })
            } finally {
                if (fetchUserRes) {

                    //check if profile data exists
                    if (fetchUserRes.profile) {
                        dispatch({
                            type: SET_USER,
                            payload: fetchUserRes.profile
                        });
                    } else {
                        dispatch({
                            type: USER_FETCHED_FAILED,
                            payload: "Looks like we couldn't get your profile"
                        })
                    }

                    //check if there are any chatIds
                    if (fetchUserRes.chatIds) {
                        dispatch({
                            type: SET_MESSAGES,
                            payload: fetchUserRes.chatIds
                        })
                    } else {
                        dispatch({
                            type: SET_ERROR,
                            payload: "Couldn't retrieve your messages"
                        })
                    }
                } else {
                    dispatch({
                        type: USER_FETCHED_FAILED,
                        payload: "Oops! Something went wrong getting your profile."
                    })
                }
            }

        } else {
            dispatch({ type: REMOVE_USER })
        }
        dispatch(remove_loading)
    });
}

export const set_and_listen_user_location = (stateCity: StateCityProps, location: LocationObject) => async (dispatch: AppDispatch, getState: () => RootProps) => {

    try {
        //batch operation to init user location and perform the nesscary updates
        await fireDb_init_user_location(getState().user, stateCity, location);
    } catch (e) {
        console.log(e)
        return dispatch({
            type: SET_ERROR,
            payload: 'Something went wrong initializing your location'
        })
    }

    Location.watchPositionAsync({ distanceInterval: locationDistanceIntervalToUpdate }, async (newLocation) => {
        //to allow user to go back to location region
        // this.setState({ userLocation: newLocation })

        // const { user, nearUsers, allUsers } = this.props

        const { user, nearUsers } = getState()

        //check if newLocation coords are available
        if (!newLocation.coords) return;

        //nothing updated in the coords so don't update
        if (user.location.coords.latitude == newLocation.coords.latitude &&
            user.location.coords.longitude == newLocation.coords.longitude
        ) return;

        //check to see how fast the user is traveling to prevent too many calls
        if ((newLocation.coords.speed && newLocation.coords.speed > locationSpeedToUpdate)) return;

        //update user location in the server
        try {
            await fireDb_update_user_location(getState().user, newLocation);
        } catch (e) {
            console.log(e)
            dispatch({
                type: SET_ERROR,
                payload: 'Oops! Failed to update your location'
            })
        }

        dispatch({
            type: UPDATE_LOCATION,
            payload: {
                location: newLocation
            }
        })

        if (nearUsers.all.length > 0) validate_near_users(newLocation, nearUsers.nearBy, nearUsers.all);

    })

    dispatch({
        type: SET_LOCATION,
        payload: {
            stateCity: stateCity,
            location: location
        }
    })
}

export const update_timeline_places_visited = (uid: string, locationDocId: string, placesVisited: PlaceProp[]) => async (dispatch: AppDispatch, getState: () => RootProps) => {
    if (uid !== getState().user.uid) {
        dispatch({
            type: SET_ERROR,
            payload: 'Invalid user id. Cannot proceed to save the updates.'
        })
        return;
    }

    //splice out the placesVisted that have removed as true
    for (let i = 0; i < placesVisited.length; i++) {
        //splice if removed is true
        if (placesVisited[i].removed) {
            placesVisited.splice(i, 1)
        }
    }

    return fireDb.collection(UsersDb).doc(uid).collection(UsersTimelineDb).doc(locationDocId).update({ placesVisited: placesVisited })
        .then(() => {
            dispatch({
                type: UPDATE_PLACES_VISITED,
                payload: { placesVisited, locationDocId }
            })

            return placesVisited
        })
        .catch(err => {
            console.log(err)
            dispatch({
                type: SET_ERROR,
                payload: 'Oops! Something went wrong with updating your edits.'
            })
        })
}

export const update_profile = () => {

}

// export const update_user_location = (uid: string, stateCity: StateCityProps, newLocation: LocationObject) => async (dispatch: AppDispatch, getState: () => RootProps) => {
//     if (!newLocation.coords) return;

//     try {
//         await fireDb_update_user_location(getState().user, newLocation);
//     } catch (e) {
//         console.log(e)
//         return
//     }

//     return dispatch({
//         type: UPDATE_LOCATION,
//         payload: { location }
//     })
// }

// export const set_user_location = (uid: string, stateCity: StateCityProps, newLocation: LocationObject) => async (dispatch: AppDispatch, getState: () => RootProps) => {
//     if (!newLocation.coords) return;

//     try {
//         //update server user location and remove coords from Location collection if need be
//         await fireDb_update_state_city(uid, stateCity);

//         //update Location collection with the users current zip
//         await fireDb_update_user_location(getState().user, newLocation);

//     } catch (e) {
//         console.log(e)
//     }

//     return dispatch({
//         type: SET_LOCATION,
//         payload: {
//             stateCity: stateCity,
//             location: location
//         }
//     })
// }

// export const sign_up = (email: string, password: string) => async (dispatch: AppDispatch) => {

//     firebase.auth().createUserWithEmailAndPassword(email, password)
//         .then((user) => {
//             console.log(user)
//             // Signed in 
//             // ...
//         })
//         .catch((error) => {
//             console.log(error)
//             var errorCode = error.code;
//             var errorMessage = error.message;
//         });

    // var response;

    // try {
    //     response = await axios.post(baseUrl + '/signup', { username, password })
    // } catch (e) {
    //     console.log(e)
    //     return dispatch({
    //         type: SET_ERROR,
    //         payload: 'Something went wrong'
    //     })
    // }

    // console.log(response.data)
    // return;

    // dispatch({
    //     type: SIGN_UP,
    //     payload: response.data
    // })
// }