import React from 'react';
import { View, Text, FlatList, TouchableHighlight, Pressable } from 'react-native';
import { ListContainerStyle, colors } from '../../utils/styles';
import { connect } from 'react-redux';
import { ProfileImg } from '../../utils/components';
import { ChatScreenRouteProp, ChatStackNavigationProp } from '../navigation/utils'
import { RootProps } from '../../services';
import { ChatPreviewProps } from '../../services/chat/tsTypes'
interface ChatProps {
    navigation: ChatStackNavigationProp;
    route: ChatScreenRouteProp;
    chat: RootProps['chat'];
    user: RootProps['user']
}

const Chat = (props: ChatProps) => {
    const testData = [{
        username: 'nguyening20',
        age: 26,
        date: '12/31/2020',
        msgId: '34af23dsf',
        recentMsg: "The short film to You Rock My World, the Top 10 hit single from Michael Jackson's Invincible, features guest appearances from Chris Tucker, Michael Madsen and Marlon Brando, in one of his final film appearances."
    }]

    const handleRedirectToMessage = (preview: ChatPreviewProps) => {
        props.navigation.push('Message', { usersInfo: preview.usersInfo });
    }

    const renderFriendUsername = (userInfo: ChatPreviewProps['usersInfo']) => {
        for (let i = 0; i < userInfo.length; i++) {
            if (userInfo[i].uid !== props.user.uid) {
                return userInfo[i].username
            }
        }
        return 'UnknownUser'
    }

    const renderDate = (date: Date) => {
        return date.getMonth() + '/' + date.getDay() + '/' + date.getFullYear()
    }

    return (
        <FlatList
            data={props.chat.previews}
            renderItem={({ item, index, separators }) => (
                <TouchableHighlight
                    key={item.docId ? item.docId : index.toString()}
                    onPress={() => handleRedirectToMessage(item)}
                    underlayColor={colors.secondary}
                    style={ListContainerStyle.container}
                >
                    <View style={ListContainerStyle.content}>
                        <View style={ListContainerStyle.topLeft}>
                            <Text style={ListContainerStyle.topLeft_text}>{renderDate(item.dateSent)}</Text>
                        </View>
                        <View style={ListContainerStyle.profile_section}>
                            <ProfileImg friend={true} />
                            <View style={ListContainerStyle.profile_section_text}>
                                <Text style={ListContainerStyle.username}>{renderFriendUsername(item.usersInfo)}</Text>
                                {/* <Text style={ListContainerStyle.age}>{item.age ? item.age : 0} years old</Text> */}
                            </View>
                        </View>
                        <View style={ListContainerStyle.content_section}>
                            <Text style={ListContainerStyle.content_section_text} numberOfLines={4}>{item.recentMsg ? item.recentMsg : 'no recent message...'}</Text>
                            <View>
                                <Text>{item.recentUsername ? item.recentUsername : ''}</Text>
                                <Text>{renderDate(item.dateSent)}</Text>
                            </View>

                        </View>
                    </View>
                </TouchableHighlight>
            )}
            keyExtractor={(item, index) => item.docId ? item.docId : index.toString()}
        />
    )
}

const mapStateToProps = (state: RootProps) => ({
    chat: state.chat,
    user: state.user
})
export default connect(mapStateToProps, {})(Chat);