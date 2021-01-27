import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp } from "react-native"
import { UtilsDispatchActionProps, BannerItemProps } from '../../../../services/utils/tsTypes';
import { BodyText } from '../..';

interface ItemProps {
    item: BannerItemProps;
    styles: StyleProp<any>
    remove_banner: UtilsDispatchActionProps['remove_banner'];
    index: number
}

export default ({ item, styles, remove_banner, index }: ItemProps) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        Animated.timing(fadeAnim, {
            delay: 1000,
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
                { opacity: fadeAnim }
            ]}
        >
            <BodyText styles={styles.text} text={item.message} />
        </Animated.View>
    )
}
