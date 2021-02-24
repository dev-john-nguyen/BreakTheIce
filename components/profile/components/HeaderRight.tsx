import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, normalize, dropShadowListContainer } from '../../utils/styles';
import { Icon, CustomButton, CustomInput } from '../../utils';

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
            <View style={[styles.report_container, dropShadowListContainer]}>
                <Icon type='x' size={15} color={colors.black} pressColor={colors.lightGrey} onPress={() => setReportForm(false)} />
                <CustomInput
                    value={reason}
                    onChangeText={(txt) => setReason(txt)}
                    style={styles.report_input}
                    placeholder='Reason (a few words)'
                    maxLength={20}
                />
                <Icon type='send' size={20} color={colors.red} pressColor={colors.lightRed} onPress={handleOnReportSubmit} style={{ alignSelf: 'center' }} />
            </View>
        )
    }


    if (showMenu) return (
        <View style={[styles.menu_container, dropShadowListContainer]}>

            {
                friend && <CustomButton type='secondary' text='Unlink' size='small' moreStyles={{ marginRight: 5 }} onPress={handleUnlinkPress} indicatorColor={linkloading && colors.primary} />
            }
            <CustomButton type='red_outline' text={blocked ? 'unblock' : 'block'} size='small' moreStyles={{ marginRight: 5 }} onPress={handleBlockPress} indicatorColor={blockLoading && colors.white} />

            <CustomButton type='red' text={'report'} size='small' moreStyles={{ marginRight: 5 }} onPress={() => setReportForm(true)} />

            <Icon
                type='more-horizontal'
                size={24}
                color={colors.primary}
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

const styles = StyleSheet.create({
    menu_container: {
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        borderColor: colors.tertiary,
        borderWidth: 1,
        padding: 10,
        paddingLeft: 10,
        width: '100%',
        borderRadius: 10
    },
    report_container: {
        flexDirection: 'row',
        marginRight: 10,
        padding: 2,
        paddingRight: 5,
        paddingLeft: 5,
        backgroundColor: colors.white,
        borderColor: colors.tertiary,
        borderWidth: 1,
        borderRadius: 10
    },
    report_input: {
        fontSize: normalize(6),
        borderBottomColor: colors.red,
        borderBottomWidth: 2,
        borderRadius: 10,
        marginRight: 5,
        alignSelf: 'stretch'
    }
})

