import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, HeaderText, BodyText } from '../../../../utils';
import { colors, normalize, dropShadowListContainer } from '../../../../utils/styles';
import Empty from '../../../../utils/components/Empty';
import { InterviewProps } from '../../../../../services/user/types';
import { isEmpty } from 'lodash';


export interface InterviewComProps {
    showProfile: () => void;
    interview: InterviewProps;
}

type InterviewKeys = keyof InterviewProps

const interviewKeys: InterviewKeys[] = ['likes', 'career', 'family', 'values']

export default ({ showProfile, interview }: InterviewComProps) => {
    return (
        <View style={styles.container}>
            <View style={{ flex: .80 }}>
                <View style={[styles.content, dropShadowListContainer]}>
                    <Empty style={styles.header}>Q&A</Empty>

                    <View style={styles.content_container}>
                        {
                            isEmpty(interview) ?
                                <HeaderText style={styles.empty}>Interview hasn't taken place yet.</HeaderText> :
                                interviewKeys.map((type, index) => {
                                    return (
                                        <View style={styles.interview_container} key={index}>
                                            <HeaderText style={styles.question_text} >{interview[type][0]}</HeaderText>
                                            <BodyText style={styles.answer_text} >{interview[type][1]}</BodyText>
                                        </View>
                                    )
                                })
                        }
                    </View>

                    <Icon type='chevrons-left' color={colors.primary} size={30} pressColor={colors.secondary} onPress={showProfile} style={{ position: 'absolute', left: 10, top: 10 }} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    header: {
        flex: .1
    },
    content: {
        flex: 1,
        margin: 20,
        backgroundColor: colors.white,
        padding: 10,
        borderRadius: 10
    },
    content_container: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    interview_container: {
    },
    empty: {
        alignSelf: 'center',
        color: colors.primary
    },
    question_text: {
        fontSize: normalize(10),
        color: colors.primary,
        marginBottom: 5
    },
    answer_text: {
        fontSize: normalize(8),
        color: colors.secondary,
        marginLeft: 5,
        lineHeight: 15
    }
})