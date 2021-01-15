import React, { useState } from 'react';
import { View, Text, TextInput, Modal, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../utils/styles';
import { SvgXml } from 'react-native-svg';
import { closeSvg } from '../../utils/svgs';
import { connect } from 'react-redux';
import { InvitationsDispatchActionProps, InvitationObject, InvitationStatusOptions } from '../../services/invitations/tsTypes';
import { send_invitation } from '../../services/invitations/actions';
import { messageMaxLen } from '../../utils/variables';
import { NearByUsersProps } from '../../services/near_users/tsTypes';
import { UserRootStateProps } from '../../services/user/types';
import { RootProps } from '../../services';
import { CustomButton, Icon } from '../../utils/components';

interface MyModalProps {
    visible: boolean;
    handleClose: () => void;
    send_invitation: InvitationsDispatchActionProps['send_invitation'];
    targetUser: NearByUsersProps | undefined | null;
    user: UserRootStateProps;
}

const InviteModal = (props: MyModalProps) => {
    const [message, setMessage] = useState<string>('');
    const [btnStatus, setBtnStatus] = useState<string>('Send');

    const handleClose = () => {
        setMessage('')
        props.handleClose()
    }

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
                setBtnStatus('Sent');
                setMessage('');
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
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.center_view}>
                        <View style={styles.modal_view}>
                            <Icon type='x' size={20} color={colors.white} pressColor={colors.secondary} onPress={handleClose} style={styles.close_button} />
                            <Text style={styles.header_text}>Connect</Text>
                            <TextInput
                                multiline
                                placeholder={'100 character limit'}
                                numberOfLines={4}
                                onChangeText={text => setMessage(text)}
                                value={message}
                                autoCompleteType='off'
                                maxLength={messageMaxLen}
                                style={styles.text_area}
                            />
                            <CustomButton type='white_outline' text={btnStatus} onPress={handleSendInvitation} />
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
        margin: 20,
        backgroundColor: colors.primary,
        borderRadius: 5,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '60%',
        maxWidth: 250,
        minHeight: 250,
        justifyContent: 'space-between'
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
        flex: 1,
        margin: 20,
        width: '100%'
    },
    header_text: {
        fontSize: 22,
        color: colors.white,
        letterSpacing: .5
    },
    close_button: {
        position: 'absolute',
        right: 10,
        top: 10,
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})

export default connect(mapStateToProps, { send_invitation })(InviteModal);