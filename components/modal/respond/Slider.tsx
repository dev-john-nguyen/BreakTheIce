import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { BodyText } from '../../utils';
import { colors, drop_shadow_light } from '../../utils/styles';
import { InvitationStatusOptions } from '../../../services/invitations/types';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface InvitationButtonsProps {
    updateInvitationStatus: (status: InvitationStatusOptions) => void;
}

export default ({ updateInvitationStatus }: InvitationButtonsProps) => {
    const backgroundAdmin: Animated.Value = useRef(new Animated.Value(0)).current;
    const previewAdmin = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
            Animated.timing(backgroundAdmin, {
                toValue: 2,
                duration: 5000,
                useNativeDriver: false
            }),
        ).start()

        Animated.timing(previewAdmin, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false
        }).start(() => {
            previewAdmin.setValue(0)
        })
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


    const renderAnimation = () => {
        return (
            <Animated.View style={{
                width: previewAdmin.interpolate({
                    inputRange: [0, .6, .7, 1],
                    outputRange: [0, 13, 17, 0],
                }),
                backgroundColor: colors.green,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                left: 2
            }} />
        )
    }

    return (
        <View style={[drop_shadow_light, styles.container]}>
            {renderAnimation()}
            <Swipeable
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}
                onSwipeableRightOpen={handleDenied}
                onSwipeableLeftOpen={handleAccept}
                containerStyle={styles.swipe_container}
            >
                <View style={styles.content}>
                    <BodyText style={styles.text}>Respond</BodyText>
                </View>
            </Swipeable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '60%',
        borderRadius: 5,
        alignSelf: 'center'
    },
    swipe_container: {
        position: 'relative',
        flex: 1
    },
    content: {
        padding: 10,
        borderWidth: 1,
        alignItems: 'center',
        borderColor: colors.primary,
        backgroundColor: colors.white,
        borderRadius: 5,
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    text: {
        fontSize: 12,
        color: colors.primary,
    },
    leftAction: {
        flex: 1,
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
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
        backgroundColor: colors.red,
        borderRadius: 5
    },
})