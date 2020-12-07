import { SET_NEAR_USERS, UPDATE_NEAR_USERS } from './actionTypes';
import { AppDispatch } from '../../App';
import { fireDb } from '../../App';
import { LocationObject } from 'expo-location';
import { Locations, acceptedRadius } from '../../utils/variables';
import { StateCityProps } from '../user/tsTypes';
import { NearUsersLocationProps } from './tsTypes';
import { getDistance } from 'geolib';
//@ts-ignore
import { firestore } from 'firebase';

//find near by users
export const set_and_listen_near_users = (uid: string, stateCity: StateCityProps, location: LocationObject) => (dispatch: AppDispatch) => {
    fireDb
        .collection(Locations)
        .doc(stateCity.state)
        .collection(stateCity.city)
        .where(firestore.FieldPath.documentId(), "!=", uid)
        .onSnapshot(function (querySnapshot) {

            var nearByUsers: Array<NearUsersLocationProps> = [];
            var allUsers: Array<NearUsersLocationProps> = [];

            querySnapshot.docs.forEach(doc => {
                // var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
                const { longitude, latitude } = doc.data()

                //distance is in meters
                var distanceBetweenPoints = getDistance(
                    { latitude: location.coords.latitude, longitude: location.coords.longitude },
                    { latitude, longitude }
                )

                if (distanceBetweenPoints < acceptedRadius) {
                    nearByUsers.push({
                        uid: doc.id,
                        longitude,
                        latitude
                    })
                }


                allUsers.push({
                    uid: doc.id,
                    longitude,
                    latitude
                })

            })

            dispatch({
                type: SET_NEAR_USERS,
                payload: {
                    nearBy: nearByUsers,
                    all: allUsers
                }
            })
        })
}

export const validate_near_users = (location: LocationObject, nearByUsers: Array<NearUsersLocationProps>, allUsers: Array<NearUsersLocationProps>) => (dispatch: AppDispatch) => {
    //update nearByUsers directly to prevent full reload of the component on rerender

    const { longitude, latitude } = location.coords

    var userLocation = { longitude, latitude };

    var updated = false

    for (let i = 0; i < allUsers.length; i++) {
        var nearUserLocation = { longitude: allUsers[i].longitude, latitude: allUsers[i].latitude }

        let distanceBetweenPoints = getDistance(userLocation, nearUserLocation)

        if (distanceBetweenPoints < acceptedRadius) {
            //if within radius check if user is already in the nearByUsers state
            // ? do nothing : push the user into the nearByUsers state

            var addUser = true;

            for (let j = 0; j < nearByUsers.length; j++) {
                if (nearByUsers[j].uid === allUsers[i].uid) {
                    addUser = false
                    break;
                }
            }

            if (addUser) {
                nearByUsers.push(allUsers[i]);
                updated = true;
            }

        } else {
            //the user is outside of the radius
            //loop through nearByUsers arr and see if the user exist
            //? remove the user : do nothing

            for (let j = 0; j < nearByUsers.length; j++) {
                if (nearByUsers[j].uid === allUsers[i].uid) {
                    nearByUsers.splice(j, 1);
                    updated = true;
                    break;
                }
            }
        }

    }

    if (!updated) return

    dispatch({
        type: UPDATE_NEAR_USERS,
        payload: {
            nearBy: nearByUsers,
            all: allUsers
        }
    })
}