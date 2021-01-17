import { QuerySnapshot, DocumentData, QueryDocumentSnapshot } from "@firebase/firestore-types"; import { InvitationObject, InvitationStatusOptions } from "./tsTypes";
import { RootProps } from "..";
import { fireDb } from "../firebase";
import { InvitationsDb, FriendsDb, FriendsUsersDb } from "../../utils/variables";

export function handleInvitations(querySnapshot: QuerySnapshot<DocumentData>) {

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

export async function handle_invitation_status(invitation: InvitationObject, status: InvitationObject['status'], user: RootProps['user']) {

    var batch = fireDb.batch();

    const InvitationRef = fireDb.collection(InvitationsDb).doc(invitation.docId);

    batch.set(InvitationRef, { status: status }, { merge: true })

    //if accepted then create new friend
    if (status === InvitationStatusOptions.accepted) {
        const InviteeRef = fireDb.collection(FriendsDb).doc(invitation.sentBy).collection(FriendsUsersDb).doc(user.uid);
        batch.set(InviteeRef, {
            username: user.username,
            dateUpdated: new Date(),
            dateCreated: new Date(),
            active: true
        })
        const InviterRef = fireDb.collection(FriendsDb).doc(user.uid).collection(FriendsUsersDb).doc(invitation.sentBy);
        batch.set(InviterRef, {
            username: invitation.sentByUsername,
            dateUpdated: new Date(),
            dateCreated: new Date(),
            active: true
        })
    }

    //update the invitations in inviter(outbound) and current user (inbound)
    return await batch.commit()
}
