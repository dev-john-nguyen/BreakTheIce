import { SEND_INVITATION, SET_INVITATIONS_INBOUND, SET_INVITATIONS_OUTBOUND, SET_INVITATIONS } from './actionTypes';
import { SET_ERROR } from '../utils/actionTypes';
import { AppDispatch } from '../../App';
import { InvitationObject, InvitationStatusOptions } from './tsTypes';
import { UserRootStateProps } from '../user/tsTypes';
import { fireDb } from '../firebase';
import { InvitationsDb, InvitationsDb_Inbound, InvitationsDb_Outbound, FriendsDb, FriendsUsersDb } from '../../utils/variables';
import { RootProps } from '..';
``
//@ts-ignore
import { firestore } from 'firebase';
import { QuerySnapshot, DocumentData, QueryDocumentSnapshot } from '@firebase/firestore-types'

//define the structure of the invitation

export const send_invitation = (uid: UserRootStateProps['uid'], invitationContent: InvitationObject) => async (dispatch: AppDispatch) => {
    // var batch = fireDb.batch();
    // const InvitationInboundRef = fireDb.collection(InvitationsDb).doc(invitationContent.uid).collection(InvitationsDb_Inbound).doc(uid);
    // batch.set(InvitationInboundRef, invitationContent)
    // const InvitationOutboundRef = fireDb.collection(InvitationsDb).doc(uid).collection(InvitationsDb_Outbound).doc(invitationContent.uid);
    // batch.set(InvitationOutboundRef, invitationContent)

    // try {
    //     await batch.commit()
    // } catch (e) {
    //     console.log(e)
    //     dispatch({
    //         type: SET_ERROR,
    //         payload: 'Something went wrong sending the invitation'
    //     })
    //     throw new Error('Failed')
    // }

    try {
        await fireDb.collection(InvitationsDb).add(invitationContent)
    } catch (e) {
        console.log(e)
        return dispatch({
            type: SET_ERROR,
            payload: "Oops! Something went wrong sending your invitation."
        })
    }

    return dispatch({
        type: SEND_INVITATION,
        payload: invitationContent
    })
}

export const set_and_listen_invitations = (uid: UserRootStateProps['uid']) => (dispatch: AppDispatch) => {
    //only listening on inbound invitations and not outbound...

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
    fireDb.collection(InvitationsDb)
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

    dispatch({ type: SET_INVITATIONS })
}

function handleInvitations(querySnapshot: QuerySnapshot<DocumentData>) {

    var invitations: Array<InvitationObject> = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        if (doc.exists) {
            const invitationDoc = doc.data()

            if (invitationDoc) {
                const { message, createdAt, updatedAt, status, sentBy, sentTo } = invitationDoc;

                var invitationObj: InvitationObject = {
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

export const update_inviter_invitation = (inviterUid: InvitationObject['sentBy'], status: InvitationObject['status']) => async (dispatch: AppDispatch, getState: () => RootProps) => {
    const uid = getState().user.uid;

    if (!uid) {
        return dispatch({
            type: SET_ERROR,
            payload: "Couldn't find your user id"
        })
    }

    var batch = fireDb.batch();
    const InboundRef = fireDb.collection(InvitationsDb).doc(uid).collection(InvitationsDb_Inbound).doc(inviterUid);
    batch.set(InboundRef, { status }, { merge: true })
    const OutboundRef = fireDb.collection(InvitationsDb).doc(inviterUid).collection(InvitationsDb_Outbound).doc(uid);
    batch.set(OutboundRef, { status }, { merge: true })

    //if accepted then create new friend
    if (status === InvitationStatusOptions.accepted) {
        const FriendRef = fireDb.collection(FriendsDb).doc(uid).collection(FriendsUsersDb).doc(inviterUid);
        batch.set(FriendRef, {
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
            payload: "Something went wrong when updating your denied invitation request"
        })
    }

    //Don't need to dipatch because the inbound listener will catch it
}