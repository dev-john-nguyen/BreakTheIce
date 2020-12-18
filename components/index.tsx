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
import { bottomTabInvitations, bottomTabMessages, bottomTabsHome, bottomTabsProfile } from '../utils/variables';

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
                    <BottomTabs.Navigator backBehavior='history' tabBar={props => <BottomNav {...props} />}>
                        <BottomTabs.Screen name={bottomTabsHome} component={HomeStackScreen} />
                        <BottomTabs.Screen name={bottomTabInvitations} component={InvitationsStackScreen} />
                        <BottomTabs.Screen name={bottomTabMessages} component={ChatStackScreen} />
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
    user: state.user
})

// Base.propTypes = {
//     error: PropTypes.string.isRequired,
//     loading: PropTypes.bool.isRequired,
//     uid: PropTypes.string.isRequired
// }

export default connect(mapStateToProps, { remove_error })(Base)