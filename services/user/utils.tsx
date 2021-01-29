import { fireDb } from '../firebase';
import { LocationsDb, UsersDb } from '../../utils/variables';
import { CtryStateCityProps, UserRootStateProps, GalleryItemProps, UserProfilePreviewProps, ProfileImgProps } from './types';
import { LocationObject } from 'expo-location';
import { cacheImage } from '../../utils/functions';
import firebase from 'firebase';

//summary
////check if users state and city location has changed since last stored entry
////update users locationStalocationctryStateCity if changed and remove coords from Location Collection

//What I need to batch
//getRedux ctryStateCity and if it is empty. If empty then just update the ctryStateCity in profile
//if not empty then compare if the newctryStateCity is not equal to the redux ctryStateCity. If not equal need to remove
//previous path and and the new path. else do nothing.
export const fireDb_init_user_location = async (userData: UserRootStateProps, ctryStateCity: CtryStateCityProps, location: LocationObject) => {
    var batch = fireDb.batch();

    //fireDb Profile Path
    const userRef = fireDb.collection(UsersDb).doc(userData.uid);

    var updateUserData = { ctryStateCity: ctryStateCity, offline: false, timestamp: firebase.firestore.FieldValue.serverTimestamp(), updatedAt: new Date() }

    if (userData.ctryStateCity && userData.ctryStateCity.city && userData.ctryStateCity.ctryState) {
        //check if the dbStatZip different than currentStateZip
        if (ctryStateCity.ctryState !== userData.ctryStateCity.ctryState || ctryStateCity.city !== userData.ctryStateCity.city) {
            //remove the path of previous location in the Location collection
            const OldLocationRef = fireDb.collection(LocationsDb).doc(userData.ctryStateCity.ctryState).collection(userData.ctryStateCity.city).doc(userData.uid)
            batch.delete(OldLocationRef)
            batch.update(userRef, updateUserData)
        }

    } else {
        batch.update(userRef, updateUserData)
    }

    //now set/update new profilePreview in location collection
    //need to update locationRef with the updated location city

    const LocationRef = fireDb.collection(LocationsDb).doc(ctryStateCity.ctryState).collection(ctryStateCity.city).doc(userData.uid)

    //don't want to send the cacheduri
    const profileImg: ProfileImgProps | null = userData.profileImg && {
        uri: userData.profileImg.uri,
        updatedAt: new Date()
    }

    const { uid, username, bioShort, age, hideOnMap, blockedUsers } = userData

    const profilePreview: UserProfilePreviewProps = {
        uid,
        username,
        bioShort,
        age,
        hideOnMap,
        blockedUsers,
        profileImg: profileImg,
        location: location
    }

    batch.set(LocationRef, { ...profilePreview, timestamp: firebase.firestore.FieldValue.serverTimestamp(), updatedAt: new Date() })

    return await batch.commit()
}

export const fireDb_update_user_location = async (user: UserRootStateProps, newLocation: LocationObject) => {
    const { ctryStateCity, uid, bioShort, age, hideOnMap, blockedUsers, profileImg } = user;

    const updatedProfilePreivew: Omit<UserProfilePreviewProps, 'username'> = {
        uid,
        bioShort,
        age,
        hideOnMap,
        blockedUsers,
        profileImg: profileImg,
        location: newLocation
    }
    await fireDb.collection(LocationsDb).doc(ctryStateCity.ctryState).collection(ctryStateCity.city).doc(uid).update({
        ...updatedProfilePreivew,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: new Date()
    })
}

export const fetch_profile = async (uid: string) => {
    return await fireDb.collection(UsersDb).doc(uid).get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (!data) return;

                //reminder that location can undefined and will be updated based on
                //what the location listener will update it with
                //also getting chatIds so the messages are avaiable

                const profileObj: UserRootStateProps = {
                    uid: doc.id,
                    username: data.username ? data.username : '',
                    ctryStateCity: data.ctryStateCity ? data.ctryStateCity : {
                        ctryState: '',
                        city: ''
                    },
                    name: data.name ? data.name : '',
                    age: data.age ? data.age : 0,
                    bioLong: data.bioLong ? data.bioLong : '',
                    bioShort: data.bioShort ? data.bioShort : '',
                    gender: data.gender ? data.gender : null,
                    location: data.location ? data.location : null,
                    hideOnMap: data.hideOnMap ? data.hideOnMap : false,
                    gallery: data.gallery ? data.gallery : [],
                    offline: data.offline === undefined ? false : data.offline,
                    profileImg: data.profileImg ? data.profileImg : null,
                    blockedUsers: data.blockedUsers ? data.blockedUsers : []
                }

                return { profile: profileObj }
            } else {
                return 'new'
            }
        })
}

export async function cache_user_images(gallery: GalleryItemProps[]) {

    if (!gallery.length) return gallery

    for (let i = 0; i < gallery.length; i++) {
        var cachedUrl: string | void;
        try {
            cachedUrl = await cacheImage(gallery[i].url)
        } catch (e) {
            console.log(e)
        }
        if (cachedUrl) {
            gallery[i]['cachedUrl'] = cachedUrl
        } else {
            console.log(`failed to cached img url ${gallery[i].url}`)
        }
    }

    return gallery;
}