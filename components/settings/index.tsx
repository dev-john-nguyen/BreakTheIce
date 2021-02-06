import React, { useState, useLayoutEffect, useRef } from 'react';
import { View, StyleSheet, TouchableHighlight, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Pressable, Easing, Animated } from 'react-native';
import { connect } from 'react-redux';
import { update_profile, update_privacy, sign_out, remove_account } from '../../services/user/actions';
import { colors } from '../utils/styles';
import { MeStackNavigationProp } from '../navigation/utils/types';
import EditProfile from './components/profile';
import Privacy from './components/Privacy';
import { RootProps } from '../../services';
import { UserRootStateProps, UserDispatchActionsProps } from '../../services/user/types';
import { set_banner } from '../../services/banner/actions';
import { BannerDispatchActionProps } from '../../services/banner/tsTypes';
import EditGallery from './components/EditGallery';
import * as ImagePicker from 'expo-image-picker';
import { BodyText, HeaderText, Icon } from '../utils';
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
    const [target, setTarget] = useState<TargetOptions>(TargetOptions.profile);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <HeaderText
                    style={styles.header}>{target}</HeaderText>
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
            <Animated.View style={styles.menu_container}>
                <View style={styles.menu_options}>
                    <TouchableHighlight
                        style={[styles.menu_items, target === TargetOptions.profile && styles.active]}
                        onPress={() => set_banner('fdsafadsf ', 'error')}
                        underlayColor={colors.tertiary}
                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text, target === TargetOptions.profile && styles.active_text]}>Error</BodyText>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={[styles.menu_items, target === TargetOptions.profile && styles.active]}
                        onPress={() => setTarget(TargetOptions.profile)}
                        underlayColor={colors.tertiary}
                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text, target === TargetOptions.profile && styles.active_text]}>Profile</BodyText>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={[styles.menu_items, target === TargetOptions.gallery && styles.active]}
                        onPress={() => setTarget(TargetOptions.gallery)}
                        underlayColor={colors.tertiary}
                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text, target === TargetOptions.gallery && styles.active_text]}>Gallery</BodyText>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={[styles.menu_items, target === TargetOptions.privacy && styles.active]}
                        onPress={() => setTarget(TargetOptions.privacy)}
                        underlayColor={colors.tertiary}
                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text, target === TargetOptions.privacy && styles.active_text]}>Privacy</BodyText>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={[styles.menu_items, target === TargetOptions.privatePolicy && styles.active]}
                        onPress={() => setTarget(TargetOptions.privatePolicy)}
                        underlayColor={colors.tertiary}
                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text, target === TargetOptions.privatePolicy && styles.active_text]} numberOfLines={1}>Private Policy</BodyText>
                        </View>
                    </TouchableHighlight>


                    <TouchableHighlight
                        style={[styles.menu_items, target === TargetOptions.removeAccount && styles.active]}
                        onPress={() => setTarget(TargetOptions.removeAccount)}
                        underlayColor={colors.tertiary}
                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text, target === TargetOptions.removeAccount && styles.active_text]}>Account</BodyText>
                        </View>
                    </TouchableHighlight>


                </View>

                <Pressable onPress={handleSignOut} style={styles.menu_items}>
                    <BodyText style={styles.text}>Sign Out</BodyText>
                </Pressable>
            </Animated.View>
            <KeyboardAvoidingView keyboardVerticalOffset={110} behavior={'padding'} style={{ flex: 1, marginTop: 60 }}>
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
        alignSelf: 'center',
        color: colors.primary,
        fontSize: 16
    },
    menu_container: {
        position: 'absolute',
        flexDirection: 'row',
        backgroundColor: colors.secondaryLight,
        height: 40,
        width: '100%',
        zIndex: 100,
        justifyContent: 'space-between',
        borderBottomColor: colors.primary,
        borderBottomWidth: 1,
        overflow: 'hidden'
    },
    menu_options: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    active: {
        backgroundColor: colors.primary,
        borderRadius: 5
    },
    active_text: {
        fontSize: 12,
        color: colors.white
    },
    menu_items: {
        paddingLeft: 10,
        paddingRight: 10,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    text: {
        fontSize: 12,
        color: colors.primary,
        flexWrap: 'nowrap'
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user,
})

export default connect(mapStateToProps, { update_profile, set_banner, update_privacy, sign_out, remove_account })(Settings);