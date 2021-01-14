import { SEND_INVITATION, SET_INVITATIONS_INBOUND, SET_INVITATIONS_OUTBOUND, SET_INVITATIONS } from './actionTypes';
import { SET_ERROR } from '../utils/actionTypes';
import { AppDispatch } from '../../App';
import { InvitationObject, InvitationStatusOptions } from './tsTypes';
import { UserRootStateProps } from '../user/types';
import { fireDb } from '../firebase';
import { InvitationsDb, FriendsDb, FriendsUsersDb } from '../../utils/variables';
import { RootProps } from '..';
import { UPDATE_INVITE_NEAR_USER } from '../near_users/actionTypes';
import { QuerySnapshot, DocumentData, QueryDocumentSnapshot } from '@firebase/firestore-types'
import { set_banner } from '../utils/actions';

//define the structure of the invitation

export const send_invitation = (invitationObj: InvitationObject) => async (dispatch: AppDispatch) => {
    try {
        await fireDb.collection(InvitationsDb).add(invitationObj)
    } catch (e) {
        console.log(e)
        return dispatch({
            type: SET_ERROR,
            payload: "Oops! Something went wrong sending your invitation."
        })
    }

    //will need to update the near user of which the invitation was sent
    dispatch({
        type: UPDATE_INVITE_NEAR_USER,
        payload: invitationObj.sentTo
    })
    dispatch({
        type: SEND_INVITATION,
        payload: invitationObj
    })
}

export const set_and_listen_invitations = () => (dispatch: AppDispatch, getState: () => RootProps) => {
    //only listening on inbound invitations and not outbound...
    const { uid } = getState().user;

    if (!uid) {
        dispatch(set_banner("Failed to find your user id.", "error"))
        return;
    }

    //get all invitations that were sent
    fireDb.collection(InvitationsDb)
        .where("sentBy", "==", uid)
        .get()
        .then((querySnapshot) => {
            dispatch({
                type: SET_INVITATIONS_OUTBOUND,
                payload: handleInvitations(querySnapshot)
            })
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: SET_ERROR,
                payload: "Oops! Couldn't get invitations that you sent"
            })
        })

    //get and listen to inbound invitations
    var invitationListener = fireDb.collection(InvitationsDb)
        .where("sentTo", "==", uid)
        .where('status', '==', InvitationStatusOptions.pending)
        .onSnapshot((querySnapshot) => {
            dispatch({
                type: SET_INVITATIONS_INBOUND,
                payload: handleInvitations(querySnapshot)
            })
        },
            err => {
                console.log(err)
                dispatch({
                    type: SET_ERROR,
                    payload: "Oops! Couldn't get your invitations"
                })
            }
        )

    dispatch({ type: SET_INVITATIONS, payload: { invitationListener } })

    return invitationListener
}

function handleInvitations(querySnapshot: QuerySnapshot<DocumentData>) {

    var invitations: Array<InvitationObject> = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        if (doc.exists) {
            const invitationDoc = doc.data()

            if (invitationDoc) {
                const { message, createdAt, updatedAt, status, sentBy, sentTo, sentByAge, sentByUsername } = invitationDoc;

                var invitationObj: InvitationObject = {
                    docId: doc.id,
                    sentByAge,
                    sentByUsername,
                    sentBy,
                    sentTo,
                    createdAt: createdAt.toDate(),
                    updatedAt: updatedAt.toDate(),
                    message,
                    status
                }
                invitations.push(invitationObj)
            }
        }
    })

    return invitations;
}

export const update_inviter_invitation = (invitationObj: InvitationObject, updatedStatus: InvitationObject['status']) => async (dispatch: AppDispatch, getState: () => RootProps) => {
    const user = getState().user;

    var batch = fireDb.batch();

    const InvitationRef = fireDb.collection(InvitationsDb).doc(invitationObj.docId);
    batch.set(InvitationRef, { status: updatedStatus }, { merge: true })

    //if accepted then create new friend
    if (updatedStatus === InvitationStatusOptions.accepted) {
        const InviteeRef = fireDb.collection(FriendsDb).doc(invitationObj.sentBy).collection(FriendsUsersDb).doc(user.uid);
        batch.set(InviteeRef, {
            username: user.username,
            dateUpdated: new Date(),
            dateCreated: new Date(),
            active: true
        })
        const InviterRef = fireDb.collection(FriendsDb).doc(user.uid).collection(FriendsUsersDb).doc(invitationObj.sentBy);
        batch.set(InviterRef, {
            username: invitationObj.sentByUsername,
            dateUpdated: new Date(),
            dateCreated: new Date(),
            active: true
        })
    }

    //update the invitations in inviter(outbound) and current user (inbound)
    try {
        await batch.commit()
    } catch (err) {
        console.log(err)
        return dispatch({
            type: SET_ERROR,
            payload: "Oops! Something went wrong updated your request"
        })
    }

    //Don't need to dipatch because the inbound listener will catch it ... hopefully
}