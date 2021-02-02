import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { update_profile, update_privacy, sign_out, remove_account } from '../../services/user/actions';
import { colors } from '../utils/styles';
import { MeStackNavigationProp } from '../navigation/utils/types';
import EditProfile from './components/editprofile';
import Privacy from './components/Privacy';
import { RootProps } from '../../services';
import { UserRootStateProps, UserDispatchActionsProps } from '../../services/user/types';
import { set_banner } from '../../services/banner/actions';
import { BannerDispatchActionProps } from '../../services/banner/tsTypes';
import EditGallery from './components/EditGallery';
import * as ImagePicker from 'expo-image-picker';
import { BodyText, CustomButton, HeaderText, UnderlineHeader } from '../utils';
import RemoveAccount from './components/RemoveAccount';
import PrivatePolicy from './components/PrivatePolicy';

interface SettingsProps {
    navigation: MeStackNavigationProp;
    user: UserRootStateProps;
    update_profile: UserDispatchActionsProps['update_profile'];
    update_privacy: UserDispatchActionsProps['update_privacy'];
    set_banner: BannerDispatchActionProps['set_banner'];
    sign_out: UserDispatchActionsProps['sign_out'];
    remove_account: UserDispatchActionsProps['remove_account'];
}

enum TargetOptions {
    profile = 'Edit Profile',
    privacy = 'Privacy',
    privatePolicy = "Private Policy",
    contacts = "Manage Contacts",
    gallery = "Edit Gallery",
    removeAccount = "Remove Account"
}

const Settings = ({ navigation, user, update_profile, set_banner, update_privacy, sign_out, remove_account }: SettingsProps) => {
    const [target, setTarget] = useState<TargetOptions>(TargetOptions.profile)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <UnderlineHeader
                    textStyle={{ color: colors.primary, fontSize: 20 }}
                    style={styles.header}>{target}</UnderlineHeader>
            )
        })
    }, [target])

    const renderTargetComponent = () => {
        switch (target) {
            case TargetOptions.privacy:
                return <Privacy user={user} set_banner={set_banner} navigation={navigation} update_privacy={update_privacy} />
            case TargetOptions.gallery:
                return <EditGallery navigation={navigation} handleCameraRollPermission={handleCameraRollPermission} />
            case TargetOptions.removeAccount:
                return <RemoveAccount remove_account={remove_account} />
            case TargetOptions.privatePolicy:
                return <PrivatePolicy />
            case TargetOptions.profile:
            default:
                return <EditProfile user={user} set_banner={set_banner} navigation={navigation} update_profile={update_profile} handleCameraRollPermission={handleCameraRollPermission} />
        }
    }

    const handleCameraRollPermission = async (): Promise<boolean> => {
        try {
            const { status: CameraRollStatus } = await ImagePicker.requestCameraRollPermissionsAsync();

            if (CameraRollStatus !== 'granted') {
                set_banner('Camera roll access denied', 'warning')
                return false;
            }

            return true;
        } catch (e) {
            set_banner('Oops! Something went wrong accessing your camera roll.', 'error')
            return false;
        }
    }

    const handleSignOut = () => sign_out()

    return (
        <View style={styles.container}>
            <View style={styles.container_content}>

                <View style={styles.options_content}>

                    {/* <TouchableHighlight
                        style={[styles.item_container, target === TargetOptions.profile && styles.active]}
                        onPress={() => set_banner('fdsafadsf ', 'error')}
                        underlayColor={colors.tertiary}
                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text, target === TargetOptions.profile && styles.active_text]}>Error</BodyText>
                        </View>
                    </TouchableHighlight> */}


                    <TouchableHighlight
                        style={[styles.item_container, target === TargetOptions.profile && styles.active]}
                        onPress={() => setTarget(TargetOptions.profile)}
                        underlayColor={colors.tertiary}
                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text, target === TargetOptions.profile && styles.active_text]}>Edit Profile</BodyText>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={[styles.item_container, target === TargetOptions.privacy && styles.active]}
                        onPress={() => setTarget(TargetOptions.privacy)}
                        underlayColor={colors.tertiary}
                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text, target === TargetOptions.privacy && styles.active_text]}>Privacy</BodyText>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={[styles.item_container, target === TargetOptions.gallery && styles.active]}
                        onPress={() => setTarget(TargetOptions.gallery)}
                        underlayColor={colors.tertiary}
                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text, target === TargetOptions.gallery && styles.active_text]}>Edit Gallery</BodyText>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={[styles.item_container, target === TargetOptions.privatePolicy && styles.active]}
                        onPress={() => setTarget(TargetOptions.privatePolicy)}
                        underlayColor={colors.tertiary}
                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text, target === TargetOptions.privatePolicy && styles.active_text]}>Private Policy</BodyText>
                        </View>
                    </TouchableHighlight>


                    <TouchableHighlight
                        style={[styles.item_container, target === TargetOptions.removeAccount && styles.active]}
                        onPress={() => setTarget(TargetOptions.removeAccount)}
                        underlayColor={colors.tertiary}
                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text, target === TargetOptions.removeAccount && styles.active_text]}>Remove Account</BodyText>
                        </View>
                    </TouchableHighlight>


                </View>

                <View style={{ margin: 10, alignSelf: 'flex-end', marginBottom: 25 }}>
                    <CustomButton text="Sign Out" type='secondary' onPress={handleSignOut} />
                </View>
            </View>
            <KeyboardAvoidingView keyboardVerticalOffset={110} behavior={'padding'} style={{ flex: 1, paddingTop: 20 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {renderTargetComponent()}
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderTopColor: colors.primary,
        borderTopWidth: 1
    },
    header: {
        alignSelf: 'center'
    },
    container_content: {
        justifyContent: 'space-between',
        borderRightColor: colors.primary,
        borderRightWidth: 1,
        paddingTop: 20
    },
    options_content: {
        alignItems: 'stretch',
    },
    active: {
        backgroundColor: colors.secondary
    },
    active_text: {
        fontSize: 12,
        color: colors.white
    },
    item_container: {
        borderBottomColor: colors.primary,
        borderBottomWidth: 1,
        borderTopColor: colors.primary,
        borderTopWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
        position: 'relative',
        alignItems: 'center',
        marginBottom: 20
    },
    content: {
        alignItems: 'center'
    },
    text: {
        fontSize: 12,
        color: colors.primary
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user,
})

export default connect(mapStateToProps, { update_profile, set_banner, update_privacy, sign_out, remove_account })(Settings);