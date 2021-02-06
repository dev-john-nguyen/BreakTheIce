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

        Animated.timing(fadeAnim, {
            delay: item.message.length > 10 ? 5000 : 2000,
            toValue: 0,
            duration: 2000,
            useNativeDriver: false
        }).start()

        Animated.sequence([
            Animated.timing(transYAdmin, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false
            }),
            Animated.timing(transYAdmin, {
                toValue: 2,
                delay: item.message.length > 10 ? 5000 : 2000,
                duration: 1000,
                useNativeDriver: false
            })
        ]).start(() => {
            remove_banner(item.id)
        })

    }, [])

    return (
        <Animated.View
            style={[
                styles.container,
                { opacity: fadeAnim },
                {
                    width: transYAdmin.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: ['0%', '100%', '0%']
                    })
                }
            ]}
        >
            <BodyText style={styles.text} numberOfLines={1} >{item.message}</BodyText>
        </Animated.View>
    )
}
