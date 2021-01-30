import { InvitationObject, InvitationStatusOptions } from "../invitations/types";
import { FriendObjProps } from "../friends/types";
import { NearByUsersProps } from "../near_users/types";
import { ProfileUserProps } from "../profile/types";


interface UserProps {
    receivedInvite: Boolean,
    friend: Boolean,
    sentInvite: Boolean,
    uid: string
}

export function update_received_status(users: UserProps[], invitations: InvitationObject[]) {
    return users.map(user => {

        const matchInvitation = invitations.find(invite => invite.sentBy.uid === user.uid)

        if (matchInvitation) {
            user.receivedInvite = true
        } else {
            user.receivedInvite = false
        }
        return user;
    })
}

export function update_invite_status(users: UserProps[], uid: string, status?: InvitationStatusOptions) {
    return users.map((user) => {
        if (user.uid === uid) {
            if (status) {
                user.receivedInvite = false;
                if (status === InvitationStatusOptions.accepted) {
                    user.friend = true
                }
            } else {
                user.sentInvite = true;
            }
        }
        return user;
    })

}


export function update_friends_status(users: UserProps[], friends: FriendObjProps[]) {
    return users.map((user) => {
        const foundFriend = friends.find(friend => friend.uid === user.uid)
        if (foundFriend) {
            user.friend = foundFriend.active
        }
        return user
    })
}

export function unfriend_user(users: UserProps[], uid: string) {
    return users.map((user) => {
        if (user.uid === uid) {
            user.friend = false
        }
        return user
    })
}

export function update_profile_to_current(nearUsers: NearByUsersProps[], history: ProfileUserProps[]): ProfileUserProps[] {
    return history.map((user) => {
        const foundNearUser = nearUsers.find((nearUser) => nearUser.uid === user.uid)
        if (foundNearUser) {
            user.friend = foundNearUser.friend
            user.sentInvite = foundNearUser.sentInvite
            user.receivedInvite = foundNearUser.sentInvite
            user.profileImg = foundNearUser.profileImg
            user.distance = foundNearUser.distance
        }
        return user
    })
}