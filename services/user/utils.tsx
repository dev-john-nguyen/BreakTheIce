import { fireDb } from '../../App';
import { Locations, Profile } from '../../utils/variables';
import { StateCityProps } from './tsTypes';
import { LocationObject } from 'expo-location';

//summary
////check if users state and city location has changed since last stored entry
////update users locationStalocationStateCity if changed and remove coords from Location Collection
export const updateProfileLocationStateCity = async (uid: string, stateCity: StateCityProps) => {

    async function updateProfileLocationStateZip() {
        return await fireDb.collection(Profile).doc(uid).set({
            locationStateCity: stateCity
        }, { merge: true })
            .then(() => { return stateCity })
            .catch((err) => {
                console.log(err)
            })
    }


    const dbStateCity: StateCityProps | undefined = await fireDb.collection(Profile).doc(uid).get()
        .then((doc: any) => {
            const { locationStateCity } = doc.data();

            if (locationStateCity) {
                return locationStateCity
            } else {
                return;
            }
        })
        .catch((err) => {
            console.log(err)
            return;
        })

    if (dbStateCity) {
        //check if the dbStatZip different than currentStateZip
        if (stateCity.state !== dbStateCity.state || stateCity.city !== dbStateCity.city) {
            //remove the path of previous location in the Location collection
            await fireDb.collection(Locations).doc(dbStateCity.state).collection(dbStateCity.city).doc(uid).delete()
                .catch((err) => {
                    console.log(err)
                })
            await updateProfileLocationStateZip();
        }

    } else {
        await updateProfileLocationStateZip();
    }

}


//summary
////update Location collection with the current user location
export const updateUserLocationCoords = async (uid: string, location: LocationObject, stateCity: StateCityProps) => {
    await fireDb.collection(Locations).doc(stateCity.state).collection(stateCity.city).doc(uid).set({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
    })
}