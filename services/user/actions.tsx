import { SET_USER, REMOVE_USER, SET_LOCATION, UPDATE_LOCATION } from './actionTypes';
import { set_error, set_loading, remove_loading } from '../utils/actions';
// import firebase from 'firebase/app';
import { firebase } from '../firebase';
import { fireDb } from '../../App';
import { RootState, AppDispatch } from '../../App';
import { StateCityProps } from './tsTypes';
import { LocationObject } from 'expo-location';
import { updateProfileLocationStateCity, updateUserLocationCoords } from './utils';
// const baseUrl = 'http://localhost:5050';



export const verifyAuth = (): any => (dispatch: AppDispatch) => {
    firebase.auth().onAuthStateChanged((user) => {
        dispatch(set_loading)
        if (user) {
            dispatch({
                type: SET_USER,
                payload: { uid: user.uid }
            });
        } else {
            dispatch({ type: REMOVE_USER })
        }
        dispatch(remove_loading)
    });
}


export const update_user_location = (uid: string, stateCity: StateCityProps, location: LocationObject) => async (dispatch: AppDispatch) => {
    if (!location.coords) return;

    try {
        await updateUserLocationCoords(uid, location, stateCity);
    } catch (e) {
        console.log(e)
    }

    dispatch({
        type: UPDATE_LOCATION,
        payload: { location }
    })
}

export const set_user_location = (uid: string, stateCity: StateCityProps, location: LocationObject) => async (dispatch: AppDispatch) => {

    try {
        //update server user location and remove coords from Location collection if need be
        await updateProfileLocationStateCity(uid, stateCity);

        //update Location collection with the users current zip
        await updateUserLocationCoords(uid, location, stateCity);

    } catch (e) {
        console.log(e)
    }

    dispatch({
        type: SET_LOCATION,
        payload: {
            stateCity: stateCity,
            location: location
        }
    })
}

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