import React, { useState } from 'react';
import { TextInput, StyleProp } from 'react-native';
import { colors } from '../../../utils/styles';
import { CustomButton } from '../../../utils/components';
import { SigninDispatchActionProps } from '../../../services/signin/types';

interface SignUpFormProps {
    signup_user: SigninDispatchActionProps['signup_user'];
    renderLogin: () => void;
    styles: StyleProp<any>
}

export default ({ signup_user, renderLogin, styles }: SignUpFormProps) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignUp = () => {
        setLoading(true);

        signup_user({ email, password, username, name, age })
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

    const renderLoginForm = () => renderLogin()

    return (
        <>
            <TextInput
                style={styles.text_input}
                placeholder="email"
                textContentType="emailAddress"
                onChangeText={(text) => setEmail(text)}
                autoCompleteType='email'
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
            <TextInput
                style={styles.text_input}
                placeholder="username"
                onChangeText={(text) => setUsername(text)}
                autoCompleteType='off'
                autoCapitalize='none'
            />
            <TextInput
                style={styles.text_input}
                placeholder="name"
                textContentType="name"
                onChangeText={(text) => setName(text)}
                autoCompleteType='name'
                autoCapitalize='none'
            />
            <TextInput
                style={styles.text_input}
                value={age.toString()}
                maxLength={3}
                placeholder="age"
                keyboardType='numeric'
                onChangeText={(text) => setAge(parseInt(text) ? parseInt(text) : 0)}
                autoCompleteType='off'
                autoCapitalize='none'
            />
            <CustomButton type='primary' text='Sign Up' onPress={handleSignUp} moreStyles={{ marginTop: 20 }} indicatorColor={loading && colors.white} />
            <CustomButton type='secondary' text='Login' onPress={renderLoginForm} moreStyles={{ marginTop: 10 }} />
        </>
    )
}