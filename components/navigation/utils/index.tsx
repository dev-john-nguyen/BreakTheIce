import React from 'react';
import { Pressable } from 'react-native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Home from '../../home';
import NearByList from '../../nearbylist';
import Invitations from '../../invitations';
import Profile from '../../profile';
import Friends from '../../friends';
import Chat from '../../chat';
import Message from '../../chat/components/Message';
import Me from '../../me';
import Settings from '../../settings';
import EditGallery from '../../gallery/components/Edit';
import { screenOptions } from '../Header';
import { ChatPreviewProps } from '../../../services/chat/tsTypes';
import { SettingsSvgHeader } from '../../../utils/components';
import { NearByUsersProps } from '../../../services/near_users/tsTypes';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

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

export type RootBottomParamList = {
    Home: {
        screen: HomeScreenOptions,
        params: { profileUid: string }
    };
    Chat: {
        screen: 'Message',
        initial?: boolean;
        params: {
            targetUser: NearByUsersProps;
        }
    };
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

export type ChatStackParams = {
    Chat: undefined,
    Message: {
        msgDocId: ChatPreviewProps['docId'],
        unread: boolean,
        targetUser?: NearByUsersProps,
        title?: string
    },
    Profile: ProfileRouteParams
}

type MeStackParams = {
    Friends: undefined;
    Me: { title: string };
    Profile: ProfileRouteParams;
    Settings: undefined;
    EditGallery: { title: string } | undefined;
}


export type NearByListNavProp = BottomTabNavigationProp<RootBottomParamList, 'Home'> & HomeStackNavigationProp;

export type HomeScreenRouteProp = RouteProp<HomeStackParams, "Home" | "NearByList" | "Profile">;
export type ProfileScreenRouteProp = RouteProp<HomeStackParams, "Profile">;
export type HomeStackNavigationProp = StackNavigationProp<HomeStackParams>;

export type InvitationsScreenRouteProp = RouteProp<InvitationsStackParams, "Invitations" | "Profile">
export type InvitationsStackNavigationProp = StackNavigationProp<InvitationsStackParams>;

export type ChatScreenRouteProp = RouteProp<ChatStackParams, "Chat" | "Message" | "Profile">
export type ChatStackNavigationProp = StackNavigationProp<ChatStackParams>;

export type MeScreenRouteProp = RouteProp<MeStackParams, "Friends" | "Me" | "Profile" | "Settings" | "EditGallery">
export type SettingScreenRouteProp = RouteProp<MeStackParams, "Settings">
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
        <MeStack.Screen name="Me" component={Me} initialParams={{ title: title ? title : 'Profile' }} options={({ navigation }) => ({
            headerRight: () => (<Pressable onPress={() => navigation.push('Settings')}>
                {({ pressed }) => <SettingsSvgHeader pressed={pressed} />}
            </Pressable>)
        })} />
        <MeStack.Screen name="Friends" component={Friends} />
        <MeStack.Screen name="Profile" component={Profile}
            options={({ route }) => ({
                title: route.params.title ? route.params.title : 'Profile'
            })}
            initialParams={{ profileUid: '' }} />
        <MeStack.Screen name="Settings" component={Settings} />
        <MeStack.Screen name="EditGallery" component={EditGallery} initialParams={{ title: 'Gallery' }} />
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