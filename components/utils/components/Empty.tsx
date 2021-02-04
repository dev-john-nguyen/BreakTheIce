import React from 'react';
import { StyleSheet, StyleProp } from 'react-native'
import { UnderlineHeader } from '..';
import { colors } from '../styles';

export default ({ style, children }: { style?: StyleProp<any>, children: string }) => (
    <UnderlineHeader
        textStyle={styles.underline_header_text}
        style={style}>{children}</UnderlineHeader>
)

const styles = StyleSheet.create({
    underline_header_text: {
        color: colors.primary,
        fontSize: 20
    },
    underline_header_underline: {
        backgroundColor: colors.tertiary
    },
})