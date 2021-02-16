import firebase from 'firebase';
import { AppDispatch } from '../../App';
import { set_banner } from '../banner/actions';
import { InitFormValues, InitUserProps } from './types';
import { fireDb, fireStorage } from '../firebase';
import { UsersDb, regexName, regexUsername } from '../../utils/variables';
import { RootProps } from '..';
import { SET_USER, UPDATE_PROFILE, SET_GALLERY } from '../user/actionTypes';
import { NewGalleryItemProps, UpdateUserProfileProps, NewProfileImgProps, GalleryItemProps } from '../user/types';
import { cache_user_images } from '../user/utils';
import { cacheImage } from '../../utils/functions';

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
    const usernameValid = await fireDb.collection(UsersDb).where('username', '==', username).get()
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
                name,
                statusMsg: '',
                hideOnMap: false,
                profileImg: null,
                blockedUsers: [],
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

export const init_account = (interview: UpdateUserProfileProps['interview'], profileImg: NewProfileImgProps | undefined, gallery: NewGalleryItemProps[]) => async (dispatch: AppDispatch, getState: () => RootProps) => {
    const { uid } = getState().user

    var profileImgUri: {
        uri: string,
        updatedAt: Date
    } = {
        uri: '',
        updatedAt: new Date()
    };

    //upload profile image if exists
    if (profileImg) {
        //upload new image
        var path: string = `${uid}/profile/${profileImg.name}`;

        var newProfileImgUri = await fireStorage.ref().child(path).put(profileImg.blob)
            .then(async (snapshot) => {
                return await snapshot.ref.getDownloadURL()
                    .then((downloadURL) => {
                        return downloadURL
                    })
                    .catch(err => {
                        console.log(err)
                        dispatch(set_banner("Oops! Looks like we failed to retrieve the uploaded image. Try uploading again", 'error'))
                    })
            })
            .catch((err) => {
                console.log(err)
                dispatch(set_banner('Oops! Something went wrong uploading your new profile image.', 'error'))
            })

        if (newProfileImgUri) {
            profileImgUri.uri = newProfileImgUri
        }
    }


    //upload gallery photos if exists
    const uploadedPhotos: GalleryItemProps[] = [];

    if (gallery.length > 0) {
        for (let i = 0; i < gallery.length; i++) {
            var { blob, description, id, url, updatedAt, name, removed } = gallery[i]

            if (blob) {
                var path: string = `${uid}/gallery/${name}`;
                var newUpdatedAt: Date = new Date();

                await fireStorage.ref().child(path).put(blob)
                    .then(async (snapshot) => {
                        await snapshot.ref.getDownloadURL()
                            .then(downloadURL => {
                                uploadedPhotos.push({ url: downloadURL, description, updatedAt: newUpdatedAt, id, name })
                            })
                    })
                    .catch((err) => {
                        console.log(err)
                        dispatch(set_banner('Error occured uploading image number' + (i + 1), 'error'))
                    })
            } else {
                dispatch(set_banner(`Error uploading photo number ${i + 1}`, 'error'))
            }
        }
    }


    try {
        await fireDb.collection(UsersDb).doc(uid).update({
            interview,
            gallery: uploadedPhotos,
            profileImg: profileImgUri
        });
    } catch (err) {
        console.log(err)
        dispatch(set_banner("Oops! We had trouble saving your information. Please contact us directly or try again.", "error"))
        return;
    }

    const cachedGallery = await cache_user_images(uploadedPhotos)
    const profileImgCachedUrl = await cacheImage(profileImgUri.uri)

    dispatch({
        type: SET_USER, payload: {
            interview,
            profileImg: {
                ...profileImgUri,
                cachedUrl: profileImgCachedUrl
            },
            gallery: cachedGallery,
            init: false,
        }
    })
}

