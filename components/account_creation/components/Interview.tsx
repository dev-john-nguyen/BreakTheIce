import React, { useState, useEffect, useRef } from 'react';
import { View, Picker, StyleSheet, Animated, KeyboardAvoidingView, Keyboard } from 'react-native';
import { interviewKeys, likesQuestions, familyQuestions, carrerQuestions, valuesQuestions } from '../../settings/components/profile/components/utils';
import { InterviewProps } from '../../../services/user/types';
import { BodyText, CustomInput, CustomButton, HeaderText, UnderlineHeader } from '../../utils';
import { colors, normalize, dropShadowLight, dropShadow } from '../../utils/styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { windowHeight } from '../../../utils/variables';
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

    useEffect(() => {
        Animated.timing(fadeAmin, {
            delay: 5000,
            toValue: 1,
            duration: 2000,
            useNativeDriver: false
        }).start(() => {
            setIntro(false)
        })
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
            <>
                <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center' }} behavior='padding' >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <HeaderText style={styles.header}>{headerTxt}</HeaderText>
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
                        <CustomInput
                            value={interviewVals[curKey][1]}
                            onChangeText={(text) => setInterviewVals({
                                ...interviewVals,
                                [curKey]: [interviewVals[curKey][0], text]
                            })}
                            placeholder={interviewVals[curKey][0]}
                            maxLength={300}
                            multiline={true}
                            style={[styles.input, dropShadowLight]}
                        />
                    </TouchableWithoutFeedback>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <CustomButton
                            text='Previous'
                            type='secondary'
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
                </KeyboardAvoidingView>
            </>
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
    picker_container: {
        width: '100%',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: (windowHeight / 22),
    },
    picker_item: {
        fontSize: normalize(9),
        color: colors.black
    },
    input: {
        fontSize: normalize(12),
        marginTop: (windowHeight / 22),
        alignSelf: 'stretch',
        backgroundColor: colors.white,
        borderRadius: 10,
        color: colors.black,
        minHeight: 100
    },
    button: {
        marginTop: (windowHeight / 22),
        alignSelf: 'stretch'
    },
})