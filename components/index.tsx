import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { remove_error } from '../services/utils/actions';
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
    error: string;
    loading: boolean;
    remove_error: () => void;
    user: RootProps['user']
}

const Base = (props: Base) => {
    const handleRender = () => {
        if (props.loading) return <ActivityIndicator />
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

    return (
        <View style={styles.container}>
            <StatusBar style='inverted' />
            {props.error &&
                <Pressable onPress={() => props.remove_error()} style={styles.errorContainer}>
                    <Text style={styles.errorText}>{props.error}</Text>
                </Pressable>
            }
            {handleRender()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    errorContainer: {
        position: 'absolute',
        top: 40,
        zIndex: 100,
        width: Math.round(Dimensions.get('window').width),
        padding: 10,
        backgroundColor: colors.red
    },
    errorText: {
        color: colors.white,
        textAlign: 'center',
        fontSize: 14
    }
});

const mapStateToProps = (state: RootProps) => ({
    error: state.utils.error,
    loading: state.utils.loading,
    user: state.user
})

// Base.propTypes = {
//     error: PropTypes.string.isRequired,
//     loading: PropTypes.bool.isRequired,
//     uid: PropTypes.string.isRequired
// }

export default connect(mapStateToProps, { remove_error })(Base)