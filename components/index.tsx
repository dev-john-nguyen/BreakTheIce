import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { remove_banner, remove_notification } from '../services/utils/actions';
import { UtilsRootStateProps } from '../services/utils/tsTypes';
import Login from './login';
import BottomNav from './navigation/Bottom';
import { RootProps } from '../services';
import { NavigationContainer } from '@react-navigation/native';
import { HomeStackScreen, InvitationsStackScreen, MeStackScreen, ChatStackScreen } from './navigation/utils/types'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { bottomTabInvitations, bottomTabChat, bottomTabsHome, bottomTabsProfile } from '../utils/variables';
import { InvitationsDispatchActionProps } from '../services/invitations/types';
import { FriendDispatchActionProps } from '../services/friends/types';
import { ChatDispatchActionsProps } from '../services/chat/types';
import { set_and_listen_invitations } from '../services/invitations/actions';
import { set_and_listen_friends } from '../services/friends/actions';
import { set_and_listen_messages } from '../services/chat/actions';
import Banner from '../utils/components/Banner';
import Notification from '../utils/components/Notification';
import { colors } from '../utils/styles';
import UserInitForm from './login/components/UserInitForm';
import { init_user } from '../services/signin/actions';
import { SigninDispatchActionProps } from '../services/signin/types';

const BottomTabs = createBottomTabNavigator();

interface Base {
    utils: UtilsRootStateProps;
    remove_error: () => void;
    remove_banner: () => void;
    user: RootProps['user'];
    set_and_listen_invitations: InvitationsDispatchActionProps['set_and_listen_invitations'];
    set_and_listen_friends: FriendDispatchActionProps['set_and_listen_friends'];
    set_and_listen_messages: ChatDispatchActionsProps['set_and_listen_messages'];
    remove_notification: () => void;
    init_user: SigninDispatchActionProps['init_user'];
}

const Base = (props: Base) => {
    const handleRender = () => {
        if (props.utils.loading) return <ActivityIndicator />
        if (props.user.fetchFail) return <Text>Oops! We couldn't retrieve your profile.</Text>

        if (props.user.uid) {

            if (props.user.init) {
                return <UserInitForm init_user={props.init_user} />
            }

            return (
                <NavigationContainer>
                    <BottomTabs.Navigator backBehavior='history' lazy={true} tabBar={props => <BottomNav {...props} />}>
                        <BottomTabs.Screen name={bottomTabsHome} component={HomeStackScreen} />
                        <BottomTabs.Screen name={bottomTabInvitations} component={InvitationsStackScreen} />
                        <BottomTabs.Screen name={bottomTabChat} component={ChatStackScreen} />
                        <BottomTabs.Screen name={bottomTabsProfile} component={MeStackScreen} initialParams={{ title: props.user.username }} />
                    </BottomTabs.Navigator>
                </NavigationContainer>
            )
        }
        else { return <Login /> }
    }

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

    const handleRemoveBanner = () => props.remove_banner()

    return (
        <View style={styles.container}>
            <StatusBar style='dark' />
            {
                props.utils.notification.length > 0 &&
                <Notification notification={props.utils.notification} />
            }
            {
                props.utils.banner.length > 0 &&
                <Banner handleRemoveBanner={handleRemoveBanner} banner={props.utils.banner} />
            }
            {
                handleRender()
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
    }
});

const mapStateToProps = (state: RootProps) => ({
    utils: state.utils,
    user: state.user
})

export default connect(mapStateToProps, {
    remove_banner, set_and_listen_invitations,
    set_and_listen_friends,
    set_and_listen_messages,
    remove_notification,
    init_user
})(Base)