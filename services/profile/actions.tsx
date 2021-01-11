import { SET_TIMELINE, SET_CUR_PROFILE, UPDATE_TIMELINE_NEAR_USER, REMOVE_CUR_PROFILE } from './actionTypes';
import { SET_USER_TIMELINE } from '../user/actionTypes';
import { AppDispatch } from '../../App';
import { fireDb } from '../firebase';
import { UsersDb, UsersTimelineDb } from '../../utils/variables';
import { TimelineLocationProps } from './tsTypes';
import { SET_ERROR } from '../utils/actionTypes';
import { RootProps } from '..';
import { NearByUsersProps } from '../near_users/tsTypes';

export const set_timeline = (uid: string) => (dispatch: AppDispatch, getState: () => RootProps) => {
    fireDb.collection(UsersDb).doc(uid).collection(UsersTimelineDb).get()
        .then(querySnapshot => {
            var timelineData: TimelineLocationProps[] = [];

            querySnapshot.forEach(doc => {
                if (doc.exists) {
                    const { country, city, state, comment, startAt, endAt, createdAt, updatedAt, placesVisited } = doc.data();

                    timelineData.push({
                        docId: doc.id,
                        country,
                        city,
                        state,
                        comment,
                        startAt: startAt.toDate(),
                        endAt: endAt.toDate(),
                        createdAt: createdAt.toDate(),
                        updatedAt: updatedAt.toDate(),
                        placesVisited
                    })
                }
            })


            const userUid = getState().user.uid;

            //determine what timeline user we are fetching for.
            dispatch({
                type: userUid === uid ? SET_USER_TIMELINE : SET_TIMELINE,
                payload: timelineData
            })
        })
        .catch((err) => {
            console.log(err)
            dispatch({
                type: SET_ERROR,
                payload: 'Oops! Looks like we had trouble fetching your previous locations'
            })
        })
}

export const set_current_profile = (profileUid: string) => async (dispatch: AppDispatch, getState: () => RootProps) => {

    //first search in all users to get the profile
    //reason I can't get from friends is because if the friends updates profile
    //the friendsObj will not update, but rather near_users and profile will only update
    var profileUserObj: NearByUsersProps | undefined;

    const allNearUsers = getState().nearUsers.all

    for (let i = 0; i < allNearUsers.length; i++) {
        if (allNearUsers[i].uid === profileUid) {
            profileUserObj = { ...allNearUsers[i] }
            break;
        }
    }

    //check to see if the profileObj is empty... if it is fetch it from server
    if (!profileUserObj) {
        profileUserObj = await fireDb.collection(UsersDb).doc(profileUid).get()
            .then((doc) => {
                if (doc.exists) {
                    const docData = doc.data();

                    if (!docData) return undefined;

                    const { location, name, bioShort, bioLong, stateCity, gender, age, isPrivate, username, gallery } = docData

                    return {
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
                        sentInvite: false,
                        gallery
                    }

                } else {
                    return undefined;
                }
            })
            .catch((err) => {
                console.log(err)
                return undefined;
            })
    }

    // //fetch timeline
    // if (profileUserObj && !profileUserObj.timeline) {
    //     const timelineData = await fireDb.collection(UsersDb).doc(profileUid).collection(UsersTimelineDb).get()
    //         .then(querySnapshot => {
    //             var timelineData: TimelineLocationProps[] = [];

    //             querySnapshot.forEach(doc => {
    //                 if (doc.exists) {
    //                     const { country, city, state, comment, startAt, endAt, createdAt, updatedAt, placesVisited } = doc.data();

    //                     timelineData.push({
    //                         docId: doc.id,
    //                         country,
    //                         city,
    //                         state,
    //                         comment,
    //                         startAt: startAt.toDate(),
    //                         endAt: endAt.toDate(),
    //                         createdAt: createdAt.toDate(),
    //                         updatedAt: updatedAt.toDate(),
    //                         placesVisited
    //                     })
    //                 }
    //             })

    //             return timelineData
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //             dispatch({
    //                 type: SET_ERROR,
    //                 payload: 'Oops! Looks like we had trouble fetching your previous locations'
    //             })
    //             return;
    //         })


    //     //if timeline comes back with data then update the near_users in state  
    //     if (timelineData) {
    //         profileUserObj.timeline = timelineData
    //         dispatch({
    //             type: UPDATE_TIMELINE_NEAR_USER,
    //             payload: timelineData
    //         })
    //     }
    // }


    if (!profileUserObj) {
        dispatch({
            type: SET_ERROR,
            payload: "Oops! User not found."
        })

        return;
    }


    return profileUserObj;
}

export const remove_current_profile = () => ({
    type: REMOVE_CUR_PROFILE
})