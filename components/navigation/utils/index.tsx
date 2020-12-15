import React from 'react';
import { Pressable, Text } from 'react-native'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Home from '../../home';
import NearByList from '../../nearbylist';
import Invitations from '../../invitations';
import Profile from '../../profile';
import Friends from '../../friends';
import { ProfilePage, HomePage, NearByListPage } from '../../../utils/variables'

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

export enum HomeScreenOptions {
    NearByList = 'NearByList',
    Home = 'Home',
    Profile = 'Profile'
}

type RootBottomParamList = {
    Home: {
        screen: HomeScreenOptions,
        params: { profileUid: string }
    };
    Invitations: undefined;
    Friends: undefined;
}

type HomeStackParams = {
    Home: undefined,
    NearByList: undefined,
    Profile: {
        profileUid: string, backConfig?: {
            bottomTab: string,
            screen: string
        }
    }
}

export type FriendsBottomTabNavProp = BottomTabNavigationProp<RootBottomParamList, 'Friends'>;
export type ProfileScreenRouteProp = RouteProp<HomeStackParams, 'Profile'>;
export type HomeStackNavigationProp = StackNavigationProp<HomeStackParams>;

const HomeStack = createStackNavigator<HomeStackParams>();
const InvitationsStack = createStackNavigator();
const FriendsStack = createStackNavigator();

const defaultOptions: any = {
    headerRight: () => (
        <Pressable>
            <Text>Log Out</Text>
        </Pressable>
    ),
    headerStyle: {
        backgroundColor: '#28df99'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'bold'
    }
}

export const InvitationsStackScreen = () => (
    <InvitationsStack.Navigator>
        <InvitationsStack.Screen name="Invitations" component={Invitations} options={defaultOptions} />
        <HomeStack.Screen name="Profile" component={Profile} options={{ ...defaultOptions, title: 'Profile' }} initialParams={{ profileUid: '' }} />
    </InvitationsStack.Navigator>
)


export const HomeStackScreen = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen name="Home" component={Home} options={{ ...defaultOptions, title: 'Map' }} />
        <HomeStack.Screen name="NearByList" component={NearByList} options={{ ...defaultOptions, title: 'List' }} />
        <HomeStack.Screen name="Profile" component={Profile}

            options={({ navigation, route }) => ({
                ...defaultOptions,
                title: 'Profile'
            })}

            initialParams={{ profileUid: '' }} />
    </HomeStack.Navigator>
)

export const FriendsStackScreen = () => (
    <FriendsStack.Navigator>
        <FriendsStack.Screen name="Friends" component={Friends} options={defaultOptions} />
        <HomeStack.Screen name="Profile" component={Profile} options={{ ...defaultOptions, title: 'Profile' }} initialParams={{ profileUid: '' }} />
    </FriendsStack.Navigator>
)