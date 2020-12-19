import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, BaseRouter } from '@react-navigation/native';
import Home from '../../home';
import NearByList from '../../nearbylist';
import Invitations from '../../invitations';
import Profile from '../../profile';
import Friends from '../../friends';
import Chat from '../../chat';
import Message from '../../chat/components/Message';
import Me from '../../me';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { screenOptions } from '../header';
import { ChatPreviewProps } from '../../../services/chat/tsTypes';

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
    Chat: undefined,
    Message: {
        usersInfo: ChatPreviewProps['usersInfo']
    },
    Profile: ProfileRouteParams
}

type MeStackParams = {
    Friends: undefined;
    Me: { title: string };
    Profile: ProfileRouteParams;
    Settings: undefined;
}

export type FriendsBottomTabNavProp = BottomTabNavigationProp<RootBottomParamList, 'Friends'>;
export type HomeScreenRouteProp = RouteProp<HomeStackParams, "Home" | "NearByList" | "Profile">;
export type HomeStackNavigationProp = StackNavigationProp<HomeStackParams>;

export type InvitationsScreenRouteProp = RouteProp<InvitationsStackParams, "Invitations" | "Profile">
export type InvitationsStackNavigationProp = StackNavigationProp<InvitationsStackParams>;

export type ChatScreenRouteProp = RouteProp<ChatStackParams, "Chat" | "Message" | "Profile">
export type MessageScreenRouteProp = RouteProp<ChatStackParams, "Message">
export type ChatStackNavigationProp = StackNavigationProp<ChatStackParams>;

export type MeScreenRouteProp = RouteProp<MeStackParams, "Friends" | "Me" | "Profile" | "Settings">
export type MeStackNavigationProp = StackNavigationProp<MeStackParams>

const HomeStack = createStackNavigator<HomeStackParams>();
const InvitationsStack = createStackNavigator<InvitationsStackParams>();
const MeStack = createStackNavigator<MeStackParams>();
const ChatStack = createStackNavigator<ChatStackParams>();

export const InvitationsStackScreen = () => (
    <InvitationsStack.Navigator screenOptions={screenOptions}>
        <InvitationsStack.Screen name="Invitations" component={Invitations} />
        <HomeStack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} initialParams={{ profileUid: '' }} />
    </InvitationsStack.Navigator>
)


export const HomeStackScreen = () => (
    <HomeStack.Navigator screenOptions={screenOptions}>
        <HomeStack.Screen name="Home" component={Home} />
        <HomeStack.Screen name="NearByList" component={NearByList} />
        <HomeStack.Screen name="Profile" component={Profile}
            options={({ route }) => ({ title: route.params.title ? route.params.title : 'Profile' })}
            initialParams={{ profileUid: '' }} />
    </HomeStack.Navigator>
)

export const MeStackScreen = (props: any) => {
    const { title } = props.route.params;

    return <MeStack.Navigator screenOptions={screenOptions}>
        <MeStack.Screen name="Me" component={Me} initialParams={{ title: title ? title : 'Profile' }} />
        <MeStack.Screen name="Friends" component={Friends} />
        <MeStack.Screen name="Profile" component={Profile}
            options={({ route }) => ({ title: route.params.title ? route.params.title : 'Profile' })}
            initialParams={{ profileUid: '' }} />
    </MeStack.Navigator>
}

export const ChatStackScreen = () => (
    <ChatStack.Navigator screenOptions={screenOptions}>
        <ChatStack.Screen name="Chat" component={Chat} />
        <ChatStack.Screen name="Message" component={Message} />
        <ChatStack.Screen name="Profile" component={Profile}
            options={({ route }) => ({ title: route.params.title ? route.params.title : 'Profile' })}
            initialParams={{ profileUid: '' }} />
    </ChatStack.Navigator>
)