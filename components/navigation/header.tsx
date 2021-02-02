import React from 'react';
import { StyleSheet, StyleProp } from 'react-native';
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
            var textStyle: StyleProp<any> = {
                color: colors.white,
                textTransform: 'lowercase'
            };

            if (route.params.title.length > 10) {
                textStyle.fontSize = 24
            } else {
                textStyle.fontSize = 27
            }


            return (
                <UnderlineHeader
                    textStyle={textStyle}
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
    underline_header_underline: {
        backgroundColor: colors.tertiary
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