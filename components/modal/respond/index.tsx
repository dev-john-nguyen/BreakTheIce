import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { colors, normalize } from '../../utils/styles';
import { connect } from 'react-redux';
import { InvitationStatusOptions, InvitationsDispatchActionProps, InvitationObject } from '../../../services/invitations/types';
import { update_invitation } from '../../../services/invitations/actions';
import { NearByUsersProps } from '../../../services/near_users/types';
import { RootProps } from '../../../services';
import { Icon, BodyText, UnderlineHeader } from '../../utils';
import RespondSlider from './Slider';
import { UserRootStateProps } from '../../../services/user/types';
import { set_banner } from '../../../services/banner/actions';
import { BannerDispatchActionProps } from '../../../services/banner/tsTypes';

interface RespondModalProps {
    visible: boolean;
    handleClose: () => void;
    targetUser: NearByUsersProps | undefined | null;
    update_invitation: InvitationsDispatchActionProps['update_invitation'];
    invitationInbound: InvitationObject[]
    user: UserRootStateProps;
    set_banner: BannerDispatchActionProps['set_banner']
}

const RespondModal = ({ visible, handleClose, update_invitation, targetUser, invitationInbound, user, set_banner }: RespondModalProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [targetInvitation, settTargetInvitation] = useState<InvitationObject>()

    useEffect(() => {
        setLoading(false)

        if (!visible) return

        if (targetUser && invitationInbound.length > 0) {
            //search for the invitation
            const foundInvitation = invitationInbound.find(invitation => invitation.sentBy.uid === targetUser.uid && invitation.sentTo.uid === user.uid)

            if (foundInvitation) {
                settTargetInvitation(foundInvitation)
            } else {
                set_banner("Sorry, it looks like we are having trouble finding the invitation.", 'error')
                handleClose()
            }
        } else {
            set_banner("Sorry, it looks like we are having trouble finding the invitation.", 'error')
            handleClose()
        }

    }, [targetUser, visible])

    const updateInvitationStatus = (status: InvitationStatusOptions) => {
        if (loading || !targetUser) return;
        setLoading(true)
        update_invitation(targetUser.uid, status)
            .then(() => {
                visible && handleClose()
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }


    const renderContent = () => {
        if (!targetInvitation || !targetUser) return <ActivityIndicator color={colors.white} style={{ margin: 50 }} />

        return (
            <>
                <UnderlineHeader
                    style={{ marginTop: 10 }}
                    textStyle={styles.header_text}
                >Respond</UnderlineHeader>
                <BodyText style={styles.header_sub_text}>to {targetUser.username}</BodyText>
                <View style={styles.message_container}>
                    <BodyText style={styles.message}>{targetInvitation.message}</BodyText>
                </View>
                <RespondSlider updateInvitationStatus={updateInvitationStatus} />
            </>
        )
    }


    return (
        <Modal
            visible={visible}
            animationType='fade'
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.center_view}>
                <View style={styles.modal_view}>
                    <Icon type='x' size={20} color={colors.white} pressColor={colors.secondary} onPress={handleClose} style={styles.close_button} />
                    {renderContent()}
                </View>
            </View>
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
        borderRadius: 10,
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
        marginBottom: 20
    },
    message_container: {
        backgroundColor: colors.white,
        minHeight: 100,
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
        alignSelf: 'center'
    },
    message: {
        fontSize: normalize(10),
        color: colors.black
    },
    close_button: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    err: {
        fontSize: 12,
        color: colors.red
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user,
    invitationInbound: state.invitations.inbound
})

export default connect(mapStateToProps, { update_invitation, set_banner })(RespondModal);