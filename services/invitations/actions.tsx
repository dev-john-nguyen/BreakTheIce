import { SEND_INVITATION, SET_INVITATIONS_INBOUND, SET_INVITATIONS_OUTBOUND, SET_INVITATIONS, RESET_INVITATIONS } from './actionTypes';
import { AppDispatch } from '../../App';
import { InvitationObject, InvitationStatusOptions } from './tsTypes';
import { fireDb } from '../firebase';
import { InvitationsDb, FriendsDb, FriendsUsersDb } from '../../utils/variables';
import { RootProps } from '..';
import { UPDATE_INVITE_STATUS_NEAR_USER, SENT_INVITE_NEAR_USER } from '../near_users/actionTypes';
import { set_banner } from '../utils/actions';
import { UPDATE_INVITE_STATUS_PROFILE_HISTORY, SENT_INVITE_PROFILE_HISTORY } from '../profile/actionTypes';
import { handleInvitations, handle_invitation_status } from './utils';

//define the structure of the invitation

export const send_invitation = (invitationObj: Omit<InvitationObject, 'docId'>) => async (dispatch: AppDispatch) => {
    try {
        await fireDb.collection(InvitationsDb).add(invitationObj)
    } catch (e) {
        console.log(e)
        dispatch(set_banner("Oops! Something went wrong sending your invitation.", 'error'))
        return
    }

    //will need to update the near user of which the invitation was sent
    dispatch({
        type: SENT_INVITE_NEAR_USER,
        payload: { uid: invitationObj.sentTo.uid }
    })

    //update profile history
    dispatch({
        type: SENT_INVITE_PROFILE_HISTORY,
        payload: { uid: invitationObj.sentTo.uid }
    })

    dispatch({ type: SEND_INVITATION, payload: invitationObj })
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
        .where("sentBy.uid", "==", uid)
        .where('status', '==', InvitationStatusOptions.pending)
        .get()
        .then((querySnapshot) => {
            dispatch({
                type: SET_INVITATIONS_OUTBOUND,
                payload: handleInvitations(querySnapshot)
            })
        })
        .catch(err => {
            console.log(err);
            dispatch(set_banner("Oops! Couldn't get invitations that you sent", 'error'))
        })

    //get and listen to inbound invitations
    var invitationListener = fireDb.collection(InvitationsDb)
        .where("sentTo.uid", "==", uid)
        .where('status', '==', InvitationStatusOptions.pending)
        .onSnapshot((querySnapshot) => {
            dispatch({
                type: SET_INVITATIONS_INBOUND,
                payload: handleInvitations(querySnapshot)
            })
        },
            err => {
                console.log(err)
                dispatch(set_banner("Oops! Couldn't get your invitations", 'error'))
            }
        )

    dispatch({ type: SET_INVITATIONS, payload: { invitationListener } })

    return invitationListener
}

export const update_invitation_from_invitations = (invitationObj: InvitationObject, updatedStatus: InvitationObject['status']) => async (dispatch: AppDispatch, getState: () => RootProps) => {
    const user = getState().user;

    var batch = fireDb.batch();

    const InvitationRef = fireDb.collection(InvitationsDb).doc(invitationObj.docId);
    batch.set(InvitationRef, { status: updatedStatus }, { merge: true })

    //if accepted then create new friend
    if (updatedStatus === InvitationStatusOptions.accepted) {
        const InviteeRef = fireDb.collection(FriendsDb).doc(invitationObj.sentBy.uid).collection(FriendsUsersDb).doc(user.uid);
        batch.set(InviteeRef, {
            username: user.username,
            dateUpdated: new Date(),
            dateCreated: new Date(),
            active: true
        })
        const InviterRef = fireDb.collection(FriendsDb).doc(user.uid).collection(FriendsUsersDb).doc(invitationObj.sentBy.uid);
        batch.set(InviterRef, {
            username: invitationObj.sentBy.username,
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
        dispatch(set_banner("Oops! Something went wrong updated your request", 'error'))
        return;
    }

    //Don't need to dipatch because the inbound listener will catch it ... hopefully
}

export const update_invitation = (inviterUid: string, status: InvitationObject['status']) => async (dispatch: AppDispatch, getState: () => RootProps) => {
    if (!inviterUid) return;

    const { invitations, user } = getState()

    const { inbound } = invitations

    var invitationToUpdate = inbound.find(invitation => invitation.sentBy.uid === inviterUid)

    if (!invitationToUpdate) {
        dispatch(set_banner('Looks like we are unable to find the invitation to update.', 'error'))
        return;
    }

    try {
        await handle_invitation_status(invitationToUpdate, status, user)
    } catch (err) {
        console.log(err)
        dispatch(set_banner('Oops! Something went wrong trying to update the status of the invitation', 'error'))
        return;
    }

    dispatch({ type: UPDATE_INVITE_STATUS_NEAR_USER, payload: { uid: inviterUid, status } })

    dispatch({ type: UPDATE_INVITE_STATUS_PROFILE_HISTORY, payload: { uid: inviterUid, status } })

    //Don't need to dipatch because the inbound listener will catch it ... hopefully
}

export const reset_invitations = () => ({ type: RESET_INVITATIONS, payload: undefined })