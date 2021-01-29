import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native'
import { BodyText } from '..';
import { colors } from '../styles';



export default ({ notification }: { notification: string }) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {

        if (notification.length > 0) {
            fadeAnim.setValue(1)

            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 5000,
                useNativeDriver: false
            }).start()
        }

    }, [notification])


    return (
        <Animated.View
            style={[
                styles.notification_container,
                { opacity: fadeAnim }
            ]}
        >
            <BodyText style={styles.notification_text}>{notification}</BodyText>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    notification_container: {
        position: 'absolute',
        top: 300,
        zIndex: 100,
        width: Math.round(Dimensions.get('window').width),
        backgroundColor: colors.secondary,
        padding: 20
    },
    notification_text: {
        fontSize: 14,
        color: colors.white,
        textAlign: 'center'
    }
});