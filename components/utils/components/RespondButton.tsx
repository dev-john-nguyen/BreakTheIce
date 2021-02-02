import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, StyleProp, Animated } from 'react-native';
import { BodyText, Icon } from '..';
import { colors, drop_shadow, drop_shadow_light } from '../styles';
import { InvitationStatusOptions } from '../../../services/invitations/types';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface InvitationButtonsProps {
    handleInvitationUpdate: (status: InvitationStatusOptions) => Promise<void>;
    setLoading: (value: boolean) => void;
    loading: boolean;
    style?: StyleProp<any>
}

export default ({ handleInvitationUpdate, loading, setLoading, style }: InvitationButtonsProps) => {
    const backgroundRef: Animated.Value = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(backgroundRef, {
                toValue: 2,
                duration: 5000,
                useNativeDriver: false
            }),
        ).start()
    }, [])

    const handleUpdateStatus = (status: InvitationStatusOptions) => {
        if (loading) return;
        setLoading(true)
        handleInvitationUpdate(status)
            .then(() => setLoading(false))
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    const handleDenied = () => handleUpdateStatus(InvitationStatusOptions.denied)

    const handleAccept = () => handleUpdateStatus(InvitationStatusOptions.accepted)

    const renderRightActions = (progress: Animated.AnimatedInterpolation) => {
        // const trans = progress.interpolate({
        //     inputRange: [0, .4, .5, 1],
        //     outputRange: [0, -10, -50, -110],
        // });

        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
        });

        return (
            <View style={styles.rightAction}>
                <Animated.Text style={[
                    styles.actionText,
                    {
                        transform: [{ translateX: trans }]
                    }
                ]}>
                    Deny
                    </Animated.Text>
            </View>
        )
    }

    const renderLeftActions = (progress: Animated.AnimatedInterpolation) => {
        // const trans = progress.interpolate({
        //     inputRange: [0, .4, .5, 1],
        //     outputRange: [0, 10, 50, 100],
        // });

        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, 0],
        });

        return (
            <View style={styles.leftAction}>
                <Animated.Text style={[
                    styles.actionText,
                    {
                        transform: [{ translateX: trans }]
                    }
                ]}>
                    Accept
                    </Animated.Text>
            </View>
        )
    }

    return (
        <View style={[drop_shadow_light, styles.container]}>
            <Swipeable
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}
                onSwipeableRightOpen={handleDenied}
                onSwipeableLeftOpen={handleAccept}
                containerStyle={styles.swipe_container}
            >
                <Animated.View style={[
                    {
                        backgroundColor: backgroundRef.interpolate({
                            inputRange: [0, .5, 1, 1.5, 2],
                            outputRange: [
                                colors.secondary,
                                colors.secondaryMedium,
                                colors.tertiary,
                                colors.secondaryMedium,
                                colors.secondary
                            ],
                        })
                    }]}>
                    <View style={styles.content}>
                        <Icon type='arrow-right-circle' size={24} color={colors.green} pressColor={colors.green} />
                        <BodyText style={styles.text}>Respond</BodyText>
                        <Icon type='arrow-left-circle' size={24} color={colors.red} pressColor={colors.red} />
                    </View>
                </Animated.View>
            </Swipeable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
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
        borderRadius: 5,
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 12,
        color: colors.lightWhite
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