import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, normalize } from '../utils/styles'
import Maps from '../maps';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import { set_and_listen_user_location, go_online } from '../../services/user/actions';
import { set_and_listen_near_users } from '../../services/near_users/actions';
import { UserRootStateProps, UserDispatchActionsProps, CtryStateCityProps, } from '../../services/user/types';
import { NearUsersDispatchActionProps } from '../../services/near_users/types';
import { HomeToChatNavProp } from '../navigation';
import * as Location from 'expo-location';
import { CustomButton, BodyText, Icon, HeaderText } from '../utils';
import { getBucket } from './utils';
import * as Notifications from 'expo-notifications';

interface HomeProps {
    navigation: HomeToChatNavProp;
    user: UserRootStateProps;
    set_and_listen_user_location: UserDispatchActionsProps['set_and_listen_user_location'];
    set_and_listen_near_users: NearUsersDispatchActionProps['set_and_listen_near_users'];
    go_online: UserDispatchActionsProps['go_online'];
    invitationFetched: boolean;
    friendsFetched: boolean;
}

interface CurrentLocationProps {
    ctryStateCity: CtryStateCityProps | undefined;
    location: Location.LocationObject | undefined;
}

interface ListenersProps {
    unsubscribeFriends: (() => void) | undefined;
    unsubscribeInvitations: (() => void) | undefined;
    unsubscribeNearUsers: (() => void) | undefined;
    unsubscribeChat: (() => void) | undefined;
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const Home = (props: HomeProps) => {
    const [currentLocation, setCurrentLocation] = useState<CurrentLocationProps>({ ctryStateCity: undefined, location: undefined })
    const [refresh, setRefresh] = useState(false);
    const [errMsg, setErrMsg] = useState('')
    const notificationListener: any = useRef();
    const responseListener: any = useRef();
    const mount = useRef<boolean>();


    useEffect(() => {
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('foreground')
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('background');
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, [])

    useEffect(() => {
        //onMount update/set user location
        mount.current = true;

        (async () => {
            try {
                let { status } = await Location.requestPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission to access location was denied')
                    setErrMsg('Permission denied. Will need location permission to users neear you.')
                    return;
                }

                let location = await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.Highest });

                if (location) {
                    const ctryStateCity: CtryStateCityProps | undefined = await getBucket(location);

                    if (ctryStateCity) {
                        mount.current && setCurrentLocation({ location, ctryStateCity })
                    } else {
                        setErrMsg('Unable to find your location bucket. Please refresh.')
                    }

                }
            } catch (e) {
                console.log(e)
                setErrMsg("Unable to find your location. Please refresh.")
            }


        })();

        return () => {
            mount.current = false
        }
    }, [refresh])

    useEffect(() => {
        const { location, ctryStateCity } = currentLocation;
        const { user, friendsFetched, invitationFetched } = props;

        if (location && ctryStateCity && !user.offline && invitationFetched && friendsFetched) {

            if (user.locationListener) {
                user.locationListener.remove()
            }
            props.set_and_listen_user_location(ctryStateCity, location);

            var unsubscribeNearUsers = props.set_and_listen_near_users(ctryStateCity, location)

        }

        return () => {

            props.user.locationListener && props.user.locationListener.remove()
            unsubscribeNearUsers && unsubscribeNearUsers()
        }

    }, [props.user.offline, currentLocation, props.invitationFetched, props.friendsFetched])


    if (props.user.offline) {
        return <View style={styles.container}>
            <CustomButton text='Go Online' type='primary' onPress={props.go_online} />
        </View>
    }

    return (
        <View style={styles.container}>
            {(props.user.location && props.user.ctryStateCity) ?
                <Maps navigation={props.navigation} />
                :
                !!errMsg ?
                    <View style={styles.err_container}>
                        <HeaderText style={styles.err_text}>{errMsg}</HeaderText>
                        <Icon
                            type='refresh-cw'
                            onPress={() => {
                                setErrMsg('');
                                setRefresh(true);
                            }}
                            color={colors.red}
                            pressColor={colors.lightRed}
                            size={40}
                        />
                    </View>
                    : <ActivityIndicator size='large' color={colors.primary} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    err_container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    err_text: {
        fontSize: normalize(20),
        color: colors.red,
        margin: 20,
        textAlign: 'center'
    }

})

const mapStateToProps = (state: RootProps) => ({
    user: state.user,
    invitationFetched: state.invitations.fetched,
    friendsFetched: state.friends.fetched
})

export default connect(mapStateToProps, {
    set_and_listen_user_location, set_and_listen_near_users, go_online
})(Home);