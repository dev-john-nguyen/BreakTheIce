import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, Switch, StyleSheet } from 'react-native';
import { UpdateUserPrivacyProps, UserRootStateProps, UserDispatchActionsProps } from '../../../services/user/user.types';
import { UtilsDispatchActionProps } from '../../../services/utils/tsTypes';
import { MeStackNavigationProp } from '../../navigation/utils';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../utils/styles';
import { isEqual } from 'lodash';

interface PrivacyProps {
    user: UserRootStateProps;
    update_privacy: UserDispatchActionsProps['update_privacy'];
    set_banner: UtilsDispatchActionProps['set_banner'];
    navigation: MeStackNavigationProp
}

const Privacy = ({ user, set_banner, navigation, update_privacy }: PrivacyProps) => {
    const { hideOnMap, offline } = user;
    const [privacyVals, setPrivacyVals] = useState<UpdateUserPrivacyProps>({
        hideOnMap,
        offline
    })
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        var mount = true;
        navigation.setOptions({
            headerRight: () => {
                if (loading) {
                    return <ActivityIndicator size='small' color={colors.white} style={{ marginRight: 20 }} />
                } else {
                    return (
                        <Pressable onPress={() => handleSave(mount)} style={{ marginRight: 20 }}>
                            {({ pressed }) => <Feather name='save' size={30} color={pressed ? colors.secondary : colors.white} />}
                        </Pressable >
                    )
                }
            }
        })

        return () => { mount = false }
    }, [loading])


    const handleSave = async (mount: boolean) => {
        mount && setLoading(true)

        const { name, bioShort, bioLong, age, gender } = user;

        var oldVals = { name, bioShort, bioLong, age, gender }

        if (isEqual(oldVals, privacyVals)) {
            if (mount) {
                set_banner('No updates found.', 'warning')
                setLoading(false)
            }
            return
        }

        update_privacy(privacyVals)
            .then(() => {
                mount && setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                mount && set_banner('Oops! Something went wrong updating your profile.', 'error')
            })
    }


    return (
        <View style={styles.container}>
            <View style={styles.content_container}>
                <Text style={styles.content_text}>{privacyVals.hideOnMap ? 'Show On Map' : 'Hide On Map'}</Text>
                <Switch
                    trackColor={{ false: colors.secondary, true: colors.lightRed }}
                    thumbColor={privacyVals.hideOnMap ? colors.red : colors.primary}
                    ios_backgroundColor={colors.secondary}
                    onValueChange={(value) => setPrivacyVals({ ...privacyVals, hideOnMap: value })}
                    value={privacyVals.hideOnMap}
                />
            </View>

            <View style={styles.content_container}>
                <Text style={styles.content_text}>{privacyVals.offline ? 'Go Online' : 'Go Offline'}</Text>
                <Switch
                    trackColor={{ false: colors.secondary, true: colors.lightRed }}
                    thumbColor={privacyVals.offline ? colors.red : colors.primary}
                    ios_backgroundColor={colors.secondary}
                    onValueChange={(value) => setPrivacyVals({ ...privacyVals, offline: value })}
                    value={privacyVals.offline}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20
    },
    content_container: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center'
    },
    content_text: {
        fontSize: 12,
        color: colors.primary,
        marginRight: 10
    }

})

export default Privacy;