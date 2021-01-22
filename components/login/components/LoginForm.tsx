import React, { useState } from 'react';
import { TextInput, Text, StyleProp, View, Pressable } from 'react-native';
import { colors } from '../../../utils/styles';
import { CustomButton } from '../../../utils/components';
import { SigninDispatchActionProps } from '../../../services/signin/types';

interface LoginForm {
    login_user: SigninDispatchActionProps['login_user'];
    renderSignup: () => void;
    styles: StyleProp<any>;
}

export default ({ login_user, renderSignup, styles }: LoginForm) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [signup, setSignup] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);


    const handleLogin = () => {
        setLoading(true);
        login_user(email, password)
            .then(success => {
                if (!success) {
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    return (
        <>
            <TextInput
                style={styles.text_input}
                placeholder="email"
                textContentType="emailAddress"
                onChangeText={(text) => setEmail(text)}
                autoCompleteType='off'
                autoCapitalize='none'
            />
            <TextInput
                style={styles.text_input}
                placeholder="password"
                onChangeText={(text) => setPassword(text)}
                autoCompleteType='password'
                autoCapitalize='none'
                secureTextEntry
            />

            <CustomButton type='primary' text='Login' onPress={handleLogin} moreStyles={{ marginTop: 20 }} indicatorColor={loading && colors.white} />


            <CustomButton type='secondary' text='Sign Up' onPress={renderSignup} moreStyles={{ marginTop: 10 }} />
        </>
    )
}