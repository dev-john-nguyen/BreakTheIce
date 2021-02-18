import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, normalize } from '../utils/styles';
import { bottomTabInvitations, bottomTabChat, bottomTabsHome, bottomTabsProfile } from '../../utils/variables';
import { Feather } from '@expo/vector-icons';
import { RootProps } from '../../services';
import { InvitationsRootProps, InvitationStatusOptions } from '../../services/invitations/types';
import { ChatRootProps } from '../../services/chat/types';
import { BodyText } from '../utils';


interface BottomNavProps {
    invitations: InvitationsRootProps['inbound'];
    chat: ChatRootProps['previews'];
    uid: string;
}

const BottomNav: React.FC<BottomTabBarProps & BottomNavProps> = ({ state, descriptors, navigation, invitations, chat, uid }) => {
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

                var type: any;
                var notificationNum = 0;

                switch (route.name) {
                    case bottomTabsHome:
                        type = 'search'
                        break;
                    case bottomTabInvitations:
                        type = 'mail'
                        if (invitations.length > 0) {
                            invitations.forEach((invitations) => {
                                if (invitations.status === InvitationStatusOptions.pending
                                    &&
                                    invitations.sentTo.uid === uid
                                ) {
                                    notificationNum++
                                }
                            })
                        }

                        break;
                    case bottomTabChat:
                        type = 'inbox'

                        if (chat.length > 0) {
                            chat.forEach((chat) => {
                                if (chat.unread && chat.recentUid !== uid) {
                                    notificationNum++
                                }
                            })
                        }

                        break;
                    case bottomTabsProfile:
                        type = 'user'
                        break;
                    default:
                        type = 'search'
                }

                return (
                    <Pressable key={index} onPress={onPress} style={styles.item} hitSlop={10}>
                        {({ pressed }) => (
                            <View>
                                <View style={[styles.icon_container, { backgroundColor: isFocused ? colors.secondary : pressed ? colors.tertiary : colors.primary }]}>
                                    <Feather name={type} size={25} color={colors.white} />
                                </View>

                                {notificationNum > 0 &&
                                    <View style={styles.notification_container}>
                                        <BodyText style={styles.notification_text}>{notificationNum.toString()}</BodyText>
                                    </View>
                                }
                            </View>
                        )}
                    </Pressable>
                )
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 15,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: 'transparent',
        alignSelf: 'stretch'
    },
    background: {
        position: 'absolute',
        top: -15,
        left: 0,
        width: '100%'
    },
    item: {
        position: "relative",
        marginBottom: 10
    },
    notification_container: {
        position: 'absolute',
        right: 10,
        top: 10
    },
    notification_text: {
        fontSize: normalize(8),
        color: colors.white
    },
    icon_container: {
        borderRadius: 50,
        padding: 15
    }
})

const mapStateToProps = (state: RootProps) => ({
    invitations: state.invitations.inbound,
    chat: state.chat.previews,
    uid: state.user.uid
})

export default connect(mapStateToProps, {})(BottomNav);