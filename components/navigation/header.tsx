import React from 'react';
import { StyleSheet, StyleProp } from 'react-native';
import { HomeScreenRouteProp, InvitationsScreenRouteProp, ChatScreenRouteProp, MeScreenRouteProp } from '.';
import { Icon, HeaderText, UnderlineHeader } from '../utils';
import { colors, normalize } from '../utils/styles';
import { windowHeight } from '../../utils/variables';

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
                textTransform: 'lowercase',
                fontSize: normalize(20),
                letterSpacing: 2
            };

            return (
                <UnderlineHeader
                    textStyle={textStyle}
                    height={12}
                    colorFrom={colors.tertiary}
                    colorTo={colors.primary}
                >{route.params.title}</UnderlineHeader>
            )
        }

        return <HeaderText style={styles.header_text}>{route.name == 'NearByList' ? 'List' : route.name}</HeaderText>
    },
    headerForceInset: { top: 'never', bottom: 'never' },
    headerRight: () => renderHeaderRight(route, navigation),
    headerTintColor: colors.primary,
    headerBackTitleVisible: false,
    headerTransparent: true,
    cardStyle: {
        backgroundColor: colors.backgroundColor,
        paddingTop: (windowHeight / 10)
    }
}
)

function cardPaddingTop() {
    windowHeight
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    header_text: {
        fontSize: normalize(14),
        color: colors.primary
    },
    underline_header_underline: {
        backgroundColor: colors.tertiary
    },
    header_right: {
        marginRight: 10
    }
})