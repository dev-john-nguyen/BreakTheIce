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
        })

    // if (cachedImage) {
    //     //image was already cached
    //     return cachedImage
    // } else {
    //     //caching image
    //     return FileSystem.downloadAsync(image, path)
    // }

    // return images.map(image => {
    //     if (typeof image === 'string') {
    //         console.log(image)
    //         return Image.prefetch(image);
    //     } else {
    //         return Asset.fromModule(image).downloadAsync();
    //     }
    // });
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