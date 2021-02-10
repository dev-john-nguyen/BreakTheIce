import { SET_EXPO_PUSH_TOKEN, REMOVE_EXPO_PUSH_TOKEN } from './actionTypes';

export const set_expo_push_token = (expoPushToken: string) => ({
    type: SET_EXPO_PUSH_TOKEN,
    payload: expoPushToken
})

export const remove_expo_push_token = () => ({
    type: REMOVE_EXPO_PUSH_TOKEN
})


export const sendPushNotification = async (expoPushToken: string, title: string, body: string) => {
    console.log(expoPushToken)
    const message = {
        to: 'ExponentPushToken[mOgp07Oh7dEn7EZaK05ExJ]',
        sound: 'default',
        title,
        body,
        ios: { _displayInForeground: true },
        data: { someData: null },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}
