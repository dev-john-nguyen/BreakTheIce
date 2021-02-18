import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, Switch, StyleSheet } from 'react-native';
import { UpdateUserPrivacyProps, UserRootStateProps, UserDispatchActionsProps } from '../../../services/user/types';
import { BannerDispatchActionProps } from '../../../services/banner/tsTypes';
import { MeStackNavigationProp } from '../../navigation';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../utils/styles';
import { isEqual } from 'lodash';
import { HeaderText } from '../../utils';

interface PrivacyProps {
    user: UserRootStateProps;
    update_privacy: UserDispatchActionsProps['update_privacy'];
    set_banner: BannerDispatchActionProps['set_banner'];
    navigation: MeStackNavigationProp
}

const Privacy = ({ user, set_banner, navigation, update_privacy }: PrivacyProps) => {
    const { hideOnMap, offline } = user;
    const privacyVals = {
        hideOnMap,
        offline
    }

    // useEffect(() => {
    //     var mount = true;
    //     navigation.setOptions({
    //         headerRight: () => {
    //             if (loading) {
    //                 return <ActivityIndicator size='small' color={colors.primary} style={{ marginRight: 20 }} />
    //             } else {
    //                 return (
    //                     <Pressable onPress={() => handleSave(mount)} style={{ marginRight: 15 }}>
    //                         {({ pressed }) => <Feather name='save' size={30} color={pressed ? colors.secondary : colors.primary} />}
    //                     </Pressable >
    //                 )
    //             }
    //         }
    //     })

    //     return () => {
    //         mount = false
    //         navigation.setOptions({ headerRight: undefined })
    //     }
    // }, [loading, privacyVals, user])


    const handleSave = (privacy: UpdateUserPrivacyProps) => {

        const { name, statusMsg, bioLong, age, gender } = user;

        var oldVals = { name, statusMsg, bioLong, age, gender }

        if (isEqual(oldVals, privacy)) {
            set_banner('No updates found.', 'warning')
            return
        }

        update_privacy(privacy)
            .catch((err) => {
                console.log(err)
                set_banner('Oops! Something went wrong updating your profile.', 'error')
            })
    }


    return (
        <View style={styles.container}>
            <View style={styles.content_container}>
                <Text style={styles.content_text}>{privacyVals.hideOnMap ? 'Show On Map' : 'Hide On Map'}</Text>
                <Switch
                    trackColor={{ false: colors.lightRed, true: colors.tertiary }}
                    thumbColor={privacyVals.hideOnMap ? colors.primary : colors.red}
                    ios_backgroundColor={colors.lightRed}
                    onValueChange={(value) => handleSave({ ...privacyVals, hideOnMap: value })}
                    value={privacyVals.hideOnMap}
                />
            </View>

            <View style={styles.content_container}>
                <Text style={styles.content_text}>{privacyVals.offline ? 'Go Online' : 'Go Offline'}</Text>
                <Switch
                    trackColor={{ false: colors.lightRed, true: colors.tertiary }}
                    thumbColor={privacyVals.offline ? colors.primary : colors.red}
                    ios_backgroundColor={colors.lightRed}
                    onValueChange={(value) => handleSave({ ...privacyVals, offline: value })}
                    value={privacyVals.offline}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        margin: 20
    },
    content_container: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center'
    },
    content_text: {
        fontSize: 12,
        color: colors.black,
        marginRight: 10
    }

})

export default Privacy;