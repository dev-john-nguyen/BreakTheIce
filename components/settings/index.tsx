import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Pressable, Animated } from 'react-native';
import { connect } from 'react-redux';
import { update_profile, update_privacy, sign_out, remove_account } from '../../services/user/actions';
import { colors, dropShadowListContainer, normalize } from '../utils/styles';
import { MeStackNavigationProp } from '../navigation';
import EditProfile from './components/profile';
import Privacy from './components/Privacy';
import { RootProps } from '../../services';
import { UserRootStateProps, UserDispatchActionsProps } from '../../services/user/types';
import { set_banner } from '../../services/banner/actions';
import { BannerDispatchActionProps } from '../../services/banner/tsTypes';
import EditGallery from './components/EditGallery';
import * as ImagePicker from 'expo-image-picker';
import { BodyText, HeaderText, Icon } from '../utils';
import Other from './components/other'

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
    contacts = "Manage Contacts",
    gallery = "Edit Gallery",
    other = "Other"
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
            case TargetOptions.other:
                return <Other remove_account={remove_account} />
            case TargetOptions.profile:
            default:
                return <EditProfile user={user} set_banner={set_banner} navigation={navigation} update_profile={update_profile} handleCameraRollPermission={handleCameraRollPermission} />
        }
    }

    const handleCameraRollPermission = async (): Promise<boolean> => {
        try {
            const { status: CameraRollStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

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
        <View style={[styles.container, dropShadowListContainer]}>
            <Animated.View style={styles.menu_container}>
                <View style={styles.menu_options}>
                    {/* <TouchableHighlight
                        style={[styles.menu_items, target === TargetOptions.profile && styles.active]}
                        onPress={() => set_banner('kklfjdsklfjadklsjfkldsjfkldsfj sadfkljdsalf asdfjl adlskfj alsfj sjklklfjladsjf klsfjdklsfj lsadjf kls;fkl jsdadlsfjkladsfjdsa klkldsfalsdf dslfjkadlskf lfjadklsfj  ', 'success')}

                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text, target === TargetOptions.profile && styles.active_text]}>Error</BodyText>
                        </View>
                    </TouchableHighlight> */}

                    <Pressable
                        style={({ pressed }) => [styles.menu_items, (target === TargetOptions.profile || pressed) && styles.active]}
                        onPress={() => setTarget(TargetOptions.profile)}
                    >
                        <View style={styles.content}>
                            <BodyText style={styles.text}>Profile</BodyText>
                        </View>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [styles.menu_items, (target === TargetOptions.gallery || pressed) && styles.active]}
                        onPress={() => setTarget(TargetOptions.gallery)}

                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text]}>Gallery</BodyText>
                        </View>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [styles.menu_items, (target === TargetOptions.privacy || pressed) && styles.active]}
                        onPress={() => setTarget(TargetOptions.privacy)}
                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text]}>Privacy</BodyText>
                        </View>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [styles.menu_items, (target === TargetOptions.other || pressed) && styles.active]}
                        onPress={() => setTarget(TargetOptions.other)}

                    >
                        <View style={styles.content}>
                            <BodyText style={[styles.text]} numberOfLines={1}>Other</BodyText>
                        </View>
                    </Pressable>


                </View>

                <Pressable onPress={handleSignOut} style={styles.menu_items}>
                    <Icon type='log-out' size={20} color={colors.primary} pressColor={colors.secondary} onPress={handleSignOut} />
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
        flexDirection: 'row'
    },
    header: {
        alignSelf: 'center',
        color: colors.primary,
        fontSize: normalize(14)
    },
    menu_container: {
        position: 'absolute',
        flexDirection: 'row',
        backgroundColor: colors.white,
        height: 40,
        width: '100%',
        zIndex: 100,
        justifyContent: 'space-between',
        // borderBottomColor: colors.tertiary,
        // borderBottomWidth: 1,
        overflow: 'hidden'
    },
    menu_options: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    active: {
        borderBottomColor: colors.primary,
        borderBottomWidth: 2
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
        fontSize: normalize(10),
        color: colors.black,
        flexWrap: 'nowrap'
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user,
})

export default connect(mapStateToProps, { update_profile, set_banner, update_privacy, sign_out, remove_account })(Settings);