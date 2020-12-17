import React from 'react';
import { View } from 'react-native'
import { createStackNavigator, StackNavigationProp, StackNavigationOptions } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Home from '../../home';
import NearByList from '../../nearbylist';
import Invitations from '../../invitations';
import Profile from '../../profile';
import Friends from '../../friends';
import Messages from '../../messages';
import Message from '../../messages/components/Message';
import Me from '../../me';
import { ProfilePage, HomePage, NearByListPage } from '../../../utils/variables';
import { colors } from '../../../utils/styles';

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

export enum InvitationScreenOptions {
    Invitations = 'Invitations',
    Profile = 'Profile'
}

export enum HomeScreenOptions {
    NearByList = 'NearByList',
    Home = 'Home',
    Profile = 'Profile'
}

export enum ChatScreenOptions {
    Chat = 'Chat',
    Message = 'Message',
    Profile = 'Profile'
}

export enum MeScreenOptions {
    Friends = 'Friends',
    Me = 'Me',
    Profile = 'Profile',
    Settings = 'Settings'
}

type RootBottomParamList = {
    Home: {
        screen: HomeScreenOptions,
        params: { profileUid: string }
    };
    Invitations: undefined;
    Friends: undefined;
}

type ProfileRouteParams = {
    profileUid: string,
    title: string,
    backConfig?: {
        bottomTab: string,
        screen: string
    }
}

type HomeStackParams = {
    Home: undefined,
    NearByList: undefined,
    Profile: ProfileRouteParams
}

type InvitationsStackParams = {
    Invitations: undefined,
    Profile: ProfileRouteParams
}

type ChatStackParams = {
    Chat: undefined;
    Message: undefined;
    Profile: ProfileRouteParams
}

type MeStackParams = {
    Friends: undefined;
    Me: undefined;
    Profile: ProfileRouteParams;
    Settings: undefined;
}

export type FriendsBottomTabNavProp = BottomTabNavigationProp<RootBottomParamList, 'Friends'>;
export type HomeScreenRouteProp = RouteProp<HomeStackParams, "Home" | "NearByList" | "Profile">;
export type HomeStackNavigationProp = StackNavigationProp<HomeStackParams>;

export type InvitationsScreenRouteProp = RouteProp<InvitationsStackParams, "Invitations" | "Profile">
export type InvitationsStackNavigationProp = StackNavigationProp<InvitationsStackParams>;

export type ChatScreenRouteProp = RouteProp<ChatStackParams, "Chat" | "Message" | "Profile">
export type ChatStackNavigationProp = StackNavigationProp<ChatStackParams>;

export type MeScreenRouteProp = RouteProp<MeStackParams, "Friends" | "Me" | "Profile" | "Settings">
export type MeStackNavigationProp = StackNavigationProp<MeStackParams>

const HomeStack = createStackNavigator<HomeStackParams>();
const InvitationsStack = createStackNavigator<InvitationsStackParams>();
const ProfileStack = createStackNavigator<MeStackParams>();
const ChatStack = createStackNavigator<ChatStackParams>();

const renderHeaderUnderline = (route: HomeScreenRouteProp | InvitationsScreenRouteProp | ChatScreenRouteProp | MeScreenRouteProp) => {
    // switch statement based on route name
    var title: string;

    if (route.params) {
        title = route.params.title
    } else {
        switch (route.name) {
            case 'NearByList':
                title = 'List'
                break;
            case 'Home':
                title = 'Map'
                break;
            case 'Me':
                title = 'Profile'
                break;
            default:
                title = route.name
        }
    }

    if (title.length > 10) {
        return {
            width: 230,
            right: 100
        }
    }

    if (title.length > 5) {
        return {
            width: 150,
            right: 142
        }
    }

    return {
        width: 100,
        right: 165,
    }
}


const defaultOptions = (props: { navigation: any, route: HomeScreenRouteProp | InvitationsScreenRouteProp | ChatScreenRouteProp | MeScreenRouteProp }): StackNavigationOptions => ({
    headerRight: () => (
        <View style={{
            position: 'relative',
            backgroundColor: colors.secondary,
            opacity: .5,
            height: 15,
            borderRadius: 20,
            top: 5,
            ...renderHeaderUnderline(props.route)
        }} />
    ),
    headerStyle: {
        backgroundColor: colors.primary,
        height: 110
    },
    headerTintColor: colors.white,
    headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 25,
        letterSpacing: 2,
        position: 'relative',
        bottom: 5
    }
})

export const InvitationsStackScreen = () => (
    <InvitationsStack.Navigator screenOptions={defaultOptions}>
        <InvitationsStack.Screen name="Invitations" component={Invitations} />
        <HomeStack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} initialParams={{ profileUid: '' }} />
    </InvitationsStack.Navigator>
)


export const HomeStackScreen = () => (
    <HomeStack.Navigator screenOptions={defaultOptions}>
        <HomeStack.Screen name="Home" component={Home} options={{ title: 'Map' }} />
        <HomeStack.Screen name="NearByList" component={NearByList} options={{ title: 'List' }} />
        <HomeStack.Screen name="Profile" component={Profile}
            options={({ route }) => ({ title: route.params.title ? route.params.title : 'Profile' })}
            initialParams={{ profileUid: '' }} />
    </HomeStack.Navigator>
)

export const ProfileStackScreen = () => (
    <ProfileStack.Navigator screenOptions={defaultOptions}>
        <ProfileStack.Screen name="Me" component={Me} options={{ title: 'Profile' }} />
        <ProfileStack.Screen name="Friends" component={Friends} />
        <ProfileStack.Screen name="Profile" component={Profile}
            options={({ route }) => ({ title: route.params.title ? route.params.title : 'Profile' })}
            initialParams={{ profileUid: '' }} />
    </ProfileStack.Navigator>
)

export const ChatStackScreen = () => (
    <ChatStack.Navigator screenOptions={defaultOptions}>
        <ChatStack.Screen name="Chat" component={Messages} />
        <ChatStack.Screen name="Message" component={Message} />
        <ChatStack.Screen name="Profile" component={Profile}
            options={({ route }) => ({ title: route.params.title ? route.params.title : 'Profile' })}
            initialParams={{ profileUid: '' }} />
    </ChatStack.Navigator>
)