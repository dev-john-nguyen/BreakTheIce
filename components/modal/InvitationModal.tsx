import React, { useState } from 'react';
import { View, Text, TextInput, Modal, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { colors, buttonsStyles, modalStyle } from '../../utils/styles';
import { SvgXml } from 'react-native-svg';
import { closeSvg } from '../../utils/svgs';
import { connect } from 'react-redux';
import { InvitationsDispatchActionProps, InvitationObject, InvitationStatusOptions } from '../../services/invitations/tsTypes';
import { send_invitation } from '../../services/invitations/actions';
import { messageMaxLen } from '../../utils/variables';
import { NearByUsersProps } from '../../services/near_users/tsTypes';
import { UserRootStateProps } from '../../services/user/user.types';
import { RootProps } from '../../services';

interface MyModalProps {
    visible: boolean;
    handleClose: () => void;
    send_invitation: InvitationsDispatchActionProps['send_invitation'];
    targetUser: NearByUsersProps | undefined;
    user: UserRootStateProps;
}

const InviteModal = (props: MyModalProps) => {
    const [message, setMessage] = useState<string>('');
    const [btnStatus, setBtnStatus] = useState<string>('Send');

    const handleSendInvitation = async () => {
        if (message.length < 10) return console.log('not long enough bitch')
        if (!props.targetUser) return console.log('no user targeted')
        if (!props.targetUser.uid || !props.user.uid) return console.log('not able to get uid');
        //init invitation object

        setBtnStatus('Sending...')

        const invitationContent: InvitationObject = {
            sentBy: props.user.uid,
            sentByAge: props.user.age,
            sentByUsername: props.user.username,
            sentTo: props.targetUser.uid,
            message: message,
            status: InvitationStatusOptions.pending,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        await props.send_invitation(invitationContent)
            .then(() => {
                setBtnStatus('Sent')
                props.handleClose()
            })
            .catch((err) => {
                console.log(err)
                setBtnStatus('Failed')
            })
    }

    return (
        <Modal
            visible={props.visible}
            animationType='fade'
            transparent={true}
            onRequestClose={() => props.handleClose()}
        >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={modalStyle.center_view}>
                        <View style={modalStyle.modal_view}>
                            <Pressable style={modalStyle.close_button} onPress={() => props.handleClose()}>
                                <SvgXml xml={closeSvg} width='20' height='20' fill={colors.white} />
                            </Pressable>
                            <Text style={modalStyle.header_text}>Invite</Text>
                            <TextInput
                                multiline
                                placeholder={'100 character limit'}
                                numberOfLines={4}
                                onChangeText={text => setMessage(text)}
                                value={message}
                                autoCompleteType='off'
                                maxLength={messageMaxLen}
                                style={modalStyle.text_area}
                                placeholderTextColor={colors.secondary}
                            />
                            <Pressable onPress={handleSendInvitation} style={buttonsStyles.button_white_outline}>
                                <Text style={buttonsStyles.button_white_outline_text}>
                                    {btnStatus}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})

export default connect(mapStateToProps, { send_invitation })(InviteModal);