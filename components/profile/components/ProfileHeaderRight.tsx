import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../../utils/styles';
import { Icon, CustomButton } from '../../../utils/components';


interface ProfileHeaderRightProps {
    handleUnfriendUser: () => Promise<void | undefined>;
    block_user: () => void;
}

export default ({ handleUnfriendUser, block_user }: ProfileHeaderRightProps) => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleShowMenu = () => setShowMenu(showMenu ? false : true)

    const handleUnlinkPress = () => {
        setLoading(true);

        handleUnfriendUser()
            .then(() => setLoading(false))
    }

    const handleBlockPress = () => {
        block_user()
    }

    if (showMenu) return (
        <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
            <CustomButton type='secondary' text='Unlink' size='small' moreStyles={{ marginRight: 5 }} onPress={handleUnlinkPress} indicatorColor={loading && colors.primary} />

            <CustomButton type='red_outline' text='block' size='small' moreStyles={{ marginRight: 5 }} onPress={handleBlockPress} />
            <Icon
                type='more-horizontal'
                size={24}
                color={colors.primary}
                pressColor={colors.secondary}
                onPress={handleShowMenu}
                style={{ marginRight: 10 }}
            />
        </View>
    )

    return <Icon
        type='more-vertical'
        size={24}
        color={colors.primary}
        pressColor={colors.secondary}
        onPress={handleShowMenu}
        style={{ marginRight: 10 }}
    />
}