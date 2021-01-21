import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../../utils/styles';
import { bottomTabInvitations, bottomTabChat, bottomTabsHome, bottomTabsProfile } from '../../utils/variables';
import { FontAwesome } from '@expo/vector-icons';

const BottomNav: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const focusedOptions = descriptors[state.routes[state.index].key].options;

    if (focusedOptions.tabBarVisible === false) {
        return null;
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
                var size = 32;
                switch (route.name) {
                    case bottomTabsHome:
                        type = 'search'
                        size = 29
                        break;
                    case bottomTabInvitations:
                        type = 'envelope'
                        size = 29
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

                return <FontAwesome key={index} name={type} size={size} color={isFocused ? colors.tertiary : colors.primary} pressColor={colors.secondary} onPress={onPress} />
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