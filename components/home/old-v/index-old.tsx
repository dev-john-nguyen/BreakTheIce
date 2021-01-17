import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../../utils/styles'
import Maps from '../../maps';
import { connect } from 'react-redux';
import { RootProps } from '../../../services';
import { set_and_listen_user_location, go_online } from '../../../services/user/actions';
import { set_and_listen_near_users } from '../../../services/near_users/actions';
import { set_and_listen_invitations } from '../../../services/invitations/actions';
import { set_and_listen_friends } from '../../../services/friends/actions';
import { set_and_listen_messages } from '../../../services/chat/actions';
import { UserRootStateProps, UserDispatchActionsProps, StateCityProps, } from '../../../services/user/types';
import { NearUsersDispatchActionProps } from '../../../services/near_users/types';
import { InvitationsDispatchActionProps } from '../../../services/invitations/tsTypes';
import { ChatDispatchActionsProps } from '../../../services/chat/types';
import { FriendDispatchActionProps } from '../../../services/friends/tsTypes';
import { HomeToChatNavProp } from '../../navigation/utils';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
// @ts-ignore
import { GEOCODER_KEY } from '@env'
import { CustomButton } from '../../../utils/components';
// @ts-ignore
Geocoder.init(GEOCODER_KEY);

interface HomeProps {
    navigation: HomeToChatNavProp;
    user: UserRootStateProps;
    set_and_listen_user_location: UserDispatchActionsProps['set_and_listen_user_location'];
    set_and_listen_near_users: NearUsersDispatchActionProps['set_and_listen_near_users'];
    set_and_listen_invitations: InvitationsDispatchActionProps['set_and_listen_invitations'];
    set_and_listen_friends: FriendDispatchActionProps['set_and_listen_friends'];
    set_and_listen_messages: ChatDispatchActionsProps['set_and_listen_messages'];
    go_online: UserDispatchActionsProps['go_online'];
}

interface CurrentLocationProps {
    stateCity: StateCityProps;
    location: Location.LocationObject
}

interface ListenersProps {
    unsubscribeFriends: (() => void) | undefined;
    unsubscribeInvitations: (() => void) | undefined;
    unsubscribeNearUsers: (() => void) | undefined;
    unsubscribeChat: (() => void) | undefined;
}



const Home = (props: HomeProps) => {
    const [currentLocation, setCurrentLocation] = useState<CurrentLocationProps>()
    const [listeners, setListeners] = useState<ListenersProps>()


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
                    const stateCity: StateCityProps | undefined = await getUserstateCity(location);

                    if (stateCity) {
                        setCurrentLocation({ location, stateCity })
                    }

                }
            } catch (e) {
                console.log(e)
            }


        })();
    }, [])

    useEffect(() => {
        //initate and set all the listeners
        if (currentLocation
            && currentLocation.location
            && currentLocation.stateCity) {
            var unsubscribeFriends = props.set_and_listen_friends();
            var unsubscribeInvitations = props.set_and_listen_invitations();
            var unsubscribeNearUsers = props.set_and_listen_near_users(currentLocation.stateCity, currentLocation.location);
            var unsubscribeChat = props.set_and_listen_messages();
        }

        return () => {
            unsubscribeFriends && unsubscribeFriends()
            unsubscribeNearUsers && unsubscribeNearUsers()
            unsubscribeInvitations && unsubscribeInvitations()
            unsubscribeChat && unsubscribeChat()
        }
    }, [currentLocation])


    useEffect(() => {
        if (currentLocation &&
            currentLocation.location &&
            currentLocation.stateCity
            && !props.user.offline) {
            props.set_and_listen_user_location(currentLocation.stateCity, currentLocation.location);
        }

    }, [props.user.offline, currentLocation])


    if (props.user.offline) {
        return <View style={styles.container}>
            <CustomButton text='Go Online' type='primary' onPress={props.go_online} />
        </View>
    }

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

export default connect(mapStateToProps, {
    set_and_listen_user_location, set_and_listen_near_users, set_and_listen_invitations, set_and_listen_friends,
    set_and_listen_messages, go_online
})(Home);