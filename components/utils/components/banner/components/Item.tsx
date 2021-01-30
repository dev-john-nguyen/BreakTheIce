import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp } from "react-native"
import { BannerDispatchActionProps, BannerItemProps } from '../../../../../services/banner/tsTypes';
import { BodyText } from '../../..';

interface ItemProps {
    item: BannerItemProps;
    styles: StyleProp<any>
    remove_banner: BannerDispatchActionProps['remove_banner'];
}

export default ({ item, styles, remove_banner }: ItemProps) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const transYAdmin = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(transYAdmin, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start()

        Animated.timing(fadeAnim, {
            delay: item.message.length > 10 ? 5000 : 2000,
            toValue: 0,
            duration: 2000,
            useNativeDriver: true
        }).start(() => {
            remove_banner(item.id)
        })
    }, [])

    return (
        <Animated.View
            style={[
                styles.container,
                { opacity: fadeAnim },
                {
                    transform: [{
                        translateY: transYAdmin.interpolate({
                            inputRange: [0, 1],
                            outputRange: [100, -20]
                        })
                    }]
                }
            ]}
        >
            <BodyText style={styles.text}>{item.message}</BodyText>
        </Animated.View>
    )
}
