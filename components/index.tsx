import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, Dimensions, StyleProp, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { remove_banner } from '../services/utils/actions';
import { UtilsRootStateProps } from '../services/utils/tsTypes';
import Login from './login';
import BottomNav from './navigation/Bottom';
import { RootProps } from '../services';
import { NavigationContainer } from '@react-navigation/native';
import { HomeStackScreen, InvitationsStackScreen, MeStackScreen, ChatStackScreen } from './navigation/utils/types'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { bottomTabInvitations, bottomTabChat, bottomTabsHome, bottomTabsProfile } from '../utils/variables';
import { bannerStyles } from '../utils/styles';
import { InvitationsDispatchActionProps } from '../services/invitations/types';
import { FriendDispatchActionProps } from '../services/friends/types';
import { ChatDispatchActionsProps } from '../services/chat/types';
import { set_and_listen_invitations } from '../services/invitations/actions';
import { set_and_listen_friends } from '../services/friends/actions';
import { set_and_listen_messages } from '../services/chat/actions';
import { FlatList } from 'react-native-gesture-handler';

const BottomTabs = createBottomTabNavigator();

interface Base {
    utils: UtilsRootStateProps;
    remove_error: () => void;
    remove_banner: () => void;
    user: RootProps['user'];
    set_and_listen_invitations: InvitationsDispatchActionProps['set_and_listen_invitations'];
    set_and_listen_friends: FriendDispatchActionProps['set_and_listen_friends'];
    set_and_listen_messages: ChatDispatchActionsProps['set_and_listen_messages'];
}

const Base = (props: Base) => {
    const handleRender = () => {
        if (props.utils.loading) return <ActivityIndicator />
        if (props.user.fetchFail) return <Text>Oops! We couldn't retrieve your profile.</Text>
        if (props.user.uid) {
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

        if (props.user.uid) {
            unsubscribeFriends = props.set_and_listen_friends();
            unsubscribeInvitations = props.set_and_listen_invitations();
            unsubscribeChat = props.set_and_listen_messages();
        } else {
            unsubscribeListeners()
        }

        return () => unsubscribeListeners()
    }, [props.user.uid])

    const handleRemoveBanner = () => props.remove_banner()

    const Banner = () => (
        <Pressable onPress={handleRemoveBanner} style={styles.banner_container}>
            <FlatList
                data={props.utils.banner}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    const styles = bannerStyles(item.type)
                    return (
                        <View style={styles.container}>
                            <Text style={styles.text}>{item.message}</Text>
                        </View>
                    )
                }}
            />
        </Pressable>

    )

    return (
        <>
            <ImageBackground source={require('../utils/ice.jpg')} style={styles.background_image} />
            <View style={styles.container}>
                <StatusBar style='dark' />
                {props.utils.banner.length > 0 && <Banner />}
                {handleRender()}
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-between',
        position: 'relative',
        opacity: .92
    },
    background_image: {
        position: 'absolute',
        width: Math.round(Dimensions.get('window').width),
        height: Math.round(Dimensions.get('window').height),
    },
    banner_container: {
        position: 'absolute',
        top: 40,
        zIndex: 100,
        width: Math.round(Dimensions.get('window').width)
    }
});

const mapStateToProps = (state: RootProps) => ({
    utils: state.utils,
    user: state.user
})

export default connect(mapStateToProps, {
    remove_banner, set_and_listen_invitations,
    set_and_listen_friends,
    set_and_listen_messages
})(Base)