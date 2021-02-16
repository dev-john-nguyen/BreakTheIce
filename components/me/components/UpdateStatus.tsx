import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, StyleSheet, Pressable } from 'react-native';
import { UserRootStateProps, UserDispatchActionsProps } from '../../../services/user/types';
import { BlurView } from 'expo-blur';
import { Icon, CustomButton, BodyText, CustomInput } from '../../utils';
import { colors, opacity_colors, normalize } from '../../utils/styles';
import { ListProfileImage } from '../../profile/components/ProfileImage';
import { BannerDispatchActionProps } from '../../../services/banner/tsTypes';

interface UpdateStatusProps {
    user: UserRootStateProps;
    update_status_message: UserDispatchActionsProps['update_status_message'];
    handleClose: () => void;
    set_banner: BannerDispatchActionProps['set_banner']
}

export default ({ user, update_status_message, handleClose, set_banner }: UpdateStatusProps) => {
    const [comStatusMsg, setComStatusMsg] = useState('')
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
            return set_banner("Found empty values. Please try again.", 'warning')
        }

        if (user.statusMsg == comStatusMsg) {
            return set_banner("No updates found. Please try again.", 'warning')
        }

        setLoading(true);

        update_status_message(comStatusMsg)
            .then(() => {
                mount.current && setLoading(false)
                set_banner('Your status was successfully updated!', 'success');
            })
            .catch((err) => {
                console.log(err)
                mount.current && setLoading(false)
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <BlurView style={styles.blur} intensity={70}>
                    <Pressable style={styles.topRight} onPress={handleClose}>
                        <Icon type='x' onPress={handleClose} color={colors.primary} pressColor={colors.secondary} size={16} />
                    </Pressable>
                    <View style={styles.profile_section}>
                        <ListProfileImage
                            image={user.profileImg}
                            friend={false}
                            onImagePress={() => undefined}
                        />
                        <View style={styles.profile_section_text}>
                            <BodyText style={styles.username} numberOfLines={1}>{user.username ? user.username.toLowerCase() : 'Me'}</BodyText>
                            <BodyText style={styles.age}>{user.age ? user.age : 0} years old</BodyText>
                        </View>
                    </View>
                    <View style={styles.content_section}>
                        <View style={styles.topLeft}>
                            <BodyText style={styles.topLeft_text}>0 meters away</BodyText>
                        </View>
                        <CustomInput
                            style={styles.content_section_text_input}
                            value={comStatusMsg}
                            onChangeText={(text) => setComStatusMsg(text)}
                            placeholder="What are you thinking?"
                            autoCorrect={true}
                            maxLength={100}
                            multiline={true}
                            autoFocus={true}
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
        position: 'relative',
        width: '100%',
        backgroundColor: opacity_colors.secondary_light
    },
    blur: {
        flexDirection: 'row',
        paddingLeft: 20,
        flex: 1
    },
    topLeft: {
        position: 'absolute',
        top: 5,
        left: 5,
    },
    topRight: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10
    },
    profile_section: {
        flex: .5,
        marginRight: 10,
        flexDirection: 'column',
        height: 150,
    },
    topLeft_text: {
        fontSize: normalize(6),
        color: colors.primary
    },
    profile_section_text: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'center',
        padding: 10
    },
    username: {
        fontSize: normalize(11),
        color: colors.primary,
        textAlign: 'center',
        overflow: 'visible'
    },
    age: {
        fontSize: normalize(7),
        color: colors.primary,
        textAlign: 'center'
    },
    content_section: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 30,
        alignSelf: 'stretch',
        justifyContent: 'space-between'
    },
    content_section_buttons: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    content_section_text_input: {
        textAlign: 'center'
    },
})