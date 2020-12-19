import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, Pressable, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ProfileImg } from '../../../utils/components';
import { colors, buttonsStyles } from '../../../utils/styles';
import { MessageScreenRouteProp, ChatStackNavigationProp } from '../../navigation/utils';
import { fireDb } from '../../../services/firebase';
import { ChatDb } from '../../../utils/variables';

interface MessageProps {
    route: MessageScreenRouteProp;
    navigation: ChatStackNavigationProp;
}
const Message = (props: MessageProps) => {
    const [userIds, setUsersIds] = useState<string[]>();

    const textMsg = [
        {
            uid: '1',
            username: 'nguyening20',
            message: "Hey! What's up? Its been a minute"
        },
        {
            uid: '2',
            username: 'Amber123',
            message: "Nothing much! Miss you. Lets freak soon."
        },
        {
            uid: '2',
            username: 'Amber123',
            message: "I'll blow you. We freak in that hot tub that one time. Man the way you put your dick inside me in that hot tub. It was crazy. I've never done anything like that before. Hopefully we can do it again soon..."
        },
        {
            uid: '1',
            username: 'nguyening20',
            message: "Oh yeah I remeber that. That was fun. Lets do it again."
        }
    ]

    //get users to differ between which message belows to who
    useEffect(() => {
        //check if params exists
        if (props.route.params) {
            console.log(props.route.params.usersInfo)
        }
        // //on mount fetch all the messages via firestore
        // fireDb.collection(ChatDb).doc()



        var usersIds: string[] = [];

        for (let i = 0; i < textMsg.length; i++) {
            usersIds.push(textMsg[i].uid);
        }

        var uniqueUserIds = usersIds.sort().filter(function (item: string, pos: number, ary: string[]) {
            return !pos || item != ary[pos - 1];
        });

        setUsersIds(uniqueUserIds)

    }, [])

    var renderTextMsgs;

    if (userIds) {
        renderTextMsgs = textMsg.map((text, index) => {
            if (text.uid === userIds[0]) {
                return (
                    <View key={index} style={styles.message_left}>
                        <Text style={styles.message_left_text}>{text.message}</Text>
                    </View>
                )
            } else {
                return (
                    <View key={index} style={styles.message_right}>
                        <Text style={styles.message_right_text}>{text.message}</Text>
                    </View>
                )
            }
        })
    }


    return (
        <View style={styles.container}>
            <View style={styles.profile_content}>
                <ProfileImg friend={true} />
                <Text style={styles.username}>Amber123</Text>
            </View>
            <ScrollView style={styles.messages}>
                {userIds ? renderTextMsgs : <ActivityIndicator />}
            </ScrollView>
            <KeyboardAvoidingView keyboardVerticalOffset={120} behavior={'padding'} style={styles.message_form}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.message_form_content}>
                        <ScrollView style={styles.message_form_input}>
                            <TextInput style={styles.message_form_input_text} multiline />
                        </ScrollView>
                        <Pressable style={buttonsStyles.button_white_outline}>
                            <Text style={buttonsStyles.button_white_outline_text}>Send</Text>
                        </Pressable>
                    </View>
                </ TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    message_form: {
        backgroundColor: colors.secondary
    },
    message_form_content: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: colors.secondary,
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
        borderColor: colors.white,
        maxHeight: 80
    },
    message_form_input_text: {
        color: colors.white
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
        flex: 1,
        marginTop: 20
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

export default Message;