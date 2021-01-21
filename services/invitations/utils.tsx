import { QuerySnapshot, DocumentData, QueryDocumentSnapshot } from "@firebase/firestore-types"; import { InvitationObject, InvitationStatusOptions, InvitationUserInfo } from "./types";
import { RootProps } from "..";
import { fireDb } from "../firebase";
import { InvitationsDb, FriendsDb, FriendsUsersDb } from "../../utils/variables";
import { cacheImage } from "../../utils/functions";

export async function handleInvitations(querySnapshot: QuerySnapshot<DocumentData>) {

    var invitations: Array<InvitationObject> = [];

    for (let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i];

        if (doc.exists) {

            const invitationDoc = doc.data()

            if (invitationDoc) {
                const { message, createdAt, updatedAt, status } = invitationDoc;

                var { sentBy, sentTo } = invitationDoc as { sentBy: InvitationUserInfo, sentTo: InvitationUserInfo };

                //need to get cached images and update cachedUrl sentBy and sentTo

                if (sentBy.profileImg) {
                    sentBy.profileImg.cachedUrl = await cacheImage(sentBy.profileImg.uri)
                }

                if (sentTo.profileImg) {
                    sentTo.profileImg.cachedUrl = await cacheImage(sentTo.profileImg.uri)
                }



                var invitationObj: InvitationObject = {
                    docId: doc.id,
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

    }

    return invitations;
}

export async function handle_invitation_status(invitation: InvitationObject, status: InvitationObject['status'], user: RootProps['user']) {

    var batch = fireDb.batch();

    const InvitationRef = fireDb.collection(InvitationsDb).doc(invitation.docId);

    batch.set(InvitationRef, { status: status, updatedAt: new Date() }, { merge: true })

    //if accepted then create new friend
    if (status === InvitationStatusOptions.accepted) {
        const InviteeRef = fireDb.collection(FriendsDb).doc(invitation.sentBy.uid).collection(FriendsUsersDb).doc(user.uid);
        batch.set(InviteeRef, {
            username: user.username,
            dateUpdated: new Date(),
            dateCreated: new Date(),
            profileImg: {
                uri: user.profileImg?.uri,
                updatedAt: new Date()
            },
            active: true
        })
        const InviterRef = fireDb.collection(FriendsDb).doc(user.uid).collection(FriendsUsersDb).doc(invitation.sentBy.uid);
        batch.set(InviterRef, {
            username: invitation.sentBy.username,
            dateUpdated: new Date(),
            dateCreated: new Date(),
            profileImg: {
                uri: invitation.sentBy.profileImg?.uri,
                updatedAt: new Date()
            },
            active: true
        })
    }

    //update the invitations in inviter(outbound) and current user (inbound)
    return await batch.commit()
}
