import { myFire } from '../firebase';

const notificationTypes = {
    sentInvite: 'sentInvite',
    newFriend: 'newFriend',
    nearBy: 'nearBy',
    newMessage: 'newMessage'
}

type TypeProps = keyof typeof notificationTypes


// export const sendPushNotification = async (sentToId: string, sentByUsername: string, type: TypeProps) => {


//     const user = myFire.auth().currentUser

//     if (!user) return false

//     const idToken = await user.getIdToken()

//     try {
//         await fetch('http://10.0.0.18:5050/notification', {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Authorization': 'Bearer ' + idToken,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 sentToId: sentToId,
//                 sentByUsername: sentByUsername,
//                 type
//             })
//         })

//     } catch (err) {
//         console.log(err)
//     }

// }
