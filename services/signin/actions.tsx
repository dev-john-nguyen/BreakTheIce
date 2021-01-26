import firebase from 'firebase';
import { AppDispatch } from '../../App';
import { set_banner } from '../utils/actions';
import { SignUpValuesProps, InitFormValues } from './types';
import { fireDb } from '../firebase';
import { UsersDb, regexName, regexUsername } from '../../utils/variables';
import { RootProps } from '..';
import { SET_USER } from '../user/actionTypes';
import { UserRootStateProps, UserProfilePreviewProps } from '../user/types';

export const login_user = (email: string, password: string) => async (dispatch: AppDispatch) => {

    if (!handleBaseValidation(email, password, dispatch)) return;

    return firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => { return true })
        .catch((error: any) => {
            console.log(error)
            dispatch(set_banner(handleErrorCodes(error), 'error'))
        })
}

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

            const newUser: Omit<UserProfilePreviewProps, 'location'> = {
                uid,
                age,
                username,
                bioShort: '',
                hideOnMap: false,
                profileImg: null,
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

export const signup_user = (userFormValues: SignUpValuesProps) => async (dispatch: AppDispatch) => {

    var key: keyof typeof userFormValues;

    for (key in userFormValues) {
        if (key === 'age') {
            if (userFormValues[key] < 1 || userFormValues[key] > 120) {
                dispatch(set_banner('Invalid age. Please reenter your age.', 'error'))
                return
            }
        } else {
            if (!userFormValues[key] || userFormValues[key].length < 2) {
                dispatch(set_banner(`${key} is invalid. Please try again`, 'error'))
                return;
            }
        }
    }

    const { email, password, name, age, username } = userFormValues;

    if (!handleBaseValidation(email, password, dispatch)) return;

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
        dispatch(set_banner('Username already take. Please try another username.', 'error'))
        return;
    }

    //init firebase auth account
    const newUserId = await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((res) => {
            if (res.user) {
                return res.user.uid
            }
            dispatch(set_banner('Oops! Something went wrong creating your account.', 'error'))
        })
        .catch((error: any) => {
            console.log(error)
            dispatch(set_banner(handleErrorCodes(error), 'error'))
        });

    if (!newUserId) return;


    //init firestore user data in user collection
    return fireDb.collection(UsersDb).doc(newUserId).set({ name, age, username, uid: newUserId, createdAt: new Date(), timestamp: firebase.firestore.FieldValue.serverTimestamp() })
        .then(() => {
            return true
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

const handleErrorCodes = (error: { code: string, message: string }) => {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'Email already exists. Please signin.'
        case 'auth/weak-password':
            return 'Password is too weak. Please try again.'
        case 'auth/invalid-email':
            return 'Invalid email';
        case 'auth/user-disabled':
            return 'Account has been disabled. Please contact us directly.'
        case 'auth/user-not-found':
            return 'Account not found. Please try again or signup.'
        case 'auth/wrong-password':
            return 'Wrong password. Please try again.'
        default:
            return error.message
    }
}

const handleBaseValidation = (email: string, password: string, dispatch: AppDispatch) => {
    if (!email || !password) {
        dispatch(set_banner('Please ensure you filled out all the fields', 'error'))
        return false
    }

    if (!ValidateEmail(email)) {
        dispatch(set_banner('Please enter a valid email', 'error'))
        return false
    }

    return true
}

function ValidateEmail(mail: string) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
        return (true)
    }
    return (false)
}