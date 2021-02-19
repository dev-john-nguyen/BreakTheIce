import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { colors, normalize } from '../../utils/styles';
import { Icon, CustomButton, CustomInput } from '../../utils';
import { NearUsersDispatchActionProps } from '../../../services/near_users/types';

interface ProfileHeaderRightProps {
    handleReportUser: (reason: string) => Promise<void>;
    handleUnfriendUser: () => Promise<void | undefined>;
    handleBlockUser: () => Promise<void | undefined>;
    blocked: boolean;
    friend: boolean;
}

export default ({ handleUnfriendUser, handleBlockUser, handleReportUser, blocked, friend }: ProfileHeaderRightProps) => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [linkloading, setLinkLoading] = useState<boolean>(false);
    const [blockLoading, setBlockLoading] = useState<boolean>(false);
    const [reportForm, setReportForm] = useState<boolean>(false)
    const [reason, setReason] = useState('');
    const mount = useRef<boolean>();

    useEffect(() => {
        mount.current = true

        return () => {
            mount.current = false
        }
    }, [])

    const handleShowMenu = () => setShowMenu(showMenu ? false : true)

    const handleUnlinkPress = () => {
        setLinkLoading(true);
        handleUnfriendUser()
            .then(() => mount && setLinkLoading(false))
    }

    const handleBlockPress = () => {
        setBlockLoading(true);
        handleBlockUser()
            .then(() => mount && setBlockLoading(false))
    }

    const handleOnReportSubmit = () => {
        handleReportUser(reason)
            .then(() => {
                if (mount) {
                    setBlockLoading(false)
                    setReportForm(false)
                    setReason('')
                }
            })
    }

    if (reportForm) {
        return (
            <View style={{ margin: 10, flexDirection: 'column', alignItems: 'stretch' }}>
                <CustomInput
                    value={reason}
                    onChangeText={(txt) => setReason(txt)}
                    style={{
                        fontSize: normalize(8),
                        backgroundColor: colors.white,
                        borderRadius: 10,
                        alignSelf: 'stretch'
                    }}
                    placeholder='Reason (one word)'
                    maxLength={20}
                />
                <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <CustomButton type='red' text={'report'} size='small' moreStyles={{ marginLeft: 5 }} onPress={handleOnReportSubmit} />

                    <CustomButton type='primary' text={'cancel'} size='small' moreStyles={{ marginLeft: 5 }} onPress={() => setReportForm(false)} />
                </View>
            </View>
        )
    }


    if (showMenu) return (
        <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>

            {
                friend && <CustomButton type='white' text='Unlink' size='small' moreStyles={{ marginRight: 5 }} onPress={handleUnlinkPress} indicatorColor={linkloading && colors.primary} />
            }
            <CustomButton type='red_outline' text={blocked ? 'unblock' : 'block'} size='small' moreStyles={{ marginRight: 5 }} onPress={handleBlockPress} indicatorColor={blockLoading && colors.white} />

            <CustomButton type='red' text={'report'} size='small' moreStyles={{ marginRight: 5 }} onPress={() => setReportForm(true)} />

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