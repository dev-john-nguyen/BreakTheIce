import { SET_USER, REMOVE_USER, SET_LOCATION, UPDATE_LOCATION, USER_FETCHED_FAILED, SET_GALLERY, GO_OFFILINE, GO_ONLINE, UPDATE_PROFILE, UPDATE_PRIVACY } from './actionTypes';
import { set_loading, remove_loading, set_status_bar, set_banner } from '../utils/actions';
import { AppDispatch } from '../../App';
import { StateCityProps, UserRootStateProps, NewGalleryItemProps, GalleryItemProps, UpdateUserProfileProps, UpdateUserPrivacyProps, NewProfileImgProps, ProfileImgProps } from './types';
import { LocationObject } from 'expo-location';
import { fireDb_init_user_location, fetch_profile, fireDb_update_user_location, cache_user_images } from './utils';
import { validate_near_users, reset_near_users } from '../near_users/actions';
import * as Location from 'expo-location';
import { RootProps } from '..';
import { locationSpeedToUpdate, locationDistanceIntervalToUpdate, LocationsUsersDb, LocationsDb, UsersDb } from '../../utils/variables'
import { SET_ERROR } from '../utils/actionTypes';
import { fireStorage, fireDb, myFire } from '../firebase';
import firebase from 'firebase';
import { cacheImage } from '../../utils/functions';
import { reset_chat } from '../chat/actions';
import { reset_friends } from '../friends/actions';
import { reset_invitations } from '../invitations/actions';
import { reset_history } from '../profile/actions';

// import { PlaceProp, TimelineLocationProps } from '../profile/tsTypes';
// const baseUrl = 'http://localhost:5050';

export const verifyAuth = (): any => (dispatch: AppDispatch) => {
    myFire.auth().onAuthStateChanged(async (user) => {
        dispatch(set_loading)
        if (user) {

            //get the user profile and chatIds
            var fetchUserRes: { profile: UserRootStateProps } | undefined;

            try {
                fetchUserRes = await fetch_profile(user.uid)
            } catch (err) {
                console.log(err);

                dispatch(set_banner("Oops! Something went wrong getting your profile.", 'error'))

            } finally {
                if (fetchUserRes) {

                    //check if profile data exists
                    if (fetchUserRes.profile) {

                        var { gallery, bioShort, bioLong, profileImg } = fetchUserRes.profile

                        //cache gallery images
                        gallery = await cache_user_images(gallery, 'cachedUrl')

                        //cache profile image
                        if (profileImg) {
                            let cacheResult = await cacheImage(profileImg.uri);
                            if (cacheResult) {
                                profileImg.cachedUrl = cacheResult
                            }
                        }

                        //set banner if profile information has not be initiated
                        if (!bioShort || !bioLong) dispatch(set_banner('Please complete your profile under settings, so other users can know more about you.', 'success'))

                        dispatch({ type: SET_USER, payload: fetchUserRes.profile });
                    } else {
                        dispatch(set_banner("Looks like we couldn't get your profile", 'error'))
                    }

                } else {
                    dispatch(set_banner("Oops! Something went wrong getting your profile.", 'error'))
                }
            }

        } else {
            dispatch({ type: REMOVE_USER, payload: undefined })
            dispatch(reset_chat())
            dispatch(reset_friends())
            dispatch(reset_invitations())
            dispatch(reset_history())
            dispatch(reset_near_users())
        }
        dispatch(remove_loading)
    });
}

export const set_and_listen_user_location = (stateCity: StateCityProps, location: LocationObject) => async (dispatch: AppDispatch, getState: () => RootProps) => {

    //check if user is offline
    if (getState().user.offline) {
        dispatch(set_banner('you are offline', 'warning'))
        return;
    }


    try {
        //batch operation to init user location and perform the nesscary updates
        await fireDb_init_user_location(getState().user, stateCity, location);
    } catch (e) {
        console.log(e)
        dispatch({
            type: SET_ERROR,
            payload: 'Something went wrong initializing your location'
        })
        return;
    }

    const locationListener = await Location.watchPositionAsync({ distanceInterval: locationDistanceIntervalToUpdate }, async (newLocation) => {
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
            await fireDb_update_user_location(user.uid, user.stateCity, newLocation);
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
            location: location,
            locationListener
        }
    })
}

export const save_gallery = (newGallery: NewGalleryItemProps[]) => async (dispatch: AppDispatch, getState: () => RootProps) => {

    if (newGallery.length > 5) {
        return dispatch(set_banner('Exceeds the maxium number of images of 5.', 'error'))
    }

    const uid = getState().user.uid;
    var gallery: GalleryItemProps[] = [];

    //process items that only have blobs

    for (let i = 0; i < newGallery.length; i++) {
        var { blob, description, id, url, updatedAt, name, removed } = newGallery[i]

        if (removed) {
            var path: string = `${uid}/gallery/${name}`;
            fireStorage.ref().child(path).delete()
                .then(() => {
                    console.log('successfully deleted')
                })
                .catch((err) => {
                    console.log(err)
                })
            continue;
        }

        if (blob) {
            var path: string = `${uid}/gallery/${name}`;
            var newUpdatedAt: Date = new Date();
            var uploadTask = fireStorage.ref().child(path).put(blob)

            try {
                await image_task_listener(uploadTask, dispatch, i, newGallery.length)
                    .then((genUrl: string) => gallery.push({ url: genUrl, description, updatedAt: newUpdatedAt, id, name }))
            } catch (e) {
                dispatch(set_banner(e, 'error'))
            }
        } else {
            if (url && updatedAt) {
                gallery.push({ url, description, updatedAt, id, name })
            }
        }
    }

    fireDb.collection(UsersDb).doc(uid).set({
        gallery: gallery
    }, { merge: true })
        .then(async () => {
            //cache images and update gallery

            const cachedGallery = await cache_user_images(gallery, 'cachedUrl')

            dispatch({
                type: SET_GALLERY,
                payload: { gallery: cachedGallery }
            });

            dispatch(set_status_bar(0));
            dispatch(set_banner('Gallery successfully updated!', 'success'));
        })
        .catch(err => {
            return dispatch({
                type: SET_ERROR,
                payload: 'No images saved'
            })
        })
}

async function image_task_listener(uploadTask: firebase.storage.UploadTask, dispatch: AppDispatch, index: number, galleryLen: number): Promise<string> {

    return new Promise(function (resolve, reject) {
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function (snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes);

                var progress = (uploadProgress + index) / galleryLen

                dispatch(set_status_bar(progress))

                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        dispatch(set_banner('Imaged paused', 'warning'))
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        break;
                }
            }, function (error) {
                console.log(error)

                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                var errMsg: string = '';

                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        errMsg = "Permission denied. You don't have access."
                        break;

                    case 'storage/canceled':
                        // User canceled the upload
                        errMsg = "The upload was cancelled."
                        break;

                    default:
                        errMsg = 'Unexpected error occurred. Please try again.'
                }

                reject(errMsg)

            }, function () {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    resolve(downloadURL)
                });

            });
    })
}

export const go_offline = () => (dispatch: AppDispatch, getState: () => RootProps) => {
    const { uid, stateCity, locationListener } = getState().user

    //remove listener
    if (locationListener) locationListener.remove()

    var batch = fireDb.batch()

    const locationRef = fireDb.collection(LocationsDb).doc(stateCity.state).collection(stateCity.city).doc(uid)

    const userRef = fireDb.collection(UsersDb).doc(uid)

    batch.update(userRef, { offline: true })

    batch.delete(locationRef)

    batch.commit()
        .then(() => {
            dispatch({ type: GO_OFFILINE, payload: undefined })
        })
        .catch(err => {
            console.log(err)
            dispatch(set_banner('Failed to go offiline.', 'error'))
        })
}

export const go_online = () => (dispatch: AppDispatch, getState: () => RootProps) => {
    const { uid } = getState().user

    fireDb.collection(UsersDb).doc(uid).update({ offline: false })
        .then(() => dispatch({ type: GO_ONLINE, payload: undefined }))
        .catch((err) => {
            console.log(err)
            dispatch(set_banner('Oops! Failed to go offline. Please try again.', 'error'))
        })
}

export const update_profile = (updatedProfileVals: UpdateUserProfileProps, profileImg: NewProfileImgProps | undefined) => async (dispatch: AppDispatch, getState: () => RootProps) => {

    const { uid } = getState().user;

    var newProfileImg: ProfileImgProps | undefined;

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
            newProfileImg = {
                uri: newProfileImgUri,
                updatedAt: new Date()
            }
        }
    }

    const initProfileVals = {
        ...updatedProfileVals,
        profileImg: newProfileImg ? newProfileImg : null
    }

    await fireDb.collection(UsersDb).doc(uid).update(initProfileVals);

    //cache profile img
    initProfileVals.profileImg && cacheImage(initProfileVals.profileImg.uri)

    dispatch({ type: UPDATE_PROFILE, payload: initProfileVals });

    dispatch(set_banner('Saved', 'success'));
}

export const update_privacy = (updatedPrivacyData: UpdateUserPrivacyProps) => async (dispatch: AppDispatch, getState: () => RootProps) => {

    const { uid } = getState().user;

    await fireDb.collection(UsersDb).doc(uid).update(updatedPrivacyData);
    dispatch({ type: UPDATE_PRIVACY, payload: updatedPrivacyData });
    dispatch(set_banner('Saved', 'success'));
}

export const sign_out = () => async (dispatch: AppDispatch) => {
    myFire.auth().signOut().then(() => {
        dispatch(set_banner('signed out', 'success'))
    })
        .catch((err) => {
            console.log(err)
            dispatch(set_banner('Oops! Something happened trying to sign out', 'error'))
        })
}

export const send_password_reset_email = (email: string) => (dispatch: AppDispatch) => {
    var user = myFire.auth().currentUser;

    if (!user || !user.email) {
        dispatch(set_banner("Oops! couldn't find your email", "error"))
        return;
    }

    if (user.email != email) {
        dispatch(set_banner("Email doesn't match what we have on file. Please try again.", "error"))
        return;
    }


    myFire.auth().sendPasswordResetEmail(user.email)
        .then(() => {
            dispatch(set_banner(`Email sent to ${user?.email}. Please follow the direction to reset your password.`, 'success'))
        })
        .catch((err) => {
            console.log(err)
            dispatch(set_banner(`Failed to send email to ${user?.email}. Please try again or contact us directly.`, 'error'))
        })
}
