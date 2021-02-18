import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Picker, Animated, Keyboard } from 'react-native';
import { SigninDispatchActionProps } from '../../../services/signin/types';
import { UnderlineHeader, BodyText, CustomInput, CustomButton, HeaderText } from '../../utils';
import { ageArr } from '../../../utils/variables';
import { colors, normalize, dropShadowLight } from '../../utils/styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { introStyles } from './utils';

interface SignUpFormProps {
    init_user: SigninDispatchActionProps['init_user'];
    onNext: () => void;
}

const usernameParams = [
    'username has to be 8-20 characters long',
    'no _ or . at the beginning',
    'no __ or _. or ._ or .. inside',
    'no _ or . at the end'
]

export default ({ init_user, onNext }: SignUpFormProps) => {
    const [intro, setIntro] = useState(true)
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const fadeAmin = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(fadeAmin, {
            delay: 7000,
            toValue: 1,
            duration: 2000,
            useNativeDriver: false
        }).start(() => {
            setIntro(false)
        })
    }, [])

    const handleSubmit = () => {
        setLoading(true)

        init_user({ username, name, age })
            .then((success) => {
                if (success) {
                    return onNext()
                }
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    if (intro) return (
        <Animated.View style={[
            styles.container,
            {
                opacity: fadeAmin.interpolate({
                    inputRange: [0, .5, 1],
                    outputRange: [1, .2, 0]
                })
            }
        ]}>
            <HeaderText style={introStyles.intro_header}>Welcome! Lets Get Started By Initializing Your Account!</HeaderText>
            <BodyText style={introStyles.intro_body}>We'll need just a username, name, and your age. Once completed, you can't update your username.</BodyText>
        </Animated.View>
    )

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <HeaderText style={styles.header}>Account Information</HeaderText>
                <View style={styles.content}>
                    <View style={styles.params_container}>
                        <BodyText
                            style={styles.params_header_text}
                        >Username Requirements</BodyText>
                        {usernameParams.map((param, index) => (
                            <BodyText
                                key={index}
                                text={'- ' + param}
                                style={styles.params_text}
                            />
                        ))}
                    </View>


                    <View style={styles.text_input_container}>
                        <BodyText
                            text='Username:'
                            style={styles.label}
                        />
                        <CustomInput
                            style={styles.text_input}
                            placeholder="username123"
                            onChangeText={(text) => setUsername(text.toLowerCase())}
                            maxLength={100}
                            value={username}
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.text_input_container}>
                        <BodyText
                            text='Name:'
                            style={styles.label}
                        />
                        <CustomInput
                            style={styles.text_input}
                            placeholder="Keisha Smith"
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
                            style={styles.label}
                        />
                        <Picker
                            enabled={false}
                            selectedValue={age}
                            onValueChange={(num) => setAge(parseInt(num))}
                            style={[styles.picker, dropShadowLight]}
                            itemStyle={styles.picker_item}
                        >
                            {ageArr.map((age, index) => <Picker.Item key={index} label={index.toString()} value={index} />)}
                        </Picker>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {
                name.length > 0 && age > 0 && username.length > 0 && <CustomButton type='primary' text='Submit' onPress={handleSubmit} indicatorColor={loading && colors.white} style={styles.next_button} />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    next_button: {
        margin: 40,
        alignSelf: 'stretch',
    },
    header: {
        fontSize: normalize(25),
        color: colors.primary,
        alignSelf: 'center'
    },
    content: {
        width: '80%',
        marginTop: 50
    },
    text_input: {
        flex: 1,
        fontSize: normalize(12),
        backgroundColor: colors.white,
        color: colors.black,
        borderRadius: 10,
        padding: 10,
    },
    text_input_container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    age_container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    label: {
        fontSize: normalize(11),
        color: colors.primary,
        marginRight: 20,
    },
    picker: {
        width: 100,
        height: 100,
        backgroundColor: colors.white,
        borderRadius: 10,
    },
    picker_item: {
        fontSize: normalize(9),
        height: 100,
        color: colors.black
    },
    params_container: {
        marginBottom: 30
    },
    params_text: {
        fontSize: normalize(10),
        color: colors.secondary,
        marginBottom: 2
    },
    params_header_text: {
        fontSize: normalize(12),
        color: colors.primary,
        marginBottom: 10,
    }
})