import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { colors } from '../../utils/styles';
import { Icon, CustomButton } from '../../utils';

interface ProfileHeaderRightProps {
    handleUnfriendUser: () => Promise<void | undefined>;
    handleBlockUser: () => Promise<void | undefined>;
    blocked: boolean;
    friend: boolean;
}

export default ({ handleUnfriendUser, handleBlockUser, blocked, friend }: ProfileHeaderRightProps) => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const mount = useRef<boolean>();

    useEffect(() => {
        mount.current = true

        return () => {
            mount.current = false
        }
    }, [])

    const handleShowMenu = () => setShowMenu(showMenu ? false : true)

    const handleUnlinkPress = () => {
        setLoading(true);
        handleUnfriendUser()
            .then(() => mount && setLoading(false))
    }

    const handleBlockPress = () => {
        setLoading(true);
        handleBlockUser()
            .then(() => mount && setLoading(false))
    }

    if (showMenu) return (
        <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
            <CustomButton type='red' text={blocked ? 'unblock' : 'block'} size='small' moreStyles={{ marginRight: 5 }} onPress={handleBlockPress} indicatorColor={loading && colors.white} />

            {
                friend && <CustomButton type='white' text='Unlink' size='small' moreStyles={{ marginRight: 5 }} onPress={handleUnlinkPress} indicatorColor={loading && colors.primary} />
            }
            <Icon
                type='more-horizontal'
                size={24}
                color={colors.white}
                pressColor={colors.tertiary}
                onPress={handleShowMenu}
                style={{ marginRight: 10 }}
            />

        </View>
    )

    return <Icon
        type='more-vertical'
        size={24}
        color={colors.white}
        pressColor={colors.tertiary}
        onPress={handleShowMenu}
        style={{ marginRight: 10 }}
    />
}