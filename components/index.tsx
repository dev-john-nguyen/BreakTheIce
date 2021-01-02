import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, Dimensions, StyleProp } from 'react-native';
import { connect } from 'react-redux';
import { remove_error } from '../services/utils/actions';
import { UtilsRootStateProps } from '../services/utils/tsTypes';
import Login from './login';
import BottomNav from './navigation/BottomNav';
import { RootProps } from '../services';
import { NavigationContainer } from '@react-navigation/native';
import { HomeStackScreen, InvitationsStackScreen, MeStackScreen, ChatStackScreen } from './navigation/utils'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { bottomTabInvitations, bottomTabChat, bottomTabsHome, bottomTabsProfile } from '../utils/variables';
import { colors } from '../utils/styles';

const BottomTabs = createBottomTabNavigator();

interface Base {
    utils: UtilsRootStateProps;
    remove_error: () => void;
    user: RootProps['user']
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

    const renderError = () => {
        const errorStyle = bannerStyles(props.utils.error.color)

        return <Pressable onPress={() => props.remove_error()} style={errorStyle.errorContainer}>
            <Text style={errorStyle.errorText}>{props.utils.error.message}</Text>
        </Pressable>
    }

    const Banner = () => {
        const bannerStyle = errorStyles(props.utils.banner.type)

        return <Pressable onPress={() => props.remove_error()} style={bannerStyle.errorContainer}>
            <Text style={bannerStyle.errorText}>{props.utils.banner.message}</Text>
        </Pressable>
    }

    return (
        <View style={styles.container}>
            <StatusBar style='inverted' />
            {props.utils.error && renderError()}
            {handleRender()}
            {props.utils.banner && <Banner />}
        </View>
    );
}

const bannerStyles = (type: string) => {
    var styles: StyleProp<any> = {
        errorContainer: {
            position: 'absolute',
            top: 40,
            zIndex: 100,
            width: Math.round(Dimensions.get('window').width),
            padding: 10
        },
        errorText: {
            textAlign: 'center',
            fontSize: 14
        }
    }

    switch (type) {
        case 'warning':
            styles.backgroundColor = colors.lightRed
            styles.color = colors.white
            break;
        case 'success':
            styles.backgroundColor = colors.primary
            styles.color = colors.white
            break;
        case 'error':
            styles.backgroundColor = colors.red
            styles.color = colors.white
            break;
        default:
            styles.backgroundColor = colors.primary
            styles.color = colors.white
    }

    return styles
}

const errorStyles = (color: string) => StyleSheet.create({
    errorContainer: {
        position: 'absolute',
        top: 40,
        zIndex: 100,
        width: Math.round(Dimensions.get('window').width),
        padding: 10,
        backgroundColor: color !== 'red' ? colors.quaternary : colors.red
    },
    errorText: {
        color: color !== 'red' ? colors.primary : colors.white,
        textAlign: 'center',
        fontSize: 14
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-between',
    }
});

const mapStateToProps = (state: RootProps) => ({
    utils: state.utils,
    user: state.user
})

export default connect(mapStateToProps, { remove_error })(Base)