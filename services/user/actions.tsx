import { SET_USER, REMOVE_USER, SET_LOCATION, UPDATE_LOCATION, SET_GALLERY, GO_ONLINE, UPDATE_PROFILE, UPDATE_PRIVACY, INIT_USER, REMOVE_BLOCKED_USERS, ADD_BLOCKED_USERS, UPDATE_STATUS_MESSAGE } from './actionTypes';
import { set_loading, remove_loading, set_banner } from '../banner/actions';
import { AppDispatch } from '../../App';
import { CtryStateCityProps, UserRootStateProps, NewGalleryItemProps, GalleryItemProps, UpdateUserProfileProps, UpdateUserPrivacyProps, NewProfileImgProps, BlockUserProps, InterviewProps } from './types';
import { LocationObject } from 'expo-location';
import { fireDb_init_user_location, fetch_profile, fireDb_update_user_location, cache_user_images } from './utils';
import { validate_near_users, reset_near_users } from '../near_users/actions';
import * as Location from 'expo-location';
import { RootProps } from '..';
import { locationSpeedToUpdate, locationDistanceIntervalToUpdate, UsersDb, timestamp, LocationsDb, FriendsDb } from '../../utils/variables'
import { fireStorage, fireDb, myFire, realDb } from '../firebase';
import firebase from 'firebase';
import { cacheImage } from '../../utils/functions';
import { reset_chat } from '../chat/actions';
import { reset_friends } from '../friends/actions';
import { reset_invitations } from '../invitations/actions';
import { reset_history } from '../profile/actions';
import _, { isEmpty } from 'lodash';

export const verifyAuth = (): any => (dispatch: AppDispatch) => {
    myFire.auth().onAuthStateChanged(async (user) => {
        dispatch(set_loading)
        if (user) {

            //get the user profile and chatIds
            var fetchedUser: { profile: UserRootStateProps } | undefined | 'new';

            try {
                fetchedUser = await fetch_profile(user.uid)
            } catch (err) {
                console.log(err);

                dispatch(set_banner("Oops! Something went wrong getting your profile.", 'error'))

            } finally {
                if (fetchedUser) {

                    if (fetchedUser === 'new') {

                        dispatch({ type: INIT_USER, payload: { uid: user.uid } });

                    } else if (fetchedUser.profile) {

                        var { gallery, statusMsg, bioLong, profileImg } = fetchedUser.profile

                        //cache gallery images
                        gallery = await cache_user_images(gallery)

                        //cache profile image
                        if (profileImg) {
                            let cacheResult = await cacheImage(profileImg.uri);
                            if (cacheResult) {
                                profileImg.cachedUrl = cacheResult
                            }
                        }

                        //set banner if profile information has not be initiated
                        // if (!statusMsg) dispatch(set_banner('Please complete your profile under settings, so other users can know more about you.', 'success'))

                        dispatch({ type: SET_USER, payload: fetchedUser.profile });
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

export const set_and_listen_user_location = (ctryStateCity: CtryStateCityProps, location: LocationObject) => async (dispatch: AppDispatch, getState: () => RootProps) => {

    //check if user is offline
    if (getState().user.offline) {
        dispatch(set_banner('you are offline', 'warning'))
        return;
    }


    try {
        //batch operation to init user location and perform the nesscary updates
        await fireDb_init_user_location(getState().user, ctryStateCity, location);
    } catch (e) {
        console.log(e)
        dispatch(set_banner('Something went wrong initializing your location', 'error'))
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
            await fireDb_update_user_location(user, newLocation);
        } catch (e) {
            console.log(e)
            dispatch(set_banner('Oops! Failed to update your location', 'error'))
        }

        dispatch({
            type: UPDATE_LOCATION,
            payload: {
                location: newLocation
            }
        })

        if (nearUsers.all.length > 0) validate_near_users(newLocation, nearUsers.nearBy, nearUsers.all, dispatch);

    })

    dispatch({
        type: SET_LOCATION,
        payload: {
            ctryStateCity: ctryStateCity,
            location: location,
            locationListener
        }
    })
}

export const save_gallery = (newGallery: NewGalleryItemProps[]) => async (dispatch: AppDispatch, getState: () => RootProps) => {

    if (newGallery.filter(img => !img.removed).length > 5) {
        dispatch(set_banner('Exceeds the maxium number of images of 5.', 'error'))
        return;
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

            await fireStorage.ref().child(path).put(blob)
                .then(async (snapshot) => {
                    await snapshot.ref.getDownloadURL()
                        .then(downloadURL => {
                            gallery.push({ url: downloadURL, description, updatedAt: newUpdatedAt, id, name })
                        })
                })
                .catch((err) => {
                    console.log(err)
                    dispatch(set_banner('Error occured uploading image number' + (i + 1), 'error'))
                })
        } else {
            if (url && updatedAt) {
                gallery.push({ url, description, updatedAt, id, name })
            }
        }
    }

    await fireDb.collection(UsersDb).doc(uid).set({
        gallery: gallery,
        updatedAt: new Date(),
        timestamp: timestamp
    }, { merge: true })
        .then(async () => {
            //cache images and update gallery

            const cachedGallery = await cache_user_images(gallery)

            dispatch({
                type: SET_GALLERY,
                payload: { gallery: cachedGallery }
            });

            dispatch(set_banner('Gallery successfully updated!', 'success'));
        })
        .catch(err => {
            console.log(err)
            dispatch(set_banner('Images failed to save', 'error'));
        })
}

export const go_online = () => (dispatch: AppDispatch, getState: () => RootProps) => {
    const { uid } = getState().user

    fireDb.collection(UsersDb).doc(uid).update({ offline: false, timestamp: firebase.firestore.FieldValue.serverTimestamp(), updatedAt: new Date() })
        .then(() => dispatch({ type: GO_ONLINE, payload: undefined }))
        .catch((err) => {
            console.log(err)
            dispatch(set_banner('Oops! Failed to go offline. Please try again.', 'error'))
        })
}

export const update_profile = (updatedProfileVals: UpdateUserProfileProps, newProfileImg: NewProfileImgProps | undefined) => async (dispatch: AppDispatch, getState: () => RootProps) => {

    const { uid, profileImg } = getState().user;

    interface ProfileValsProp extends UpdateUserProfileProps {
        timestamp: any,
        updatedAt: Date,
        profileImg?: {
            uri: string,
            updatedAt: Date
        }
    }

    const profileVals: ProfileValsProp = {
        ...updatedProfileVals,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: new Date()
    }

    if (newProfileImg) {

        //delete previous image
        if (profileImg) {
            fireStorage.refFromURL(profileImg.uri).delete()
                .then(() => {
                    console.log('Removed previous profile image')
                })
                .catch((err) => {
                    console.log(err)
                    console.log('Failed to remove previous profile image')
                })
        }

        //upload new image
        var path: string = `${uid}/profile/${newProfileImg.name}`;

        var newProfileImgUri = await fireStorage.ref().child(path).put(newProfileImg.blob)
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
            profileVals.profileImg = {
                uri: newProfileImgUri,
                updatedAt: new Date()
            }
        }
    }

    await fireDb.collection(UsersDb).doc(uid).update(profileVals);

    //cache profile img
    profileVals.profileImg && cacheImage(profileVals.profileImg.uri)

    dispatch({ type: UPDATE_PROFILE, payload: profileVals });

    dispatch(set_banner('Successfully updated', 'success'));
}

export const update_privacy = (updatedPrivacyData: UpdateUserPrivacyProps) => async (dispatch: AppDispatch, getState: () => RootProps) => {

    const { uid, locationListener } = getState().user;

    if (updatedPrivacyData.offline) {
        if (locationListener) locationListener.remove()
    }

    await fireDb.collection(UsersDb).doc(uid).update({ ...updatedPrivacyData, timestamp: firebase.firestore.FieldValue.serverTimestamp(), updatedAt: new Date() });
    dispatch({ type: UPDATE_PRIVACY, payload: updatedPrivacyData });
    dispatch(set_banner('Saved', 'success'));
}

export const update_block_user = (blockedUser: BlockUserProps) => async (dispatch: AppDispatch, getState: () => RootProps) => {
    const { uid, blockedUsers } = getState().user;

    if (!blockedUser || !blockedUser.uid || !blockedUser.username) {
        dispatch(set_banner("Unable to find the user's information.", 'error'))
        return;
    }

    const foundBlockedUser = blockedUsers.find(user => user.uid == blockedUser.uid)

    const action = foundBlockedUser ? firebase.firestore.FieldValue.arrayRemove(foundBlockedUser) : firebase.firestore.FieldValue.arrayUnion(blockedUser);

    await fireDb.collection(UsersDb).doc(uid).update({
        blockedUsers: action
    })
        .then(() => {
            dispatch({
                type: foundBlockedUser ? REMOVE_BLOCKED_USERS : ADD_BLOCKED_USERS,
                payload: blockedUser
            })
        })
        .catch((err) => {
            console.log(err)
            dispatch(set_banner("Oops! Something went wrong adding the user to your block list.", 'error'))
        })

}

export const update_status_message = (statusMsg: string) => async (dispatch: AppDispatch, getState: () => RootProps) => {
    if (isEmpty(statusMsg)) {
        dispatch(set_banner('Found an empty status message. Please try again.', 'error'))
        return;
    }

    if (statusMsg.length > 100) {
        dispatch(set_banner('Status message must be 100 characters or less. Please try again.', 'error'))
        return;
    }

    const { uid, ctryStateCity } = getState().user;

    var batch = fireDb.batch()

    const userRef = fireDb.collection(UsersDb).doc(uid)
    const locationRef = fireDb.collection(LocationsDb).doc(ctryStateCity.ctryState).collection(ctryStateCity.city).doc(uid)

    userRef.update({ statusMsg })
    locationRef.update({ statusMsg })

    try {
        batch.commit()
    } catch (err) {
        console.log(err)
        dispatch(set_banner("Oops! Something went wrong trying to update your status. Please try again", 'error'))
    }

    dispatch({ type: UPDATE_STATUS_MESSAGE, payload: { statusMsg } })

}

export const sign_out = () => async (dispatch: AppDispatch, getState: () => RootProps) => {

    const { uid } = getState().user

    //remove notification token
    try {
        await realDb.ref(`tokens/${uid}/notification/`).remove()
            .catch((err) => {
                console.log(err)
            })
    } catch (err) {
        console.log(err)
        dispatch(set_banner('Oops! Something happened trying to sign out', 'error'))
        return;
    }

    myFire.auth().signOut().then(() => {
        dispatch(set_banner('signed out', 'success'))
    })
        .catch((err) => {
            console.log(err)
            dispatch(set_banner('Oops! Something happened trying to sign out', 'error'))
        })
}

export const remove_account = (phoneNumber: string, ctryCode: string | number) => async (dispatch: AppDispatch, getState: () => RootProps) => {
    const { uid, ctryStateCity, location } = getState().user;
    const user = myFire.auth().currentUser


    if (!uid || !user) {
        dispatch(set_banner("We can't find your user id right now. Please try again", "error"))
        return;
    }

    const formattedPhoneNum = ctryCode + phoneNumber.replace(/[^0-9]/g, '');
    console.log(formattedPhoneNum)

    if (formattedPhoneNum.length < 3) {
        dispatch(set_banner("Please enter a valid number.", "error"))
        return;
    }

    if (formattedPhoneNum !== user.phoneNumber) {
        dispatch(set_banner("Incorrect phone number. Please try again.", "error"))
        return;
    }

    var batch = fireDb.batch();

    var UsersDbRef = fireDb.collection(UsersDb).doc(uid)
    batch.delete(UsersDbRef)

    var FriendsRef = fireDb.collection(FriendsDb).doc(uid)
    batch.delete(FriendsRef)

    if (ctryStateCity && location) {
        var LocationsRef = fireDb.collection(LocationsDb).doc(ctryStateCity.ctryState).collection(ctryStateCity.city).doc(uid)
        batch.delete(LocationsRef)
    }

    try {
        await batch.commit()
    } catch (err) {
        console.log(err)
        dispatch(set_banner("Oops! Failed to delete your account. Please contact us directly to remove your account or try again", "error"))
        return;
    }


    myFire.auth().signOut().then(() => {
        dispatch(set_banner('Acount successfully removed.', 'success'))
    })
        .catch((err) => {
            console.log(err)
            dispatch(set_banner("Oops! Failed to delete your account. Please contact us directly to remove your account or try again", "error"))
        })
}