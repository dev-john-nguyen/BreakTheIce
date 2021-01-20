import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { CustomButton } from '../../../utils/components';
import { colors } from '../../../utils/styles';

export default ({ sendChangePasswordEmail }: { sendChangePasswordEmail: (email: string) => void }) => {
    const [email, setEmail] = useState<string>('')

    const handleChangeText = (text: string) => setEmail(text)
    const onSend = () => {
        sendChangePasswordEmail(email)
    }

    return (
        <View style={styles.container}>
            <View style={styles.text_input_container}>
                <Text style={styles.text_input_label}>Email:</Text>
                <TextInput
                    placeholder='email'
                    value={email}
                    onChangeText={handleChangeText}
                    autoCompleteType='email'
                    keyboardType='email-address'
                    textContentType='emailAddress'
                    style={styles.text_input} />
            </View>
            <CustomButton onPress={onSend} type='primary' text='Send' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20
    },
    text_input_container: {
        margin: 10
    },
    text_input: {
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 10
    },
    text_input_label: {
        fontSize: 10,
        color: colors.primary,
        marginBottom: 5,
        marginLeft: 2
    },
    text_input_info: {
        fontSize: 8,
        color: colors.primary,
        marginBottom: 5,
        marginLeft: 4,
        alignItems: 'center'
    },
})