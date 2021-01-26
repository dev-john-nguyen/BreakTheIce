import firebase from 'firebase';
import { AppDispatch } from '../../App';
import { set_banner } from '../utils/actions';
import { SignUpValuesProps, InitFormValues, InitUserProps } from './types';
import { fireDb } from '../firebase';
import { UsersDb, regexName, regexUsername } from '../../utils/variables';
import { RootProps } from '..';
import { SET_USER } from '../user/actionTypes';
import { UserProfilePreviewProps } from '../user/types';

export const init_user = (userFormValues: InitFormValues) => async (dispatch: AppDispatch, getState: () => RootProps) => {

    const { uid } = getState().user

    if (!uid) {
        dispatch(set_banner('Unable to identify your user credentials. Please try again.', 'error'))
        return
    }

    if (!validate_form_values(userFormValues, (msg) => {
        dispatch(set_banner(msg, 'error'))
    })) return;

    const { name, age, username } = userFormValues;

    //check if username is already taken...
    const usernameValid = await fireDb.collection(UsersDb).where('username', '==', username).limit(1).get()
        .then(querySnapshot => {
            if (querySnapshot.docs.length > 0) {
                return false
            }
            return true
        })
        .catch(err => {
            console.log(err)
            dispatch(set_banner('Oops! Unexpected error occurred validating your username. Please try again.', 'error'))
        })

    if (!usernameValid) {
        dispatch(set_banner('Username already taken. Please try another username.', 'error'))
        return;
    }

    //init firestore user data in user collection
    return fireDb.collection(UsersDb).doc(uid).set({ name, age, username, uid, createdAt: new Date(), timestamp: firebase.firestore.FieldValue.serverTimestamp() })
        .then(() => {

            const newUser: InitUserProps = {
                uid,
                age,
                username,
                bioShort: '',
                hideOnMap: false,
                profileImg: null,
                gallery: []
            }

            dispatch({
                type: SET_USER,
                payload: newUser
            })

            return true;
        })
        .catch((err) => {
            console.log(err)
            dispatch(set_banner('Oops! Something went wrong initializing your account.', 'error'))
        })
}

export function validate_form_values(userFormValues: InitFormValues, setErrMsg: (msg: string) => void) {
    const { name, age, username } = userFormValues;

    if (username.length < 8 || username.length > 20) {
        setErrMsg('Username must be 8 to 20 characters long')
        return false
    }

    if (!regexUsername.test(username)) {
        setErrMsg("Invalid username provided. Please try again.")
        return false
    }

    if (!name.length) {
        setErrMsg("Please fill out the name field.")
        return false
    }

    if (!regexName.test(name)) {
        setErrMsg("Invalid name provided. Please try again.")
        return;
    }

    if (age < 1 || age > 100) {
        setErrMsg('Invalid age provided. Please try again.')
        return false
    }

    return true
}