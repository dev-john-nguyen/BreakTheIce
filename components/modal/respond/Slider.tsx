import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { BodyText, Icon } from '../../utils';
import { colors, dropShadowLight, normalize } from '../../utils/styles';
import { InvitationStatusOptions } from '../../../services/invitations/types';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface InvitationButtonsProps {
    updateInvitationStatus: (status: InvitationStatusOptions) => void;
}

export default ({ updateInvitationStatus }: InvitationButtonsProps) => {
    const backgroundAdmin: Animated.Value = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(backgroundAdmin, {
                toValue: 2,
                duration: 5000,
                useNativeDriver: false
            }),
        ).start()
    }, [])

    const handleDenied = () => updateInvitationStatus(InvitationStatusOptions.denied)

    const handleAccept = () => updateInvitationStatus(InvitationStatusOptions.accepted)

    const renderRightActions = (progress: Animated.AnimatedInterpolation) => (
        <Animated.View style={[styles.rightAction,
        {
            backgroundColor: backgroundAdmin.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [
                    colors.red,
                    colors.darkRed,
                    colors.red
                ],
            }),
        }
        ]}
        />
    )


    const renderLeftActions = (progress: Animated.AnimatedInterpolation) => (
        <Animated.View style={[styles.leftAction,
        {
            backgroundColor: backgroundAdmin.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [
                    colors.darkGreen,
                    colors.green,
                    colors.darkGreen
                ],
            }),
        }
        ]} />
    )


    return (
        <Pressable style={[dropShadowLight, styles.container]}>
            <Swipeable
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}
                onSwipeableRightOpen={handleDenied}
                onSwipeableLeftOpen={handleAccept}
                containerStyle={styles.swipe_container}
            >
                <View style={styles.content}>
                    <Animated.View style={{
                        width: '20%', height: 40, backgroundColor: backgroundAdmin.interpolate({
                            inputRange: [0, 1, 2],
                            outputRange: [
                                colors.darkGreen,
                                colors.green,
                                colors.darkGreen
                            ],
                        }), alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Icon
                            type='chevrons-right'
                            size={20}
                            color={colors.white}
                            pressColor={colors.lightWhite}
                        />
                    </Animated.View>

                    <BodyText style={{ alignSelf: 'center', marginRight: 30, color: colors.black, fontSize: normalize(9) }}>Slide To Accept</BodyText>
                </View>
            </Swipeable>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flexDirection: 'row',
        width: '60%',
        alignSelf: 'center'
    },
    swipe_container: {
        position: 'relative',
        flex: 1,
        borderRadius: 10
    },
    content: {
        backgroundColor: colors.white,
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 12,
        color: colors.primary,
    },
    leftAction: {
        flex: 1,
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionText: {
        color: colors.white,
        fontSize: 12,
        backgroundColor: 'transparent',
        textAlign: 'center'
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.red
    },
})