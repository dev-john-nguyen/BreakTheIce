import React from 'react';
import { View, Picker, StyleSheet } from 'react-native';
import { likesQuestions, carrerQuestions, familyQuestions, valuesQuestions, interviewKeys } from './utils'
import { CustomInput, BodyText, HeaderText } from '../../../../utils';
import { colors, normalize, dropShadowListContainer } from '../../../../utils/styles';
import { InterviewProps } from '../../../../../services/user/types';

interface QuestionProps {
    setInterviewVals: (interview: InterviewProps) => void;
    interviewVals: InterviewProps;
}

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
                                style={[styles.picker_container, dropShadowListContainer]}
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
        marginBottom: 50
    },
    header_text: {
        fontSize: normalize(15),
        marginBottom: 10,
        color: colors.black
    },
    header_sub_text: {
        fontSize: normalize(10),
        color: colors.black
    },
    question_container: {
        marginBottom: 50
    },
    question_text: {
        fontSize: normalize(10),
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 10
    },
    picker_container: {
        width: '100%',
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 20,
        backgroundColor: colors.white
    },
    picker_item: {
        fontSize: normalize(10)
    }
})