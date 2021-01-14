import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NearByUsersProps } from '../../../services/near_users/tsTypes';
import { ListContainerStyle, colors, buttonsStyles } from '../../../utils/styles';
import { HomeToChatNavProp } from '../../navigation/utils';
import { ProfileImg, CustomButton } from '../../../utils/components';

interface PreviewProps {
    nearUser: NearByUsersProps
    onSendInvite: () => void;
    navigation: HomeToChatNavProp;
    onClose?: () => void;
}

export default ({ nearUser, onSendInvite, onClose, navigation }: PreviewProps) => {

    const handleMessageOnPress = () => {
        navigation.navigate('Chat', {
            screen: 'Message',
            initial: false,
            params: { targetUser: nearUser, title: nearUser.username }
        })
    }


    const ActionButton = () => {
        if (nearUser.friend) return <CustomButton type='primary' text='Message' onPress={handleMessageOnPress} />

        if (nearUser.sentInvite) return <CustomButton type='disabled' text='Pending' />


        return <CustomButton type='primary' text='Invite' onPress={onSendInvite} />
    }

    return (
        <Pressable style={[list_style.content, styles.container]} onPress={onClose && onClose}>
            <View style={list_style.topLeft}>
                <Text style={list_style.topLeft_text}>{nearUser.distance ? nearUser.distance : 0} meters away</Text>
            </View>
            <View style={list_style.profile_section}>
                <ProfileImg friend={nearUser.friend} />
                <View style={list_style.profile_section_text}>
                    <Text style={list_style.username} numberOfLines={1}>{nearUser.username ? nearUser.username : 'RandomUser'}</Text>
                    <Text style={list_style.age}>{nearUser.age ? nearUser.age : 0} years old</Text>
                </View>
            </View>
            <View style={list_style.content_section}>
                <Text style={list_style.content_section_text}>{nearUser.bioShort ? nearUser.bioShort : 'nothing ...'}</Text>
                <View style={list_style.content_section_buttons}>
                    <ActionButton />
                </View>
            </View>
        </Pressable>
    )
}

const list_style = ListContainerStyle(colors.primary);
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        backgroundColor: colors.secondary
    }
})