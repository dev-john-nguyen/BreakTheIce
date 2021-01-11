import { fireDb } from '../firebase';
import { LocationsDb, UsersDb } from '../../utils/variables';

export async function set_nearby_users_data(userData: any) {
    await fireDb.collection(UsersDb).doc(userData.uid).get()
        .then((doc) => {
            if (doc.exists) {

                const data = doc.data();
                if (!data) return;

                const profileObj = {
                    uid: doc.id,
                    username: data.username ? data.username : '',
                    stateCity: data.stateCity ? data.stateCity : {
                        state: '',
                        city: ''
                    },
                    name: data.name ? data.name : '',
                    age: data.age ? data.age : 0,
                    bioLong: data.bioLong ? data.bioLong : '',
                    bioShort: data.bioShort ? data.bioShort : '',
                    gender: data.gender ? data.gender : null,
                    isPrivate: data.isPrivate ? data.isPrivate : false,
                    location: data.location ? data.location : null,
                    gallery: data.gallery ? data.gallery : []
                }

            }
        })
        .catch(err => [
            console.log(err)
        ])
}