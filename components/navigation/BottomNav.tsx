import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../../utils/styles';
import { SvgXml } from 'react-native-svg';
import { profileSvg, searchSvg, invitationSvg, messageSvg } from '../../utils/svgs';
import { bottomTabInvitations, bottomTabChat, bottomTabsHome, bottomTabsProfile } from '../../utils/variables';
import { Icon } from '../../utils/components';

const BottomNav: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const focusedOptions = descriptors[state.routes[state.index].key].options;

    if (focusedOptions.tabBarVisible === false) {
        return null;
    }

    const renderSvgs = (name: string, isFocused: boolean) => {
        const widthHeight = '30';
        switch (name) {
            case bottomTabsHome:
                return (
                    <Icon type="search" size={24} color={colors.white} />
                )
            case bottomTabInvitations:
                return (
                    <SvgXml xml={invitationSvg} width={widthHeight} height={widthHeight} fill={isFocused ? colors.secondary : colors.primary} style={styles.svg} />
                )
            case bottomTabChat:
                return (
                    <SvgXml xml={messageSvg} width={widthHeight} height={widthHeight} fill={isFocused ? colors.secondary : colors.primary} style={styles.svg} />
                )
            case bottomTabsProfile:
                return (
                    <SvgXml xml={profileSvg} width={widthHeight} height={widthHeight} fill={isFocused ? colors.secondary : colors.primary} style={styles.svg} />
                )
            default:
                return (
                    <SvgXml xml={searchSvg} width={widthHeight} height={widthHeight} fill={isFocused ? colors.secondary : colors.primary} style={styles.svg} />
                )
        }
    }


    return (
        <View style={styles.container}>
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                // const onLongPress = () => {
                //     navigation.emit({
                //         type: 'tabLongPress',
                //         target: route.key,
                //     });
                // };

                var type: string;

                switch (route.name) {
                    case bottomTabsHome:
                        type = 'search'
                        break;
                    case bottomTabInvitations:
                        type = 'mail'
                        break;
                    case bottomTabChat:
                        type = 'inbox'
                        break;
                    case bottomTabsProfile:
                        type = 'user'
                        break;
                    default:
                        type = 'search'
                }

                return <Icon key={index} type={type} size={35} color={isFocused ? colors.secondary : colors.primary} pressColor={colors.tertiary} onPress={onPress} />
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexBasis: '10%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    svg: {
        alignSelf: 'center',
        position: "relative",
        bottom: 10
    },
    text_style: {
        color: colors.secondary
    },
    text_style_focused: {
        color: colors.primary
    }
})

export default BottomNav;