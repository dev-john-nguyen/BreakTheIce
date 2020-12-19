import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../utils/styles'
import Maps from '../maps';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { set_and_listen_user_location } from '../../services/user/actions';
import { set_and_listen_near_users } from '../../services/near_users/actions';
import { set_and_listen_invitations } from '../../services/invitations/actions';
import { set_and_listen_friends } from '../../services/friends/actions';
import { set_and_listen_messages } from '../../services/chat/actions';
import { UserRootStateProps, UserDispatchActionsProps, StateCityProps, } from '../../services/user/tsTypes';
import { NearUsersDispatchActionProps } from '../../services/near_users/tsTypes';
import { InvitationsDispatchActionProps } from '../../services/invitations/tsTypes';
import { ChatDispatchActionsProps } from '../../services/chat/tsTypes';
import { FriendDispatchActionProps } from '../../services/friends/tsTypes';
import { HomeStackNavigationProp } from '../navigation/utils';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
// @ts-ignore
import { GEOCODER_KEY } from '@env'
// @ts-ignore
Geocoder.init(GEOCODER_KEY);

interface HomeProps {
    navigation: HomeStackNavigationProp;
    user: UserRootStateProps;
    set_and_listen_user_location: UserDispatchActionsProps['set_and_listen_user_location'];
    set_and_listen_near_users: NearUsersDispatchActionProps['set_and_listen_near_users'];
    set_and_listen_invitations: InvitationsDispatchActionProps['set_and_listen_invitations'];
    set_and_listen_friends: FriendDispatchActionProps['set_and_listen_friends'];
    set_and_listen_messages: ChatDispatchActionsProps['set_and_listen_messages'];
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
        //initate and set all the listeners
        if (currentLocation && currentLocation.location && currentLocation.stateCity) {
            props.set_and_listen_user_location(currentLocation.stateCity, currentLocation.location);
            props.set_and_listen_friends(props.user.uid);
            props.set_and_listen_invitations(props.user.uid);
            props.set_and_listen_near_users(props.user.uid, currentLocation.stateCity, currentLocation.location);
            props.set_and_listen_messages(props.user.uid);
        }
    }, [currentLocation])

    const handleOnListViewPress = () => props.navigation.push('NearByList')

    return (
        <View style={styles.container}>
            {props.user.location && props.user.stateCity ?
                <Maps navigation={props.navigation} />
                :
                <ActivityIndicator size='large' color={colors.primary} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

})

const mapStateToProps = (state: RootProps) => ({
    user: state.user,
})

// Home.propType = {
//     user: PropTypes.object.isRequired,
//     set_and_listen_near_users: PropTypes.func.isRequired
// }

export default connect(mapStateToProps, {
    set_and_listen_user_location, set_and_listen_near_users, set_and_listen_invitations, set_and_listen_friends,
    set_and_listen_messages
})(Home);