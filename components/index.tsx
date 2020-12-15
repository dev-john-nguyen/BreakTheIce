import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { remove_error } from '../services/utils/actions';
import Login from './login';
import Navigation from './navigation';
import { RootProps } from '../services';
import { UtilsRootStateProps } from '../services/utils/tsTypes';
import { UserRootStateProps } from '../services/user/tsTypes';
import { NavigationContainer } from '@react-navigation/native';
import { HomeStackScreen, InvitationsStackScreen, FriendsStackScreen } from './navigation/utils'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const BottomTabs = createBottomTabNavigator();

interface Base {
    error: string;
    loading: boolean;
    uid: string;
    fetchFail: boolean | undefined;
    remove_error: () => void;
}

const Base = (props: Base) => {
    const handleRender = () => {
        if (props.loading) return <ActivityIndicator />
        if (props.fetchFail) return <Text>Oops! We couldn't retrieve your profile.</Text>
        if (props.uid) {
            return (
                <NavigationContainer>
                    <BottomTabs.Navigator backBehavior='history' tabBar={props => <Navigation {...props} />}>
                        <BottomTabs.Screen name='Home' component={HomeStackScreen} />
                        <BottomTabs.Screen name='Invitations' component={InvitationsStackScreen} />
                        <BottomTabs.Screen name='Friends' component={FriendsStackScreen} />
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
                <View style={styles.errorContainer}>
                    <View style={styles.errorText}>
                        <Text>{props.error}</Text>
                        <Pressable onPress={() => props.remove_error()}>
                            <Text>Okay</Text>
                        </Pressable>
                    </View>
                </View>
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
        padding: 10
    },
    errorText: {
        width: '100%',
        backgroundColor: '#ff4646',
        color: '#f6f7d4',
        textAlign: 'center',
        padding: 10,
        borderRadius: 5
    }
});

const mapStateToProps = (state: RootProps) => ({
    error: state.utils.error,
    loading: state.utils.loading,
    uid: state.user.uid,
    fetchFail: state.user.fetchFail
})

// Base.propTypes = {
//     error: PropTypes.string.isRequired,
//     loading: PropTypes.bool.isRequired,
//     uid: PropTypes.string.isRequired
// }

export default connect(mapStateToProps, { remove_error })(Base)