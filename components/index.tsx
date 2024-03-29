import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { remove_banner } from '../services/banner/actions';
import { BannerRootStateProps, BannerDispatchActionProps } from '../services/banner/tsTypes';
import SignIn from './signin';
import BottomNav from './navigation/Bottom';
import { RootProps } from '../services';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { HomeStackScreen, InvitationsStackScreen, MeStackScreen, ChatStackScreen } from './navigation'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { bottomTabInvitations, bottomTabChat, bottomTabsHome, bottomTabsProfile } from '../utils/variables';
import { InvitationsDispatchActionProps } from '../services/invitations/types';
import { FriendDispatchActionProps } from '../services/friends/types';
import { ChatDispatchActionsProps } from '../services/chat/types';
import { set_and_listen_invitations } from '../services/invitations/actions';
import { set_and_listen_friends } from '../services/friends/actions';
import { set_and_listen_messages } from '../services/chat/actions';
import Banner from './utils/components/banner';
import Notification from './utils/components/Notification';
import { useFonts, Rubik_500Medium } from '@expo-google-fonts/rubik';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { colors } from './utils/styles';
import AccountCreation from './account_creation';

const BottomTabs = createBottomTabNavigator();


interface Base {
    banner: BannerRootStateProps;
    remove_banner: BannerDispatchActionProps['remove_banner']
    user: RootProps['user'];
    set_and_listen_invitations: InvitationsDispatchActionProps['set_and_listen_invitations'];
    set_and_listen_friends: FriendDispatchActionProps['set_and_listen_friends'];
    set_and_listen_messages: ChatDispatchActionsProps['set_and_listen_messages'];
}


const Base = (props: Base) => {
    let [fontsLoaded,] = useFonts({
        Roboto_400Regular,
        Rubik_500Medium
    });


    useEffect(() => {
        //init and unsubscribe
        var unsubscribeFriends: (() => void) | undefined,
            unsubscribeInvitations: (() => void) | undefined,
            unsubscribeChat: (() => void) | undefined;

        const unsubscribeListeners = () => {
            unsubscribeFriends && unsubscribeFriends()
            unsubscribeInvitations && unsubscribeInvitations()
            unsubscribeChat && unsubscribeChat()
            props.user.locationListener && props.user.locationListener.remove();
        }

        if (props.user.uid && !props.user.init) {
            unsubscribeFriends = props.set_and_listen_friends();
            unsubscribeInvitations = props.set_and_listen_invitations();
            unsubscribeChat = props.set_and_listen_messages();
        } else {
            unsubscribeListeners()
        }

        return () => unsubscribeListeners()
    }, [props.user.uid, props.user.init])


    const getTabBarVisibility = (route: any) => {
        const routeName = getFocusedRouteNameFromRoute(route)
        switch (routeName) {
            case 'Message':
            case 'Settings':
            case 'NearByList':
            case 'Friends':
                return false
            default:
                return true
        }
    }


    const handleRender = () => {
        if (props.banner.loading) return <ActivityIndicator />
        if (props.user.fetchFail) return <Text>Oops! We couldn't retrieve your profile.</Text>

        if (props.user.uid) {

            if (props.user.init) {
                return <AccountCreation />
            }

            return (
                <NavigationContainer>
                    <BottomTabs.Navigator backBehavior='history' lazy={true} tabBar={props => <BottomNav {...props} />}>
                        <BottomTabs.Screen
                            name={bottomTabsHome}
                            component={HomeStackScreen}
                            options={({ route }) => ({
                                tabBarVisible: getTabBarVisibility(route)
                            })}
                        />
                        <BottomTabs.Screen name={bottomTabInvitations} component={InvitationsStackScreen} />
                        <BottomTabs.Screen name={bottomTabChat} component={ChatStackScreen}
                            options={({ route }) => ({
                                tabBarVisible: getTabBarVisibility(route)
                            })}
                        />
                        <BottomTabs.Screen
                            name={bottomTabsProfile}
                            component={MeStackScreen}
                            initialParams={{ title: props.user.username }}
                            options={({ route }) => ({
                                tabBarVisible: getTabBarVisibility(route)
                            })}
                        />
                    </BottomTabs.Navigator>
                </NavigationContainer>
            )
        }
        else { return <SignIn /> }
    }

    return (
        <View style={styles.container}>
            {!fontsLoaded ? <ActivityIndicator size='small' color={colors.primary} /> :
                <>
                    <StatusBar style='dark' />
                    {
                        props.banner.notification.length > 0 &&
                        <Notification notification={props.banner.notification} />
                    }
                    {
                        props.banner.banner.length > 0 &&
                        <Banner
                            remove_banner={props.remove_banner}
                            banner={props.banner.banner}
                        />
                    }
                    {
                        handleRender()
                    }
                </>
            }
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-between',
        position: 'relative',
        backgroundColor: colors.backgroundColor
    }
});

const mapStateToProps = (state: RootProps) => ({
    banner: state.banner,
    user: state.user
})

export default connect(mapStateToProps, {
    remove_banner, set_and_listen_invitations,
    set_and_listen_friends,
    set_and_listen_messages,
})(Base)