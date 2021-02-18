import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../utils/styles';
import { connect } from 'react-redux';
import { InvitationsDispatchActionProps, InvitationObject, InvitationStatusOptions, InvitationUserInfo } from '../../../services/invitations/types';
import { send_invitation } from '../../../services/invitations/actions';
import { messageMaxLen } from '../../../utils/variables';
import { NearByUsersProps } from '../../../services/near_users/types';
import { UserRootStateProps } from '../../../services/user/types';
import { RootProps } from '../../../services';
import { CustomButton, Icon, BodyText, UnderlineHeader } from '../../utils';

interface MyModalProps {
    visible: boolean;
    handleClose: () => void;
    send_invitation: InvitationsDispatchActionProps['send_invitation'];
    targetUser: NearByUsersProps | undefined | null;
    user: UserRootStateProps;
}

const InviteModal = ({ visible, handleClose, send_invitation, targetUser, user }: MyModalProps) => {
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>('');

    useEffect(() => {
        setLoading(false)
        setMessage('')
        setErrMsg('')
    }, [targetUser, visible])

    const handleSendInvitation = async () => {
        if (message.length < 1) return setErrMsg('Empty message')
        if (!targetUser) return setErrMsg('Trouble identifying the target user')
        if (!targetUser || !targetUser.uid || !user.uid) return setErrMsg('Trouble identifying the target user')

        setLoading(true)

        const userProfileImg = user.profileImg ? {
            uri: user.profileImg.uri,
            updatedAt: user.profileImg.updatedAt
        } : null

        const sentBy: InvitationUserInfo = {
            uid: user.uid,
            age: user.age,
            username: user.username,
            profileImg: userProfileImg
        }

        const targetProfileImg = targetUser.profileImg ? {
            uri: targetUser.profileImg.uri,
            updatedAt: targetUser.profileImg.updatedAt
        } : null

        const sentTo: InvitationUserInfo = {
            uid: targetUser.uid,
            age: targetUser.age,
            username: targetUser.username,
            profileImg: targetProfileImg
        }

        const invitationContent: Omit<InvitationObject, 'docId'> = {
            sentBy,
            sentTo,
            message: message,
            status: InvitationStatusOptions.pending,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        await send_invitation(invitationContent)
            .then(() => {
                if (visible) {
                    handleClose()
                }
            })
            .catch((err) => {
                console.log(err)
                visible && setLoading(false)
            })
    }

    return (
        <Modal
            visible={visible}
            animationType='fade'
            transparent={true}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.center_view}>
                        <View style={styles.modal_view}>
                            <UnderlineHeader
                                height={10}
                                colorTo={colors.secondary}
                                colorFrom={colors.primary}
                                style={{ marginTop: 10 }}
                                textStyle={styles.header_text}
                            >Break The Ice</UnderlineHeader>
                            <BodyText style={styles.header_sub_text}>with {targetUser?.username}</BodyText>
                            <Icon type='x' size={20} color={colors.white} pressColor={colors.secondary} onPress={handleClose} style={styles.close_button} />
                            {!!errMsg && <BodyText style={styles.err}>{errMsg}</BodyText>}
                            <TextInput
                                multiline
                                placeholder={'Send a breif message ... 100 character limit'}
                                numberOfLines={4}
                                onChangeText={text => setMessage(text)}
                                value={message}
                                autoCompleteType='off'
                                maxLength={messageMaxLen}
                                style={styles.text_area}
                            />
                            <CustomButton type='white_outline' text='Send' onPress={handleSendInvitation} indicatorColor={loading && colors.white} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    center_view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        height: Math.round(Dimensions.get('window').height),
        width: Math.round(Dimensions.get('window').width)
    },
    modal_view: {
        position: 'relative',
        backgroundColor: colors.primary,
        borderColor: colors.secondary,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "stretch",
        justifyContent: 'center',
        padding: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    header_text: {
        fontSize: 20,
        color: colors.white,
    },
    header_sub_text: {
        fontSize: 12,
        color: colors.white,
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: 10
    },
    text_area: {
        backgroundColor: colors.white,
        color: colors.black,
        fontSize: 12,
        borderRadius: 5,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        marginBottom: 20,
        height: 100,
        width: 200
    },
    close_button: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    err: {
        fontSize: 10,
        color: colors.red,
        marginBottom: 5
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})

export default connect(mapStateToProps, { send_invitation })(InviteModal);