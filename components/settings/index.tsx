import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Pressable, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { update_profile, update_privacy, sign_out, send_password_reset_email } from '../../services/user/actions';
import { colors } from '../../utils/styles';
import { MeStackNavigationProp } from '../navigation/utils';
import EditProfile from './components/editprofile';
import Privacy from './components/Privacy';
import { RootProps } from '../../services';
import { UserRootStateProps, UserDispatchActionsProps } from '../../services/user/types';
import { set_banner } from '../../services/utils/actions';
import { UtilsDispatchActionProps } from '../../services/utils/tsTypes';
import ChangePassword from './components/ChangePassword';

interface SettingsProps {
    navigation: MeStackNavigationProp;
    user: UserRootStateProps;
    update_profile: UserDispatchActionsProps['update_profile'];
    update_privacy: UserDispatchActionsProps['update_privacy'];
    set_banner: UtilsDispatchActionProps['set_banner'];
    sign_out: UserDispatchActionsProps['sign_out'];
    send_password_reset_email: UserDispatchActionsProps['send_password_reset_email']
}

enum TargetOptions {
    profile,
    privacy,
    password,
    contacts,
    signOut
}

const Settings = ({ navigation, user, update_profile, set_banner, update_privacy, sign_out, send_password_reset_email }: SettingsProps) => {
    const [target, setTarget] = useState<TargetOptions>(TargetOptions.profile)

    const renderTargetComponent = () => {
        switch (target) {
            case TargetOptions.privacy:
                return <Privacy user={user} set_banner={set_banner} navigation={navigation} update_privacy={update_privacy} />
            case TargetOptions.password:
                return <ChangePassword sendChangePasswordEmail={send_password_reset_email} />
            case TargetOptions.profile:
            default:
                return <EditProfile user={user} set_banner={set_banner} navigation={navigation} update_profile={update_profile} />
        }
    }

    const handleSignOut = () => sign_out()

    return (
        <View style={styles.container}>
            <View style={styles.options_content}>
                <TouchableHighlight
                    style={[styles.item_container, target === TargetOptions.profile && styles.active]}
                    onPress={() => setTarget(TargetOptions.profile)}
                    underlayColor={colors.secondary}
                >
                    <View style={styles.content}>
                        <Text style={[styles.text, target === TargetOptions.profile && styles.active_text]}>Edit Profile</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    style={[styles.item_container, target === TargetOptions.privacy && styles.active]}
                    onPress={() => setTarget(TargetOptions.privacy)}
                    underlayColor={colors.secondary}
                >
                    <View style={styles.content}>
                        <Text style={[styles.text, target === TargetOptions.privacy && styles.active_text]}>Privacy</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    style={[styles.item_container, target === TargetOptions.password && styles.active]}
                    onPress={() => setTarget(TargetOptions.password)}
                    underlayColor={colors.secondary}
                >
                    <View style={styles.content}>
                        <Text style={[styles.text, target === TargetOptions.password && styles.active_text]}>Change Password</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    style={styles.item_container}
                    onPress={() => setTarget(TargetOptions.contacts)}
                    underlayColor={colors.secondary}
                >
                    <View style={styles.content}>
                        <Text style={styles.text}>Manage Contacts</Text>
                    </View>
                </TouchableHighlight>


                <TouchableHighlight
                    style={styles.item_container}
                    onPress={handleSignOut}
                    underlayColor={colors.secondary}
                >
                    <View style={styles.content}>
                        <Text style={styles.text}>Sign Out</Text>
                    </View>
                </TouchableHighlight>
            </View>
            <KeyboardAvoidingView keyboardVerticalOffset={110} behavior={'padding'} style={{ flex: 1, marginTop: 10 }}>
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
    options_content: {
        flexBasis: '30%',
        alignItems: 'stretch',
        borderRightColor: colors.primary,
        borderRightWidth: 1
    },
    active: {
        backgroundColor: colors.secondary
    },
    active_text: {
        fontSize: 10,
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
        fontSize: 10,
        color: colors.primary
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user,
})

export default connect(mapStateToProps, { update_profile, set_banner, update_privacy, sign_out, send_password_reset_email })(Settings);