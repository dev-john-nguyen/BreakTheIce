import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Maps from '../maps';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { set_user_location } from '../../services/user/actions';
import { set_and_listen_near_users } from '../../services/near_users/actions';
import { UserRootStateProps, UserDispatchActionsProps, StateCityProps, } from '../../services/user/tsTypes';
import { NearUsersProps, NearUsersDispatchActionProps } from '../../services/near_users/tsTypes';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
// @ts-ignore
import { GEOCODER_KEY } from '@env'
// @ts-ignore
Geocoder.init(GEOCODER_KEY);

interface HomeProps {
    user: UserRootStateProps;
    set_user_location: UserDispatchActionsProps['set_user_location'];
    set_and_listen_near_users: NearUsersDispatchActionProps['set_and_listen_near_users'];
}

interface CurrentLocationProps {
    stateCity: StateCityProps;
    location: Location.LocationObject
}

const Home = (props: HomeProps) => {
    const [currentLocation, setCurrentLocation] = useState<CurrentLocationProps>()

    const getUserstateCity = async (location: Location.LocationObject) => {

        var stateCity: StateCityProps = {
            state: '',
            city: ''
        }

        return stateCity = {
            state: 'WA',
            city: 'Bellevue'
        }

        try {
            // @ts-ignore
            const res = await Geocoder.from({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            })

            console.log(res)

            var address: string = res.results[0].formatted_address

            //the second index should be the state and zip
            var addressArr: Array<string> = address.split(',');
            var state: string = addressArr[2].split(' ')[1];
            var city: string = addressArr[1].replace(' ', '');

            if (state && city) {
                return stateCity = {
                    state,
                    city
                }
            }

        } catch (e) {
            console.log(e)
            return;
        }

        //then nothing and have an alternative (manually set it)

    }

    useEffect(() => {
        //onMount update/set user location
        (async () => {
            try {
                let { status } = await Location.requestPermissionsAsync();
                if (status !== 'granted') {
                    return console.log('Permission to access location was denied')
                    // setErrorMsg('Permission to access location was denied');
                }

                let location = await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.Highest });

                if (location) {
                    const fetchedUserstateCity: StateCityProps | undefined = await getUserstateCity(location);
                    if (fetchedUserstateCity) {
                        setCurrentLocation({
                            location: location,
                            stateCity: fetchedUserstateCity
                        })
                    }
                }
            } catch (e) {
                console.log(e)
            }


        })();


    }, [])

    useEffect(() => {
        if (currentLocation && currentLocation.location && currentLocation.stateCity) {
            props.set_user_location(props.user.uid, currentLocation.stateCity, currentLocation.location)
            props.set_and_listen_near_users(props.user.uid, currentLocation.stateCity, currentLocation.location)
        }
    }, [currentLocation])


    return (
        <View style={styles.container}>
            {props.user.location && props.user.stateCity ? <Maps /> : <ActivityIndicator />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user,
})

Home.propType = {
    user: PropTypes.object.isRequired,
    set_user_location: PropTypes.func.isRequired,
    set_and_listen_near_users: PropTypes.func.isRequired
}

export default connect(mapStateToProps, { set_user_location, set_and_listen_near_users })(Home);