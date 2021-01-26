import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, FlatList, Text, StyleSheet, ActivityIndicator, Pressable, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { colors } from '../../../utils/styles';
import { ChatStackParams, ChatStackNavigationProp } from '../../navigation/utils/types';
import { RouteProp } from '@react-navigation/native';
import { fireDb } from '../../../services/firebase';
import { ChatDb, ChatMessageDb } from '../../../utils/variables';
import { MessageProps, ChatPreviewProps, ChatRootProps } from '../../../services/chat/types';
import { RootProps } from '../../../services';
import { set_banner } from '../../../services/utils/actions';
import { UtilsDispatchActionProps } from '../../../services/utils/tsTypes';
import { CustomButton } from '../../../utils/components';
import { handleUpdateUnread, searchReduxChat } from '../utils';
import { ProfileImgProps } from '../../../services/user/types';
import { timestamp } from '../../../utils/variables';

interface ComMessageProps {
    route: RouteProp<ChatStackParams, "Message">;
    navigation: ChatStackNavigationProp;
    user: RootProps['user'];
    set_banner: UtilsDispatchActionProps['set_banner'];
    chatPreviews: ChatRootProps['previews'];
}

export interface TargetUserProps {
    uid: string;
    username: string;
    profileImg: ProfileImgProps | null
}

const Message = ({ route, navigation, user, set_banner, chatPreviews }: ComMessageProps) => {
    const { msgDocId } = route.params;
    const [messages, setMessages] = useState<MessageProps[] | 'empty'>();
    const [messageTxt, setMessageTxt] = useState<string>('');
    const [targetChatDocId, setTargetChatDocId] = useState<string | undefined>(msgDocId)


    const initChatListener = (msgDocId: string, setRead: boolean) => {


        if (setRead) {
            //set message read
            //update usersInfo with profileImg

            var updatedObj: {
                unread: boolean,
                [uid: string]: any
            } = {
                unread: false,
                timestamp,
                updatedAt: new Date()
            }

            if (user.profileImg) {
                updatedObj[`profileImgs.${user.uid}`] = {
                    uri: user.profileImg.uri,
                    updatedAt: new Date()
                }
            }

            fireDb.collection(ChatDb).doc(msgDocId).update(updatedObj)
        }

        return fireDb.collection(ChatDb).doc(msgDocId).collection(ChatMessageDb).onSnapshot((querySnapshot) => {
            var messages: MessageProps[] = [];

            querySnapshot.docs.forEach((doc) => {
                if (doc.exists) {
                    const { message, sentAt, sentBy, sentTo } = doc.data();
                    messages.push({ message, sentAt: sentAt.toDate(), sentBy, docId: doc.id })
                }
            })

            //sort by time;
            messages.sort((msg1: MessageProps, msg2: MessageProps) => (new Date(msg2.sentAt) as any) - (new Date(msg1.sentAt) as any))

            setMessages(messages)
        },
            err => {
                console.log(err)
                set_banner('Oops! Failed to get messages', 'error')
                setMessages('empty');
            }
        )
    }

    const fetchDbChat = async (targetUser: TargetUserProps) => {
        return fireDb.collection(ChatDb)
            .where('usersInfo', 'array-contains', { uid: user.uid, username: user.username })
            .get()
            .then(querySnapShot => {
                const { docs } = querySnapShot;

                const chatDoc = docs.find(doc => {
                    var chatFound: boolean = false
                    if (doc.exists) {
                        const { usersInfo } = doc.data() as ChatPreviewProps;

                        usersInfo.forEach(userInfo => {
                            if (userInfo.uid === targetUser.uid) {
                                chatFound = true
                            }
                        })
                    }

                    if (chatFound) {
                        return doc
                    }
                })

                if (chatDoc) {

                    const { unread, recentUid } = chatDoc.data() as ChatPreviewProps;

                    handleUpdateUnread(chatDoc.id, unread, recentUid, user.uid)

                    return { docId: chatDoc.id }
                }

                setMessages('empty')
            })
            .catch((err) => {
                console.log(err)
                set_banner('Oops! Something went wrong getting the chat messages.', 'error')
                setMessages('empty')
            })

    }

    const fetchChat = async (targetUser: TargetUserProps) => {
        var docId: string | undefined;

        const foundChat = searchReduxChat(targetUser, chatPreviews);

        if (!foundChat) {
            const fetchedDocId = await fetchDbChat(targetUser)
                .catch(err => {
                    console.log(err)
                })

            if (!fetchedDocId) {
                setMessages('empty')
                return;
            }

            docId = fetchedDocId.docId;
        } else {
            docId = foundChat.docId
            const { unread, recentUid } = foundChat
            handleUpdateUnread(docId, unread, recentUid, user.uid)
        }

        setTargetChatDocId(docId);

        return initChatListener(docId, false)
    }

    useEffect(() => {
        let isMounted = true;

        var unsubscribeMessages: () => void | undefined;

        const { targetUser, msgDocId, setRead } = route.params;

        if (msgDocId) {
            //check if docId can be found if not set error and setread if true
            unsubscribeMessages = initChatListener(msgDocId, setRead)
        } else if (targetUser) {

            fetchChat(targetUser)
                .then((chatListener) => {
                    if (chatListener) {
                        unsubscribeMessages = chatListener
                    }
                })

        } else {
            set_banner('Unable to identify the target user.', 'error')
            navigation.goBack()
        }

        return () => {
            unsubscribeMessages && unsubscribeMessages()
        };
    }, [route.params, targetChatDocId])

    const handleSentMessage = () => {

        if (messageTxt.length < 1) return set_banner('Say something cool.', 'warning')

        Keyboard.dismiss();

        //there should be only two users in the chat so the sentTo uid
        //can be one or the other
        var batch = fireDb.batch();

        //initate vars
        var chatRef;

        var chatObj: any = {
            recentMsg: messageTxt,
            dateSent: new Date(),
            unread: true,
            recentUid: user.uid,
            timestamp,
            updatedAt: new Date()
        }

        var newChatId: string;

        if (targetChatDocId) {
            //listener was set so targetChatDocId
            chatRef = fireDb.collection(ChatDb).doc(targetChatDocId);
        } else if (route.params.targetUser) {
            //listener or targetChatDocId 
            chatRef = fireDb.collection(ChatDb).doc();

            const { targetUser } = route.params;


            chatObj.dateCreated = new Date();

            chatObj.usersInfo = [{
                username: targetUser.username,
                uid: targetUser.uid
            },
            {
                username: user.username,
                uid: user.uid
            }]

            if (user.profileImg) {
                chatObj.profileImgs = {
                    [user.uid]: {
                        uri: user.profileImg.uri,
                        updatedAt: new Date()
                    }
                }
            }

            if (targetUser.profileImg) {
                chatObj.profileImgs = {
                    ...chatObj.profileImgs,
                    [targetUser.uid]: {
                        uri: targetUser.profileImg.uri,
                        updatedAt: new Date()
                    }
                }
            }

            //set new targetChatDocId and this will eventually set the listener
            newChatId = chatRef.id;
        } else {
            //fail
            return set_banner("Oops! Wasn't able to find user information", 'error');
        }

        try {
            batch.set(chatRef, chatObj, { merge: true })
        } catch (err) {
            console.log(err)
        }


        var newMsgRef = chatRef.collection(ChatMessageDb).doc();

        batch.set(newMsgRef, {
            sentBy: user.uid,
            sentAt: new Date(),
            message: messageTxt,
            timestamp,
            updatedAt: new Date()
        }
        )

        batch.commit()
            .then(() => {
                //if chatId is not undefined then a new Chat was created
                newChatId && setTargetChatDocId(newChatId);
                setMessageTxt('');
            })
            .catch((err) => {
                console.log(err)
                set_banner("Sorry, wasn't able to send your message, please try again.", 'error')
            })
    }


    const TextMsgs = () => {
        if (!messages) return <ActivityIndicator size='large' color={colors.primary} style={{ flex: 1 }} />

        if (messages === 'empty') {
            return <View style={styles.empty}>
                <Text>No Messages</Text>
            </View>
        }

        return <FlatList
            style={styles.messages}
            data={messages}
            inverted
            initialNumToRender={10}
            renderItem={({ item, index, separators }) => {
                if (item.sentBy === user.uid) {
                    return (
                        <View key={item.docId} style={styles.message_right}>
                            <Text style={styles.message_right_text}>{item.message}</Text>
                        </View>
                    )
                } else {
                    return (
                        <View key={item.docId} style={styles.message_left}>
                            <Text style={styles.message_left_text}>{item.message}</Text>
                        </View>
                    )
                }
            }}
            keyExtractor={(item, index) => item.docId ? item.docId : index.toString()}
        />
    }


    return (
        <View style={styles.container}>
            <TextMsgs />
            <KeyboardAvoidingView keyboardVerticalOffset={120} behavior={'padding'} style={styles.message_form}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.message_form_content}>
                        <ScrollView style={styles.message_form_input}>
                            <TextInput
                                style={styles.message_form_input_text}
                                onChangeText={text => setMessageTxt(text)}
                                value={messageTxt}
                                multiline />
                        </ScrollView>
                        <CustomButton type='primary' onPress={handleSentMessage} text='Send' />
                    </View>
                </ TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    message_form: {
        borderTopColor: colors.primary,
        borderTopWidth: 2,
    },
    message_form_content: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center'
    },
    message_form_input: {
        flexBasis: '70%',
        borderWidth: 2,
        borderRadius: 20,
        marginRight: 10,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: colors.primary,
        maxHeight: 80
    },
    message_form_input_text: {
        color: 'black'
    },
    profile_content: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    username: {
        marginLeft: 10,
        fontSize: 16,
        color: colors.primary,
        textAlign: 'center'
    },
    messages: {
        flex: 1
    },
    message_left: {
        left: -10,
        marginTop: 10,
        marginBottom: 10,
        width: '70%',
        padding: 20,
        paddingLeft: 30,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 20
    },
    message_left_text: {
        color: colors.primary
    },
    message_right: {
        alignSelf: 'flex-end',
        right: -10,
        marginTop: 10,
        marginBottom: 10,
        width: '70%',
        padding: 20,
        paddingRight: 30,
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        borderRadius: 20
    },
    message_right_text: {
        color: colors.white
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user,
    chatPreviews: state.chat.previews
})
export default connect(mapStateToProps, { set_banner })(Message);