import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { UserRootStateProps, UserDispatchActionsProps } from '../../../services/user/types';
import { BlurView } from 'expo-blur';
import { Icon, CustomButton, BodyText, CustomInput } from '../../utils';
import { colors, opacity_colors } from '../../utils/styles';
import ProfileImage from '../../profile/components/ProfileImage';

interface UpdateStatusProps {
    user: UserRootStateProps;
    update_status_message: UserDispatchActionsProps['update_status_message'];
    handleClose: () => void;
}

export default ({ user, update_status_message, handleClose }: UpdateStatusProps) => {
    const [comStatusMsg, setComStatusMsg] = useState('')
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false)
    const mount = useRef<boolean>()

    useEffect(() => {
        mount.current = true
        if (user.statusMsg) {
            setComStatusMsg(user.statusMsg)
        }

        return () => {
            mount.current = false;
        }
    }, [user])

    const handleUpdateStatus = () => {
        if (comStatusMsg.length < 1 || comStatusMsg.length > 100) {
            return setErrMsg("Found empty values. Please try again.")
        }

        if (user.statusMsg == comStatusMsg) {
            return setErrMsg("No updates found. Please try again.")
        }

        setLoading(true);
        setErrMsg('');

        update_status_message(comStatusMsg)
            .then(() => {
                mount && setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                mount && setLoading(false)
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <BlurView style={styles.blur} intensity={70}>
                    <View style={styles.topLeft}>
                        <BodyText style={styles.topLeft_text}>0 meters away</BodyText>
                    </View>
                    <View style={styles.topRight}>
                        <Icon type='x' onPress={handleClose} color={colors.primary} pressColor={colors.secondary} size={16} />
                    </View>
                    <View style={styles.profile_section}>
                        <ProfileImage image={user.profileImg} size='regular' />
                        <View style={styles.profile_section_text}>
                            <BodyText style={styles.username} numberOfLines={1}>{user.username ? user.username.toLowerCase() : 'Me'}</BodyText>
                            <BodyText style={styles.age}>{user.age ? user.age : 0} years old</BodyText>
                        </View>
                    </View>
                    <View style={styles.content_section}>
                        {!!errMsg &&
                            <BodyText style={styles.err_message}>
                                {errMsg}
                            </BodyText>
                        }
                        <CustomInput
                            style={styles.content_section_text_input}
                            value={comStatusMsg}
                            onChangeText={(text) => setComStatusMsg(text)}
                            placeholder='status'
                            autoCorrect={true}
                            maxLength={100}
                            multiline={true}
                        />
                        <View style={styles.content_section_buttons}>
                            <CustomButton
                                type='primary'
                                text='Update'
                                onPress={handleUpdateStatus}
                                indicatorColor={loading && colors.white}
                            />
                        </View>
                    </View>
                </BlurView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 120,
        zIndex: 100,
        width: Math.round(Dimensions.get('window').width),
    },
    content: {
        width: '100%',
        borderTopColor: colors.primary,
        borderBottomColor: colors.primary,
        backgroundColor: opacity_colors.secondary_light,
        borderBottomWidth: 1,
        borderTopWidth: 1
    },
    content_pressed: {
        width: '100%',
        borderTopColor: colors.primary,
        borderBottomColor: colors.secondary,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        backgroundColor: opacity_colors.secondary_medium
    },
    blur: {
        flexDirection: 'row',
        paddingLeft: 30,
        paddingRight: 10,
        paddingTop: 20,
        flex: 1
    },
    topLeft: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    topRight: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    profile_section: {
        flex: .5,
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 130,
        paddingBottom: 10
    },
    topLeft_text: {
        fontSize: 8,
        color: colors.primary
    },
    profile_section_text: {
        bottom: 5
    },
    username: {
        marginTop: 15,
        fontSize: 14,
        color: colors.primary,
        textAlign: 'center',
        overflow: 'visible'
    },
    age: {
        fontSize: 12,
        color: colors.primary,
        textAlign: 'center'
    },
    content_section: {
        position: 'relative',
        flex: 1,
        justifyContent: 'space-evenly',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 10,
        alignSelf: 'center'
    },
    content_section_buttons: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    content_section_text_input: {
        textAlign: 'center'
    },
    err_message: {
        fontSize: 10,
        color: colors.red
    }
})