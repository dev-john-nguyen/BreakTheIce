import React from 'react';
import { StyleSheet } from 'react-native';
import { HomeScreenRouteProp, InvitationsScreenRouteProp, ChatScreenRouteProp, MeScreenRouteProp } from './utils/types';
import { Icon, UnderlineHeader } from '../utils';
import { colors } from '../utils/styles';

interface RouteProps {
    props: HomeScreenRouteProp | InvitationsScreenRouteProp | ChatScreenRouteProp | MeScreenRouteProp
}

const renderHeaderRight = (route: RouteProps['props'], navigation: any) => {
    switch (route.name) {
        case 'Home':
            const navigateList = () => navigation.navigate('NearByList')

            return <Icon type='list' size={30} color={colors.primary} pressColor={colors.secondary} onPress={navigateList} style={styles.header_right} />
        case 'Me':
            const navigateSettings = () => navigation.navigate('Settings')

            return <Icon type='settings' size={30} color={colors.white} pressColor={colors.tertiary} onPress={navigateSettings} style={styles.header_right} />

        default:
            return undefined
    }
}

export const screenOptions = ({ route, navigation }: { navigation: any, route: RouteProps['props'] }) => ({
    headerTitle: () => {
        if (route.params?.title) {
            return (
                <UnderlineHeader
                    style={styles.underline_style}
                    underlineStyle={styles.underline_header_underline}
                    textStyle={styles.underline_header_text}
                >{route.params.title}</UnderlineHeader>
            )
        }
    },
    headerRight: () => renderHeaderRight(route, navigation),
    headerStyle: styles.header_style,
    headerTintColor: colors.primary,
    headerTitleStyle: styles.header_tint_style,
    headerBackTitleVisible: false,
    headerTransparent: true,
    cardStyle: {
        backgroundColor: colors.white,
        paddingTop: 90
    }
}
)

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    underline_style: {
        top: 5,
    },
    underline_header_underline: {
        backgroundColor: `rgba(${colors.primary_rgb},.8)`,
    },
    underline_header_text: {
        color: colors.white,
        fontSize: 27,
        textTransform: 'lowercase'
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