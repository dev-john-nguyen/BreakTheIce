import React, { useEffect, useState, useRef } from 'react';
import { Animated } from 'react-native';
import { Icon } from '../../utils';
import { colors } from '../../utils/styles';
import { NearUsersDispatchActionProps } from '../../../services/near_users/types';



export default ({ refresh_near_users }: { refresh_near_users: NearUsersDispatchActionProps['refresh_near_users'] }) => {
    const [spin, setSpin] = useState(false)
    const spinAdmin = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (spin) {
            Animated.loop(Animated.timing(spinAdmin, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: false
            })).start()
        } else {
            spinAdmin.stopAnimation()
            spinAdmin.setValue(0)
        }
    }, [spin])

    const handleRefreshOnPress = async () => {
        setSpin(true)
        refresh_near_users()
            .then(() => {
                setSpin(false)
            })
    }

    return (
        <Animated.View style={
            {
                marginLeft: 20,
                transform: [{
                    rotate:
                        spinAdmin.interpolate({
                            inputRange: [0, .5, 1],
                            outputRange: ['0deg', '180deg', '360deg']
                        })
                }]
            }
        }>
            <Icon type='refresh-cw' size={30} color={colors.primary} pressColor={colors.secondary} onPress={handleRefreshOnPress} />
        </Animated.View>
    )
}