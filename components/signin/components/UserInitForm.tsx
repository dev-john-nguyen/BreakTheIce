import React, { useState } from 'react';
import { StyleSheet, View, Picker } from 'react-native';
import { colors } from '../../../utils/styles';
import { CustomButton, CustomInput, BodyText, UnderlineHeader } from '../../../utils/components';
import { SigninDispatchActionProps } from '../../../services/signin/types';
import { regexName, regexUsername } from '../../../utils/variables';
import { validate_form_values } from '../../../services/signin/actions';

interface SignUpFormProps {
    init_user: SigninDispatchActionProps['init_user'];
}

const ageArr = new Array(100).fill(null)

const usernameParams = [
    'username has to be 8-20 characters long',
    'no _ or . at the beginning',
    'no __ or _. or ._ or .. inside',
    'no _ or . at the end'
]

export default ({ init_user }: SignUpFormProps) => {
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = () => {
        setLoading(true)

        init_user({ username, name, age })
            .then((success) => {
                if (!success) setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <UnderlineHeader text='Complete Your Profile' styles={{ marginBottom: 20 }} />

                <View style={styles.params_container}>
                    <BodyText
                        text='username parameters'
                        styles={styles.params_header_text}
                    />
                    {usernameParams.map((param, index) => (
                        <BodyText
                            key={index}
                            text={'- ' + param}
                            styles={styles.params_text}
                        />
                    ))}
                </View>


                <View style={styles.text_input_container}>
                    <BodyText
                        text='Username:'
                        styles={styles.label}
                    />
                    <CustomInput
                        styles={styles.text_input}
                        placeholder="username"
                        onChangeText={(text) => setUsername(text)}
                        maxLength={100}
                        value={username}
                        autoCapitalize='none'
                    />
                </View>

                <View style={styles.text_input_container}>
                    <BodyText
                        text='Name:'
                        styles={styles.label}
                    />
                    <CustomInput
                        styles={styles.text_input}
                        placeholder="name"
                        textContentType="name"
                        onChangeText={(text) => setName(text)}
                        maxLength={100}
                        value={name}
                        autoCapitalize='none'
                    />
                </View>

                <View style={styles.age_container}>
                    <BodyText
                        text='Age:'
                        styles={styles.label}
                    />
                    <Picker
                        enabled={false}
                        selectedValue={age}
                        onValueChange={(num) => setAge(parseInt(num))}
                        style={styles.picker}
                        itemStyle={styles.picker_item}
                    >
                        {ageArr.map((age, index) => <Picker.Item key={index} label={index.toString()} value={index} />)}
                    </Picker>
                </View>
                <CustomButton type='primary' text='Submit' onPress={handleSubmit} indicatorColor={loading && colors.white} moreStyles={{ fontSize: 20 }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        width: '80%',
    },
    text_input: {
        flex: 1,
        fontSize: 12,
        borderBottomColor: colors.primary,
        padding: 10,
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    text_input_container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    age_container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    label: {
        fontSize: 12,
        color: colors.primary,
        marginRight: 20,
    },
    picker: {
        width: 100,
        height: 100,
    },
    picker_item: {
        fontSize: 12,
        height: 100,
    },
    err_msg: {
        fontSize: 12,
        color: colors.red,
        alignSelf: 'center',
        marginBottom: 10
    },
    params_container: {
        marginBottom: 10
    },
    params_text: {
        fontSize: 10,
        color: colors.secondary,
        marginBottom: 2
    },
    params_header_text: {
        fontSize: 12,
        color: colors.primary,
        marginBottom: 5
    }
})