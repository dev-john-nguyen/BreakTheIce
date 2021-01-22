import { SET_NEAR_USERS, UPDATE_NEAR_USERS, RESET_NEAR_USERS } from './actionTypes';
import { AppDispatch } from '../../App';
import { fireDb } from '../firebase';
import { LocationObject } from 'expo-location';
import { LocationsDb, acceptedRadius } from '../../utils/variables';
import { StateCityProps } from '../user/types';
import { NearByUsersProps } from './types';
import { getDistance } from 'geolib';
import { RootProps } from '..';
import firebase from 'firebase';
import { set_banner } from '../utils/actions';
import { cacheImage } from '../../utils/functions';

//find near by users
export const set_and_listen_near_users = (stateCity: StateCityProps, newLocation: LocationObject) => (dispatch: AppDispatch, getState: () => RootProps) => {

    const { uid } = getState().user;

    if (!uid) {
        dispatch(set_banner("Failed to find your user id.", "error"))
        return;
    }

    var nearUsersListener = fireDb
        .collection(LocationsDb)
        .doc(stateCity.state)
        .collection(stateCity.city)
        .where(firebase.firestore.FieldPath.documentId(), "!=", uid)
        .onSnapshot(async (querySnapshot) => {

            var nearByUsers: Array<NearByUsersProps> = [];
            var allUsers: Array<NearByUsersProps> = [];

            for (let i = 0; i < querySnapshot.docs.length; i++) {
                const doc = querySnapshot.docs[i]

                if (!doc.exists) continue;

                // var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
                const { username, location, bioShort, age, hideOnMap, profileImg } = doc.data()

                var userData: NearByUsersProps = {
                    uid: doc.id,
                    username,
                    location,
                    bioShort,
                    age,
                    distance: 0,
                    hideOnMap,
                    profileImg,
                    sentInvite: false,
                    receivedInvite: false,
                    friend: false,
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

                //if within radius push it into nearByUsers array
                if (distanceBetweenPoints < acceptedRadius) {

                    //check if the nearUser is a friend
                    var friends = getState().friends.users;
                    userData.friend = friends.find(item => item.uid === userData.uid) ? true : false

                    //check if an invitation was sent to the user already
                    var invitationsOutbound = getState().invitations.outbound;
                    userData.sentInvite = invitationsOutbound.find(item => item.sentTo.uid === userData.uid) ? true : false

                    //check if user sent invitation to current logged in user
                    var invitationInbound = getState().invitations.inbound;

                    userData.receivedInvite = invitationInbound.find(item => item.sentBy.uid === userData.uid) ? true : false

                    //init profile image includign caching image
                    if (userData.profileImg) {
                        userData.profileImg.cachedUrl = await cacheImage(userData.profileImg.uri)
                    }

                    nearByUsers.push(userData)
                }

                //push all into allUsers
                allUsers.push(userData)

            }

            dispatch({
                type: SET_NEAR_USERS,
                payload: {
                    nearBy: nearByUsers,
                    all: allUsers
                }
            })
        }, err => {
            console.log(err)
            dispatch(set_banner('Oops! We are having trouble retrieving near by users.', 'error'))
        })

    return nearUsersListener
}

export const validate_near_users = async (location: LocationObject, nearByUsers: Array<NearByUsersProps>, allUsers: Array<NearByUsersProps>, dispatch: AppDispatch) => {
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

export const block_user = () => (dispatch: AppDispatch) => {

}

export const reset_near_users = () => ({ type: RESET_NEAR_USERS, payload: undefined })