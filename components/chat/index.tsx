import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableHighlight, ActivityIndicator, StyleProp, StyleSheet, Animated, Pressable } from 'react-native';
import { colors } from '../../utils/styles';
import { connect } from 'react-redux';
import { ChatStackNavigationProp } from '../navigation/utils/types'
import { RootProps } from '../../services';
import { ChatPreviewProps, ChatDispatchActionsProps } from '../../services/chat/types'
import ProfileImage from '../profile/components/ProfileImage';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { Icon, UnderlineHeader } from '../../utils/components';
import { delete_chat } from '../../services/chat/actions';
import { renderOtherUser, renderDateDiff } from './utils';

interface ChatProps {
    navigation: ChatStackNavigationProp;
    chat: RootProps['chat'];
    user: RootProps['user'];
    delete_chat: ChatDispatchActionsProps['delete_chat'];
}

const Chat = ({ navigation, chat, user, delete_chat }: ChatProps) => {
    const [chatPreviews, setChatPreviews] = useState<ChatPreviewProps[]>()
    useEffect(() => {
        //sort by time;
        chat.previews.sort((chat1: ChatPreviewProps, chat2: ChatPreviewProps) => (new Date(chat2.dateSent) as any) - (new Date(chat1.dateSent) as any))

        setChatPreviews([...chat.previews])
    }, [chat.previews])

    const directToMessage = (preview: ChatPreviewProps) => {
        var otherUser = renderOtherUser(preview.usersInfo, user.uid);

        if (!otherUser) return;

        const targetUser = {
            ...otherUser,
            profileImg: preview.profileImgs[otherUser.uid]
        }

        var title = otherUser ? otherUser.username : 'RandomUser'

        //figure out if unread should be updated ....
        const setRead = preview.unread && user.uid !== preview.recentUid ? true : false

        navigation.push('Message', { msgDocId: preview.docId, setRead, title, targetUser });
    }

    const renderRightActions = (progress: Animated.AnimatedInterpolation) => {

        const trans = progress.interpolate({
            inputRange: [0, .4, .5, 1],
            outputRange: [0, -10, -120, -320],
        });

        return (
            <RectButton style={styles.rightAction}>
                <Animated.View
                    style={[
                        styles.actionText,
                        {
                            transform: [{ translateX: trans }],
                        },
                    ]}>
                    <Icon type='trash-2' color={colors.white} size={30} />
                </Animated.View>
            </RectButton>
        )
    }

    if (!chatPreviews) return <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
    </View>

    if (chatPreviews.length < 1) return (
        <UnderlineHeader
            textStyle={styles.underline_header_text}
            underlineStyle={styles.underline_header_underline}
            style={{ marginTop: 20 }}>No Messages Found</UnderlineHeader>
    )

    return (
        <FlatList
            data={chatPreviews}
            renderItem={({ item, index }) => {

                var unread = item.unread && item.recentUid !== user.uid;

                var otherUser = renderOtherUser(item.usersInfo, user.uid);

                var otherOtherProfileImg = null;

                if (otherUser) {
                    otherOtherProfileImg = item.profileImgs[otherUser.uid]
                }

                const list_style = chat_styles(unread)

                return (
                    <Swipeable
                        key={item.docId ? item.docId : index.toString()}
                        renderRightActions={renderRightActions}
                        containerStyle={list_style.container}
                        onSwipeableRightOpen={() => delete_chat(item.docId)}
                    >
                        <Pressable style={({ pressed }) => [list_style.content, pressed && { backgroundColor: colors.tertiary }]} onPress={() => directToMessage(item)}>
                            <View style={list_style.profile_section}>
                                <ProfileImage friend={true} size='regular' image={otherOtherProfileImg} />
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
                        </Pressable>
                    </Swipeable>
                )
            }}
            keyExtractor={(item, index) => item.docId ? item.docId : index.toString()}
        />
    )
}

const styles = StyleSheet.create({
    leftAction: {
        flex: 1,
        backgroundColor: colors.red,
        justifyContent: 'center',
    },
    actionText: {
        color: colors.white,
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
    },
    rightAction: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.red,
    },
    underline_header_text: {
        color: colors.primary,
        fontSize: 24
    },
    underline_header_underline: {
        backgroundColor: colors.secondary
    },
})

const chat_styles = (unread: boolean): StyleProp<any> => StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderBottomColor: colors.primary,
        borderTopColor: colors.primary,
        position: 'relative',
        marginBottom: 20
    },
    content: {
        flex: 1,
        backgroundColor: unread ? colors.secondary : colors.white,
        flexDirection: 'row',
        paddingLeft: 30,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    profile_section: {
        flex: .5,
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profile_section_text: {
        bottom: 5
    },
    username: {
        marginTop: 15,
        fontSize: 16,
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
        flex: 1,
        justifyContent: 'space-evenly',
        paddingLeft: 20,
        paddingRight: 10,
        alignSelf: 'center'
    },
    content_section_text: {
        fontSize: 12,
        color: colors.primary,
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center'
    },
    content_section_small: {
        alignSelf: 'flex-end',
        flexDirection: 'row'
    },
    content_section_small_text: {
        fontSize: 8,
        color: colors.primary,
        margin: 5
    }
})

const mapStateToProps = (state: RootProps) => ({
    chat: state.chat,
    user: state.user
})
export default connect(mapStateToProps, { delete_chat })(Chat);