import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../../utils/styles';
import { SvgXml } from 'react-native-svg';
import { profileSvg, searchSvg, invitationSvg, messageSvg } from '../../utils/svgs';
import { bottomTabInvitations, bottomTabMessages, bottomTabsHome, bottomTabsProfile } from '../../utils/variables';

const Navigation: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const focusedOptions = descriptors[state.routes[state.index].key].options;

    if (focusedOptions.tabBarVisible === false) {
        return null;
    }

    const renderSvgs = (name: string, isFocused: boolean) => {
        const widthHeight = '30';
        switch (name) {
            case bottomTabsHome:
                return (
                    <SvgXml xml={searchSvg} width={widthHeight} height={widthHeight} fill={isFocused ? colors.secondary : colors.white} style={styles.svg} />
                )
            case bottomTabInvitations:
                return (
                    <SvgXml xml={invitationSvg} width={widthHeight} height={widthHeight} fill={isFocused ? colors.secondary : colors.white} style={styles.svg} />
                )
            case bottomTabMessages:
                return (
                    <SvgXml xml={messageSvg} width={widthHeight} height={widthHeight} fill={isFocused ? colors.secondary : colors.white} style={styles.svg} />
                )
            case bottomTabsProfile:
                return (
                    <SvgXml xml={profileSvg} width={widthHeight} height={widthHeight} fill={isFocused ? colors.secondary : colors.white} style={styles.svg} />
                )
            default:
                return (
                    <SvgXml xml={searchSvg} width={widthHeight} height={widthHeight} fill={isFocused ? colors.secondary : colors.white} style={styles.svg} />
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

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1 }}
                    >
                        {renderSvgs(route.name, isFocused)}
                    </TouchableOpacity>
                );
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
        backgroundColor: colors.primary,
        alignItems: 'center'
    },
    svg: {
        alignSelf: 'center',
        position: "relative",
        bottom: 10
    },
    text_style: {
        color: colors.white
    },
    text_style_focused: {
        color: colors.secondary
    }
})

export default Navigation;