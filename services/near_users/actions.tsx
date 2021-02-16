import { SET_NEAR_USERS, UPDATE_NEAR_USERS, RESET_NEAR_USERS, INIT_NEAR_USERS } from './actionTypes';
import { AppDispatch } from '../../App';
import { fireDb } from '../firebase';
import { LocationObject } from 'expo-location';
import { LocationsDb, acceptedRadius } from '../../utils/variables';
import { CtryStateCityProps, BlockUserProps } from '../user/types';
import { NearByUsersProps } from './types';
import { getDistance } from 'geolib';
import { RootProps } from '..';
import firebase from 'firebase';
import { set_banner } from '../banner/actions';
import { cacheImage } from '../../utils/functions';
import { UPDATE_PROFILE_HISTORY } from '../profile/actionTypes';
import * as Location from 'expo-location';
import { getBucket } from '../../components/home/utils';
import { isEqual } from 'lodash';
import { fireDb_init_user_location, fireDb_update_user_location } from '../user/utils';
import { REFRESH_UPDATE_BUCKET } from '../user/actionTypes';


//find near by users
export const set_and_listen_near_users = (ctryStateCity: CtryStateCityProps, newLocation: LocationObject) => (dispatch: AppDispatch, getState: () => RootProps) => {

    const { uid } = getState().user;

    if (!uid) {
        dispatch(set_banner("Failed to find your user id.", "error"))
        return;
    }

    var nearUsersListener = fireDb
        .collection(LocationsDb)
        .doc(ctryStateCity.ctryState)
        .collection(ctryStateCity.city)
        .where(firebase.firestore.FieldPath.documentId(), "!=", uid)
        .onSnapshot(async (querySnapshot) => {

            var nearByUsers: Array<NearByUsersProps> = [];
            var allUsers: Array<NearByUsersProps> = [];

            for (let i = 0; i < querySnapshot.docs.length; i++) {
                const doc = querySnapshot.docs[i]

                if (!doc.exists) continue;

                // var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
                const { username, location, statusMsg, age, hideOnMap, profileImg, blockedUsers, updatedAt } = doc.data()

                if (blockedUsers && blockedUsers.find((user: BlockUserProps) => user.uid === uid)) continue

                var userData: NearByUsersProps = {
                    uid: doc.id,
                    username,
                    location,
                    statusMsg,
                    age,
                    distance: 0,
                    hideOnMap,
                    profileImg: profileImg ? profileImg : null,
                    sentInvite: false,
                    receivedInvite: false,
                    friend: false,
                    updatedAt: updatedAt.toDate()
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
                    if (userData.profileImg?.uri) {
                        userData.profileImg.cachedUrl = await cacheImage(userData.profileImg.uri)
                    }

                    nearByUsers.push(userData)
                }

                //push all into allUsers
                allUsers.push(userData)

            }

            dispatch({
                type: UPDATE_PROFILE_HISTORY,
                payload: nearByUsers
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
            dispatch(set_banner('Oops! We are having trouble retrieving near by users.', 'error'))
        })

    dispatch({ type: INIT_NEAR_USERS, payload: {} })

    return nearUsersListener
}

export const refresh_near_users = () => async (dispatch: AppDispatch, getState: () => RootProps) => {
    var location: LocationObject

    try {
        location = await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.Highest });

        const currentBucket: CtryStateCityProps | undefined = await getBucket(location)

        const { user } = getState()

        if (currentBucket) {
            if (!isEqual(currentBucket, user.ctryStateCity)) {
                //user's bucket needs to update
                //and users location needs to update

                await fireDb_init_user_location(user, currentBucket, location)

                dispatch({
                    type: REFRESH_UPDATE_BUCKET,
                    payload: {
                        location,
                        ctryStateCity: currentBucket
                    }
                })

                dispatch(set_banner("Great, looks like your in a different area. Safe travels.", "success"))

            }
        }

        //update location
        //get coordinates and compare
        const prevLocCords = {
            latitude: user.location.coords.latitude,
            longitude: user.location.coords.longitude,
        }

        const curLocCords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        }

        if (getDistance(prevLocCords, curLocCords) > 1) {
            console.log('updating')
            await fireDb_update_user_location(user, location)
        }

    } catch (err) {
        console.log(err)
        dispatch(set_banner("Oops! Something went wrong trying to refresh. Please try again", "error"))
        return;
    }


    const { nearUsers } = getState();

    validate_near_users(location, nearUsers.nearBy, nearUsers.all, dispatch)
}

export const validate_near_users = async (location: LocationObject, nearByUsers: Array<NearByUsersProps>, allUsers: Array<NearByUsersProps>, dispatch: AppDispatch) => {
    //update nearByUsers directly to prevent full reload of the component on rerender

    const { longitude, latitude } = location.coords

    var userLocation = { longitude, latitude };

    for (let i = 0; i < allUsers.length; i++) {
        var nearUserLocation = { longitude: allUsers[i].location.coords.longitude, latitude: allUsers[i].location.coords.latitude }

        let distanceBetweenPoints = getDistance(userLocation, nearUserLocation)


        if (distanceBetweenPoints < acceptedRadius) {
            //if within radius check if user is already in the nearByUsers state
            // ? do nothing : push the user into the nearByUsers state
            var foundNearBy = nearByUsers.find(user => user.uid === allUsers[i].uid)

            allUsers[i].distance = distanceBetweenPoints;

            if (!foundNearBy) {
                //push it into nearByUsers array
                nearByUsers.push(allUsers[i]);
            }



        } else {
            //the user is outside of the radius
            //loop through nearByUsers arr and see if the user exist
            //? remove the user : do nothing

            var nearByIndex = nearByUsers.findIndex(user => user.uid === allUsers[i].uid)

            if (nearByIndex >= 0) {
                console.log(nearByIndex)
                nearByUsers.splice(nearByIndex, 1);
            }
        }

    }

    dispatch({
        type: UPDATE_PROFILE_HISTORY,
        payload: nearByUsers
    })

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