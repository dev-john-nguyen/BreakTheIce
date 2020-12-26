import { SET_NEAR_USERS, UPDATE_NEAR_USERS } from './actionTypes';
import { AppDispatch } from '../../App';
import { fireDb } from '../firebase';
import { LocationObject } from 'expo-location';
import { LocationsDb, acceptedRadius } from '../../utils/variables';
import { StateCityProps } from '../user/tsTypes';
import { NearByUsersProps } from './tsTypes';
import { getDistance } from 'geolib';
import { RootProps } from '..';
import firebase from 'firebase';
import { SET_ERROR } from '../utils/actionTypes';


//find near by users
export const set_and_listen_near_users = (uid: string, stateCity: StateCityProps, newLocation: LocationObject) => (dispatch: AppDispatch, getState: () => RootProps) => {
    fireDb
        .collection(LocationsDb)
        .doc(stateCity.state)
        .collection(stateCity.city)
        .where(firebase.firestore.FieldPath.documentId(), "!=", uid)
        .onSnapshot(function (querySnapshot) {

            var nearByUsers: Array<NearByUsersProps> = [];
            var allUsers: Array<NearByUsersProps> = [];

            querySnapshot.docs.forEach(doc => {
                // var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
                const { username, location, name, bioShort, bioLong, stateCity, gender, age, isPrivate } = doc.data()

                var userData: NearByUsersProps = {
                    uid: doc.id,
                    username,
                    location,
                    name,
                    bioShort,
                    bioLong,
                    stateCity,
                    gender,
                    age,
                    isPrivate,
                    friend: false,
                    distance: 0,
                    sentInvite: false
                }

                //check if the coords are missing
                if (!userData.location.coords ||
                    !userData.location.coords.latitude
                    || !userData.location.coords.longitude) return;


                const { longitude, latitude } = userData.location.coords

                //distance is in meters
                var distanceBetweenPoints = getDistance(
                    { latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude },
                    { latitude, longitude }
                )

                //update distance key
                userData.distance = distanceBetweenPoints;

                //check if the nearUser is a friend
                var friends = getState().friends.users;
                if (friends.length > 0) {
                    //loop through and see if uid match then update friend bool
                    for (let i = 0; i < friends.length; i++) {
                        if (friends[i].uid === userData.uid) {
                            userData.friend = true;
                            break
                        }
                    }
                }

                //check if an invitation was sent to the user already
                var invitationsOutbound = getState().invitations.outbound;
                if (invitationsOutbound.length > 0) {
                    for (let i = 0; i < invitationsOutbound.length; i++) {
                        if (invitationsOutbound[i].sentTo === userData.uid) {
                            userData.sentInvite = true;
                            break
                        }
                    }
                }


                if (distanceBetweenPoints < acceptedRadius) {
                    nearByUsers.push(userData)
                }

                allUsers.push(userData)
            })

            dispatch({
                type: SET_NEAR_USERS,
                payload: {
                    nearBy: nearByUsers,
                    all: allUsers
                }
            })
        }, err => {
            console.log(err)
            dispatch({
                type: SET_ERROR,
                payload: 'Oops! We are having trouble retrieving near by users.'
            })
        })
}

export const validate_near_users = (location: LocationObject, nearByUsers: Array<NearByUsersProps>, allUsers: Array<NearByUsersProps>) => (dispatch: AppDispatch) => {
    //update nearByUsers directly to prevent full reload of the component on rerender

    const { longitude, latitude } = location.coords

    var userLocation = { longitude, latitude };

    var updated = false

    for (let i = 0; i < allUsers.length; i++) {
        var nearUserLocation = { longitude: allUsers[i].location.coords.longitude, latitude: allUsers[i].location.coords.latitude }

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