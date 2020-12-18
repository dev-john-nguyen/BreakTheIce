import { fireDb } from '../firebase';
import { LocationsDb, UsersDb } from '../../utils/variables';
import { StateCityProps, UserRootStateProps } from './tsTypes';
import { LocationObject } from 'expo-location';

//summary
////check if users state and city location has changed since last stored entry
////update users locationStalocationStateCity if changed and remove coords from Location Collection

//What I need to batch
//getRedux stateCity and if it is empty. If empty then just update the stateCity in profile
//if not empty then compare if the newStateCity is not equal to the redux stateCity. If not equal need to remove
//previous path and and the new path. else do nothing.
export const fireDb_init_user_location = async (rxProfileObj: UserRootStateProps, stateCity: StateCityProps, location: LocationObject) => {
    var batch = fireDb.batch();

    //fireDb Profile Path
    const ProfileRef = fireDb.collection(UsersDb).doc(rxProfileObj.uid);

    if (rxProfileObj.stateCity && rxProfileObj.stateCity.city && rxProfileObj.stateCity.state) {
        //check if the dbStatZip different than currentStateZip
        if (stateCity.state !== rxProfileObj.stateCity.state || stateCity.city !== rxProfileObj.stateCity.city) {
            //remove the path of previous location in the Location collection
            const OldLocationRef = fireDb.collection(LocationsDb).doc(rxProfileObj.stateCity.state).collection(rxProfileObj.stateCity.city).doc(rxProfileObj.uid)
            batch.delete(OldLocationRef)
            batch.set(ProfileRef, { stateCity: stateCity }, { merge: true })
        }

    } else {
        batch.set(ProfileRef, { stateCity: stateCity }, { merge: true })
    }

    //now set/update new location
    //need to update locationRef with the updated location city
    const LocationRef = fireDb.collection(LocationsDb).doc(stateCity.state).collection(stateCity.city).doc(rxProfileObj.uid)
    batch.set(LocationRef, { ...rxProfileObj, location: location, stateCity: stateCity })

    return await batch.commit()
}

export const fireDb_update_user_location = async (rxProfileObj: UserRootStateProps, newLocation: LocationObject) => {
    await fireDb.collection(LocationsDb).doc(rxProfileObj.stateCity.state).collection(rxProfileObj.stateCity.city).doc(rxProfileObj.uid).set({
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
                    isPrivate: data.isPrivate ? data.isPrivate : false,
                    location: data.location ? data.location : null
                }

                return {
                    profile: profileObj,
                    chatIds: data.chatIds ? data.chatIds : []
                };
            } else {
                return;
            }
        })
}