import React, { useState } from 'react';
import { View, Picker, StyleSheet } from 'react-native';
import { likesQuestions, carrerQuestions, familyQuestions, valuesQuestions } from './utils'
import { CustomInput, CustomButton, BodyText, HeaderText } from '../../../../utils';
import { colors } from '../../../../utils/styles';
import { InterviewProps } from '../../../../../services/user/types';

interface QuestionProps {
    setInterviewVals: (interview: InterviewProps) => void;
    interviewVals: InterviewProps;
}

type InterviewKeys = keyof InterviewProps

const interviewKeys: InterviewKeys[] = ['likes', 'career', 'family', 'values']

export default (props: QuestionProps) => {
    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <HeaderText style={styles.header_text}>Questions</HeaderText>
                <BodyText style={styles.header_sub_text}>so people can get to know you better.</BodyText>
            </View>

            {
                interviewKeys.map((type, index) => {
                    let questionsArr: string[] = [];

                    switch (type) {
                        case 'likes':
                            questionsArr = likesQuestions
                            break;
                        case 'career':
                            questionsArr = carrerQuestions
                            break;
                        case 'family':
                            questionsArr = familyQuestions
                            break;
                        case 'values':
                            questionsArr = valuesQuestions
                            break
                    }

                    return (
                        <View style={styles.question_container} key={index}>
                            <Picker
                                selectedValue={props.interviewVals[type][0]}
                                onValueChange={(Q) => props.setInterviewVals({
                                    ...props.interviewVals,
                                    [type]: [Q, props.interviewVals[type][1]]
                                })}
                                style={styles.picker_container}
                                itemStyle={styles.picker_item}
                            >
                                {questionsArr.map((question, index) => (
                                    <Picker.Item label={question} value={question} key={index} />
                                ))}
                            </Picker>

                            <BodyText style={styles.question_text}>{props.interviewVals[type][0]}</BodyText>
                            <CustomInput
                                value={props.interviewVals[type][1]}
                                onChangeText={(text) => props.setInterviewVals({
                                    ...props.interviewVals,
                                    [type]: [props.interviewVals[type][0], text]
                                })}
                                placeholder={props.interviewVals[type][1]}
                                maxLength={300}
                                multiline={true}
                                style={styles.input}
                            />

                        </View>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 5,
        marginRight: 5,
        width: '90%',
        alignSelf: 'center'
    },
    header: {
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    header_text: {
        fontSize: 14,
        marginBottom: 5
    },
    header_sub_text: {
        fontSize: 12
    },
    question_container: {
        marginBottom: 20
    },
    question_text: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.tertiary,
        borderRadius: 5
    },
    picker_container: {
        width: '100%',
        borderRadius: 100,
        alignSelf: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.tertiary
    },
    picker_item: {
        fontSize: 12
    }
})