import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp } from "react-native"
import { BannerDispatchActionProps, BannerItemProps } from '../../../../../services/banner/tsTypes';
import { BodyText, Icon } from '../../..';
import { colors } from '../../../styles';

interface ItemProps {
    item: BannerItemProps;
    styles: StyleProp<any>
    remove_banner: BannerDispatchActionProps['remove_banner'];
}

export default ({ item, styles, remove_banner }: ItemProps) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const transYAdmin = useRef(new Animated.Value(0)).current;

    useEffect(() => {

        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false
            }),
            Animated.timing(fadeAnim, {
                delay: item.message.length > 10 ? 2000 : 1000,
                toValue: 0,
                duration: 2000,
                useNativeDriver: false
            })
        ]).start()

        Animated.sequence([
            Animated.timing(transYAdmin, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false
            }),
            Animated.timing(transYAdmin, {
                toValue: 2,
                delay: item.message.length > 10 ? 3000 : 2000,
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
                        inputRange: [0, .5, 1, 2],
                        outputRange: ['0%', '80%', '100%', '0%']
                    })
                }
            ]}
        >
            <Icon type='alert-circle' size={24} color={colors.white} />
            <BodyText style={styles.text}>{item.message}</BodyText>
        </Animated.View>
    )
}
