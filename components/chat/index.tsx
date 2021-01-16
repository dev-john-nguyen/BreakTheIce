import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableHighlight, ActivityIndicator } from 'react-native';
import { ListContainerStyle, colors } from '../../utils/styles';
import { connect } from 'react-redux';
import { ProfileImg } from '../../utils/components';
import { ChatScreenRouteProp, ChatStackNavigationProp } from '../navigation/utils'
import { RootProps } from '../../services';
import { ChatPreviewProps } from '../../services/chat/types'
import ProfileImage from '../profile/components/ProfileImage';
interface ChatProps {
    navigation: ChatStackNavigationProp;
    route: ChatScreenRouteProp;
    chat: RootProps['chat'];
    user: RootProps['user']
}

const Chat = (props: ChatProps) => {
    const [chatPreviews, setChatPreviews] = useState<ChatPreviewProps[]>()
    useEffect(() => {
        //sort by time;
        props.chat.previews.sort((chat1: ChatPreviewProps, chat2: ChatPreviewProps) => (new Date(chat2.dateSent) as any) - (new Date(chat1.dateSent) as any))

        setChatPreviews([...props.chat.previews])
    }, [props.chat.previews])

    const handleRedirectToMessage = (preview: ChatPreviewProps) => {
        var otherUser = renderOtherUser(preview.usersInfo);
        var title = otherUser ? otherUser.username : 'RandomUser'

        props.navigation.push('Message', { msgDocId: preview.docId, unread: preview.unread, title });
    }

    const renderOtherUser = (userInfo: ChatPreviewProps['usersInfo']) => {
        return userInfo.find(user => user.uid !== props.user.uid)
    }

    const renderDate = (date: Date) => {
        if (!date) return
        return date.getMonth() + '/' + date.getDay() + '/' + date.getFullYear()
    }

    const renderDateDiff = (date: any) => {
        if (!date) return;

        const date1: any = new Date();
        const diffTime = Math.abs(date1 - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 1) return diffDays + " days ago"
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        if (diffHours < 24 && diffHours > 1) return diffHours + " hours ago"
        const diffMins = Math.ceil(diffTime / (1000 * 60));
        if (diffMins < 60 && diffMins > 1) return diffMins + " mins ago"
        const diffSec = Math.ceil(diffTime / (1000));
        return diffSec + " secs ago";
    }

    if (!chatPreviews) return <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
    </View>

    return (
        <FlatList
            data={chatPreviews}
            renderItem={({ item, index, separators }) => {

                var unread = item.unread && item.recentUid !== props.user.uid;

                var otherUser = renderOtherUser(item.usersInfo);

                const list_style = ListContainerStyle(unread ? colors.white : colors.primary, unread ? colors.secondary : undefined)

                return (
                    <TouchableHighlight
                        key={item.docId ? item.docId : index.toString()}
                        onPress={() => handleRedirectToMessage(item)}
                        underlayColor={colors.secondary}
                        style={list_style.container}
                    >
                        <View style={list_style.content}>
                            <View style={list_style.topLeft}>
                                <Text style={list_style.topLeft_text}>{renderDate(item.dateCreated)}</Text>
                            </View>
                            <View style={list_style.profile_section}>
                                <ProfileImage friend={true} size='regular' image={otherUser?.profileImg} />
                                <View style={list_style.profile_section_text}>
                                    <Text style={list_style.username}>{otherUser ? otherUser.username : 'RandomUser'}</Text>
                                </View>
                            </View>
                            <View style={list_style.content_section}>
                                <Text style={list_style.content_section_text} numberOfLines={4}>{item.recentMsg ? item.recentMsg : 'no recent message...'}</Text>
                                <View style={list_style.content_section_small}>
                                    <Text style={list_style.content_section_small_text}>{renderDateDiff(item.dateSent)}</Text>
                                </View>

                            </View>
                        </View>
                    </TouchableHighlight>
                )
            }}
            keyExtractor={(item, index) => item.docId ? item.docId : index.toString()}
        />
    )
}

const mapStateToProps = (state: RootProps) => ({
    chat: state.chat,
    user: state.user
})
export default connect(mapStateToProps, {})(Chat);