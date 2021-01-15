import { fireDb } from '../firebase';
import { LocationsDb, UsersDb } from '../../utils/variables';
import { StateCityProps, UserRootStateProps, GalleryItemProps, UserProfilePreviewProps } from './types';
import { LocationObject } from 'expo-location';
import { cacheImage } from '../../utils/functions';

//summary
////check if users state and city location has changed since last stored entry
////update users locationStalocationStateCity if changed and remove coords from Location Collection

//What I need to batch
//getRedux stateCity and if it is empty. If empty then just update the stateCity in profile
//if not empty then compare if the newStateCity is not equal to the redux stateCity. If not equal need to remove
//previous path and and the new path. else do nothing.
export const fireDb_init_user_location = async (userData: UserRootStateProps, stateCity: StateCityProps, location: LocationObject) => {
    var batch = fireDb.batch();

    //fireDb Profile Path
    const userRef = fireDb.collection(UsersDb).doc(userData.uid);

    var updateUserData = { stateCity: stateCity, offline: false }

    if (userData.stateCity && userData.stateCity.city && userData.stateCity.state) {
        //check if the dbStatZip different than currentStateZip
        if (stateCity.state !== userData.stateCity.state || stateCity.city !== userData.stateCity.city) {
            //remove the path of previous location in the Location collection
            const OldLocationRef = fireDb.collection(LocationsDb).doc(userData.stateCity.state).collection(userData.stateCity.city).doc(userData.uid)
            batch.delete(OldLocationRef)
            batch.update(userRef, updateUserData)
        }

    } else {
        batch.update(userRef, updateUserData)
    }

    //now set/update new profilePreview in location collection
    //need to update locationRef with the updated location city

    const LocationRef = fireDb.collection(LocationsDb).doc(stateCity.state).collection(stateCity.city).doc(userData.uid)

    const profilePreview: UserProfilePreviewProps = {
        uid: userData.uid,
        username: userData.username,
        location: location,
        bioShort: userData.bioShort,
        age: userData.age,
        hideOnMap: userData.hideOnMap
    }

    batch.set(LocationRef, profilePreview)

    return await batch.commit()
}

export const fireDb_update_user_location = async (uid: string, stateCity: StateCityProps, newLocation: LocationObject) => {
    await fireDb.collection(LocationsDb).doc(stateCity.state).collection(stateCity.city).doc(uid).set({
        location: newLocation
    }, { merge: true })
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
                    stateCity: data.stateCity ? data.stateCity : {
                        state: '',
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
                    offline: data.offline === undefined ? false : data.offline
                }

                return { profile: profileObj }
            } else {
                return;
            }
        })
}

export async function cache_user_images(gallery: GalleryItemProps[], uriType: 'cachedUrl' | 'nearUserUri') {

    if (!gallery.length) return gallery

    for (let i = 0; i < gallery.length; i++) {
        var cachedUrl: string | void;
        try {
            cachedUrl = await cacheImage(gallery[i].url)
        } catch (e) {
            console.log(e)
        }
        if (cachedUrl) {
            gallery[i][uriType] = cachedUrl
        } else {
            console.log(`failed to cached img url ${gallery[i].url}`)
        }
    }

    return gallery;
}