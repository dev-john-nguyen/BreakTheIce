import * as FileSystem from 'expo-file-system'

export class AutoId {
    static newId(len?: number): string {
        // Alphanumeric characters
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let autoId = '';
        let idLen = len ? len : 20
        for (let i = 0; i < idLen; i++) {
            autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return autoId;
    }
}

export async function cacheImage(image: string) {
    if (!image) return;

    const hashImg = hashCode(image);

    const path = `${FileSystem.cacheDirectory}${hashImg}.jpg`;


    return await FileSystem.getInfoAsync(path)
        .then(async imgObj => {
            if (!imgObj.exists) {
                //cache image
                console.log('caching..')
                return await FileSystem.downloadAsync(image, path)
                    .then(cachedImg => cachedImg.uri)
            } else {
                //image already cached
                return imgObj.uri;
            }
        })
        .catch(err => {
            console.log(err)
            return ''
        })
}

export function hashCode(string: string) {
    var hash = 0, i, chr;
    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
}

export const calcDateDiff = (date: any) => {
    if (!date) return;

    const date1: any = new Date();
    const diffTime = Math.abs(date1 - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return diffDays + " days ago"
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours < 24 && diffHours > 1) return diffHours + " hours ago"
    const diffMins = Math.ceil(diffTime / (1000 * 60));
    if (diffMins < 60 && diffMins > 1) return diffMins + " mins ago"
    const diffSec = Math.ceil(diffTime / (1000));
    return diffSec + " secs ago";
}