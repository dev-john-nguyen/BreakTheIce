import React, { useState, useEffect, useRef } from 'react';
import { View, Picker, StyleSheet, Animated, Keyboard, Pressable } from 'react-native';
import { interviewKeys, likesQuestions, familyQuestions, carrerQuestions, valuesQuestions } from '../../settings/components/profile/components/utils';
import { InterviewProps } from '../../../services/user/types';
import { BodyText, CustomInput, CustomButton, HeaderText } from '../../utils';
import { colors, normalize, dropShadowLight } from '../../utils/styles';
import { introStyles } from './utils';

interface QuestionProps {
    onNext: () => void;
    setInterviewVals: (interviewVals: InterviewProps) => void;
    interviewVals: InterviewProps
}

export default ({ onNext, setInterviewVals, interviewVals }: QuestionProps) => {
    const [intro, setIntro] = useState(true)
    const [qStep, setQStep] = useState(0)
    const fadeAmin = useRef(new Animated.Value(0)).current
    var mount = useRef<boolean>()

    useEffect(() => {
        mount.current = true;
        Animated.timing(fadeAmin, {
            delay: 5000,
            toValue: 1,
            duration: 2000,
            useNativeDriver: false
        }).start(() => {
            mount && setIntro(false)
        })

        return () => {
            mount.current = false;
        }
    }, [])

    const handleOnQuestionValueChange = (question: string) => {
        const curKey = interviewKeys[qStep];
        setInterviewVals({
            ...interviewVals,
            [curKey]: [question, interviewVals[curKey][1]]
        })
    }

    const handleNext = () => {
        if (qStep < (interviewKeys.length - 1)) {
            setQStep(qStep + 1)
        } else {
            onNext()
        }
    }

    const handlePrevious = () => {
        if (qStep > 0) {
            setQStep(qStep - 1)
        }
    }

    const renderQuestion = () => {

        const curKey = interviewKeys[qStep];

        var curQuestion = [];
        var headerTxt = '';

        switch (curKey) {
            case "likes":
                curQuestion = likesQuestions
                headerTxt = 'Interest Questions'
                break;
            case "family":
                headerTxt = 'Family Questions'
                curQuestion = familyQuestions
                break;
            case "career":
                headerTxt = 'Career Questions'
                curQuestion = carrerQuestions
                break;
            case "values":
                headerTxt = 'Values Questions'
                curQuestion = valuesQuestions
                break;
        }

        if (curQuestion.length < 1) {
            console.log('no questions')
            return
        }


        return (
            <View style={styles.question_container}>
                <Pressable onPress={Keyboard.dismiss} style={styles.question_content}>
                    <HeaderText style={styles.header}>{headerTxt}</HeaderText>
                    <CustomInput
                        value={interviewVals[curKey][1]}
                        onChangeText={(text) => setInterviewVals({
                            ...interviewVals,
                            [curKey]: [interviewVals[curKey][0], text]
                        })}
                        placeholder='Answer question in less than 300 characters'
                        maxLength={300}
                        multiline={true}
                        style={[styles.input, dropShadowLight]}
                    />
                    <BodyText style={styles.question_text}>{interviewVals[curKey][0]}</BodyText>
                    <Picker
                        selectedValue={interviewVals[curKey][0]}
                        onValueChange={handleOnQuestionValueChange}
                        style={[styles.picker_container, dropShadowLight]}
                        itemStyle={styles.picker_item}
                    >
                        {curQuestion.map((question, index) => (
                            <Picker.Item label={question} value={question} key={index} />
                        ))}
                    </Picker>
                </Pressable>
                <View style={styles.question_buttons}>
                    <CustomButton
                        text='Previous'
                        type='white'
                        onPress={handlePrevious}
                        style={styles.button}
                    />


                    <CustomButton
                        text='Next'
                        type='primary'
                        onPress={handleNext}
                        style={styles.button}
                    />
                </View>
            </View>
        )
    }

    if (intro) return (
        <Animated.View style={[
            {
                opacity: fadeAmin.interpolate({
                    inputRange: [0, .5, 1],
                    outputRange: [1, .2, 0]
                }),
                flex: 1
            }
        ]}>
            <View style={styles.container}>
                <HeaderText style={introStyles.intro_header}>Next, Lets Get To Know A Little More About You!</HeaderText>
                <BodyText style={introStyles.intro_body}>Pick and choose what questions you want to answer or you can simply skip and do this later.</BodyText>
            </View>
        </Animated.View>
    )

    return (
        <View style={styles.container}>
            {renderQuestion()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    header: {
        fontSize: normalize(25),
        color: colors.primary,
        alignSelf: 'center'
    },
    question_container: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    question_content: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    question_buttons: {
        flex: .2,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start'
    },
    question_text: {
        fontSize: normalize(10),
        alignSelf: 'center'
    },
    picker_container: {
        width: '100%',
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: colors.white
    },
    picker_item: {
        fontSize: normalize(9),
        color: colors.black
    },
    input: {
        fontSize: normalize(12),
        alignSelf: 'stretch',
        backgroundColor: colors.white,
        borderRadius: 10,
        color: colors.black,
        minHeight: 100
    },
    button: {
        marginTop: 10
    },
})