import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HomeScreenRouteProp, InvitationsScreenRouteProp, ChatScreenRouteProp, MeScreenRouteProp } from './utils';
import { colors } from '../../utils/styles';

interface RouteProps {
    props: HomeScreenRouteProp | InvitationsScreenRouteProp | ChatScreenRouteProp | MeScreenRouteProp
}

const renderTitle = (route: RouteProps['props']) => {
    if (!route.params || !route.params.title) {
        switch (route.name) {
            case 'Home':
                return 'Map'
            case 'NearByList':
                return 'List'
            case 'Me':
                return 'Profile'
            default:
                return route.name
        }
    } else return route.params.title;
}


export const screenOptions = (props: { navigation: any, route: RouteProps['props'] }) => ({
    headerTitle: () => {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{renderTitle(props.route)}</Text>
                <View style={styles.underline} />
            </View>
        )
    },

    headerStyle: styles.header_style,
    headerTintColor: colors.white,
    headerTitleStyle: styles.header_tint_style,
    headerBackTitleVisible: false
}
)

const styles = StyleSheet.create({
    container: {
        position: 'relative'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 25,
        letterSpacing: 2,
        position: 'relative',
        bottom: 5,
        color: colors.white
    },
    underline: {
        position: 'absolute',
        backgroundColor: colors.white,
        opacity: .5,
        height: 15,
        borderRadius: 20,
        bottom: 3,
        alignSelf: 'center',
        width: '120%'
    },
    header_style: {
        backgroundColor: colors.primary,
        height: 110
    },
    header_tint_style: {
        fontWeight: 'bold',
        fontSize: 25,
        letterSpacing: 2,
        position: 'relative',
        bottom: 5
    }
})