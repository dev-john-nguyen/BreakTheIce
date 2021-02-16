import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, Route } from '@react-navigation/native';
import Home from '../../home';
import NearByList from '../../nearbylist';
import Invitations from '../../invitations';
import Profile from '../../profile';
import Friends from '../../friends';
import Chat from '../../chat';
import Message from '../../chat/components/Message';
import Me from '../../me';
import Settings from '../../settings';
import { screenOptions } from '../Header';
import { ChatPreviewProps } from '../../../services/chat/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ProfileImgProps } from '../../../services/user/types';
import { windowHeight } from '../../../utils/variables';
import { colors } from '../../utils/styles';

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
            targetUser: {
                uid: string,
                username: string,
                profileImg: ProfileImgProps | null
            }
        }
    };
    Invitations: undefined,
    Me: undefined
}

type ProfileRouteParams = {
    profileUid: string,
    title: string,
    backConfig?: {
        bottomTab: string,
        screen: string
    }
}

export type HomeStackParams = {
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
        setRead: boolean,
        targetUser: {
            uid: string,
            username: string,
            profileImg: ProfileImgProps | null
        },
        title?: undefined
    },
    Profile: ProfileRouteParams
}

type MeStackParams = {
    Friends: undefined;
    Me: { title: string };
    Profile: ProfileRouteParams;
    Settings: undefined;
}


export type HomeAllNavigationProp = BottomTabNavigationProp<RootBottomParamList & HomeStackParams, 'Profile'> & HomeStackNavigationProp

export type HomeToChatNavProp = BottomTabNavigationProp<RootBottomParamList & HomeStackParams, 'Home'> & HomeStackNavigationProp;

export type HomeScreenRouteProp = RouteProp<HomeStackParams, "Home" | "NearByList" | "Profile">;
export type ProfileScreenRouteProp = RouteProp<HomeStackParams, "Profile">;

export type HomeStackNavigationProp = StackNavigationProp<HomeStackParams>;

export type InvitationsScreenRouteProp = RouteProp<InvitationsStackParams, "Invitations" | "Profile">
export type InvitationsStackNavigationProp = StackNavigationProp<InvitationsStackParams>;

export type ChatScreenRouteProp = RouteProp<ChatStackParams, "Chat" | "Message" | "Profile">
export type ChatStackNavigationProp = StackNavigationProp<ChatStackParams>;

export type MeScreenRouteProp = RouteProp<MeStackParams, "Friends" | "Me" | "Profile" | "Settings">
export type SettingScreenRouteProp = RouteProp<MeStackParams, "Settings">
export type MeStackNavigationProp = StackNavigationProp<MeStackParams>

const HomeStack = createStackNavigator<HomeStackParams>();
const InvitationsStack = createStackNavigator<InvitationsStackParams>();
const MeStack = createStackNavigator<MeStackParams>();
const ChatStack = createStackNavigator<ChatStackParams>();

const profileOptions = ({ route }: { route: Route<'Profile', ProfileRouteParams> }) => ({
    title: route.params.title ? route.params.title : 'Profile',
    cardStyle: { marginTop: 0 }
})

export const InvitationsStackScreen = () => (
    <InvitationsStack.Navigator screenOptions={screenOptions}>
        <InvitationsStack.Screen name="Invitations" component={Invitations} />
        <InvitationsStack.Screen
            name="Profile"
            component={Profile}
            options={profileOptions}
            initialParams={{ profileUid: '' }}
        />
    </InvitationsStack.Navigator>
)


export const HomeStackScreen = () => (
    <HomeStack.Navigator screenOptions={screenOptions}>
        <HomeStack.Screen name="Home" component={Home} options={{ cardStyle: { marginTop: 0 } }} />
        <HomeStack.Screen name="NearByList" component={NearByList} />
        <HomeStack.Screen
            name="Profile"
            component={Profile}
            options={profileOptions}
            initialParams={{ profileUid: '' }} />
    </HomeStack.Navigator>
)

export const MeStackScreen = (props: any) => {
    const { title } = props.route.params;

    return <MeStack.Navigator screenOptions={screenOptions}>
        <MeStack.Screen name="Me" component={Me} initialParams={{ title: title ? title : 'Profile' }} options={{ cardStyle: { paddingTop: 0, backgroundColor: colors.backgroundColor } }} />
        <MeStack.Screen name="Friends" component={Friends} options={{ cardStyle: { paddingTop: windowHeight / 9, backgroundColor: colors.backgroundColor } }} />
        <MeStack.Screen
            name="Profile"
            component={Profile}
            options={profileOptions}
            initialParams={{ profileUid: '' }} />
        <MeStack.Screen name="Settings" component={Settings} options={{ cardStyle: { paddingTop: windowHeight / 9, backgroundColor: colors.backgroundColor } }} />
    </MeStack.Navigator>
}

export const ChatStackScreen = () => (
    <ChatStack.Navigator screenOptions={screenOptions}>
        <ChatStack.Screen name="Chat" component={Chat} />
        <ChatStack.Screen name="Message" component={Message} />
        <ChatStack.Screen
            name="Profile"
            component={Profile}
            options={profileOptions}
            initialParams={{ profileUid: '' }} />
    </ChatStack.Navigator>
)