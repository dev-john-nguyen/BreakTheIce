import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HomeScreenRouteProp, InvitationsScreenRouteProp, ChatScreenRouteProp, MeScreenRouteProp } from './utils/types';
import { colors } from '../../utils/styles';
import { Icon, HeaderText } from '../../utils/components';

interface RouteProps {
    props: HomeScreenRouteProp | InvitationsScreenRouteProp | ChatScreenRouteProp | MeScreenRouteProp
}

// const renderTitle = (route: RouteProps['props']) => {
//     if (!route.params || !route.params.title) {
//         switch (route.name) {
//             case 'Home':
//                 return 'Map'
//             case 'NearByList':
//                 return 'List'
//             case 'Me':
//                 return 'Profile'
//             default:
//                 return route.name
//         }
//     } else return route.params.title;
// }

const renderHeaderRight = (route: RouteProps['props'], navigation: any) => {
    switch (route.name) {
        case 'Home':
            const navigateList = () => navigation.navigate('NearByList')

            return <Icon type='list' size={30} color={colors.primary} pressColor={colors.secondary} onPress={navigateList} style={styles.header_right} />
        case 'Me':
            const navigateSettings = () => navigation.navigate('Settings')

            return <Icon type='settings' size={30} color={colors.primary} pressColor={colors.secondary} onPress={navigateSettings} style={styles.header_right} />

        default:
            return undefined
    }
}

export const screenOptions = ({ route, navigation }: { navigation: any, route: RouteProps['props'] }) => ({
    headerTitle: () => {
        return (
            <View style={styles.container}>
                <HeaderText styles={styles.header_text} text={route.params?.title ? route.params.title : ''} />
                <View style={styles.underline} />
            </View>
        )
    },
    headerRight: () => renderHeaderRight(route, navigation),
    headerStyle: styles.header_style,
    headerTintColor: colors.primary,
    headerTitleStyle: styles.header_tint_style,
    headerBackTitleVisible: false,
    headerTransparent: true,
    cardStyle: {
        backgroundColor: `rgba(${colors.lightWhite_rgb},.9)`,
        marginTop: 90
    }
}
)

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    header_text: {
        fontSize: 25,
        position: 'relative',
        bottom: 5,
        color: colors.primary
    },
    underline: {
        position: 'absolute',
        backgroundColor: colors.primary,
        opacity: .5,
        height: 15,
        borderRadius: 20,
        bottom: 3,
        alignSelf: 'center',
        width: '120%'
    },
    header_style: {
        backgroundColor: `rgba(${colors.lightWhite_rgb},.9)`,
        borderBottomColor: colors.primary,
        borderBottomWidth: .1
    },
    header_tint_style: {
        fontWeight: 'bold',
        fontSize: 25,
        letterSpacing: 2,
        position: 'relative',
        bottom: 5
    },
    header_right: {
        marginRight: 10
    }
})