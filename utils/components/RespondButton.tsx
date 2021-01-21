import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { CustomButton, Icon } from '.';
import { colors } from '../styles';
import { InvitationStatusOptions } from '../../services/invitations/types';

interface InvitationButtonsProps {
    handleInvitationUpdate: (status: InvitationStatusOptions) => Promise<void>;
    setLoading: (value: boolean) => void;
    loading: boolean;
}

export default ({ handleInvitationUpdate, loading, setLoading }: InvitationButtonsProps) => {
    const [showOptions, setShowOptions] = useState<boolean>(false)

    const handleRespondOnPress = () => setShowOptions(showOptions ? false : true)

    const handleUpdateStatus = (status: InvitationStatusOptions) => {
        if (loading) return;
        setLoading(true)
        handleInvitationUpdate(status)
            .then(() => setLoading(false))
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    const handleDenied = () => handleUpdateStatus(InvitationStatusOptions.denied)

    const handleAccept = () => handleUpdateStatus(InvitationStatusOptions.accepted)

    const renderOptions = () => (
        <View style={styles.options_container}>
            {loading ?
                <ActivityIndicator size='small' color={colors.primary} /> :
                <Icon type='x' size={15} color={colors.primary} pressColor={colors.secondary} onPress={handleRespondOnPress} />
            }

            <CustomButton type='secondary' text='Accept' onPress={handleAccept} moreStyles={{ marginLeft: 2 }} />

            <CustomButton type='red_outline' text='Deny' onPress={handleDenied} moreStyles={{ marginLeft: 2 }} />
        </View>
    )
    return (
        <View>
            {showOptions ? renderOptions() : <CustomButton text='Respond' type='primary' onPress={handleRespondOnPress} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative'
    },
    options_container: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})