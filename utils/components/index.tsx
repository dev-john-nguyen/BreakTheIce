import React from 'react';
import { View, Pressable, StyleProp, Text, ActivityIndicator } from 'react-native';
import { colors, button_styles, underline_header_styles } from '../styles';
import { SvgXml } from 'react-native-svg';
import { settingSvg, editSvg, airplaneSvg, saveSvg, portraitSvg, plusSvg, minusSvg } from '../svgs';
import { Feather } from '@expo/vector-icons';

export const SettingsSvgHeader = ({ pressed }: { pressed: boolean }) => (
    <SvgXml xml={settingSvg} width='30' height='30' fill={pressed ? colors.secondary : colors.white}
        style={{ right: 10 }} />
)

export const SettingsSvg = ({ styles }: { styles?: StyleProp<any> }) => (
    <SvgXml xml={settingSvg} width='30' height='30' fill={colors.primary} style={styles} />
)

export const EditSvg = ({ styles, pressed }: { styles?: StyleProp<any>, pressed?: boolean }) => (
    <SvgXml xml={editSvg} width='30' height='30' fill={pressed ? colors.white : colors.primary} style={styles} />
)

export const SaveSvg = ({ styles, pressed }: { styles?: StyleProp<any>, pressed?: boolean }) => (
    <SvgXml xml={saveSvg} width='30' height='30' fill={pressed ? colors.secondary : colors.white} style={styles} />
)

export const PlusSvg = ({ styles, pressed }: { styles?: StyleProp<any>, pressed?: boolean }) => (
    <SvgXml xml={plusSvg} width='30' height='30' fill={pressed ? colors.secondary : colors.white} style={styles} />
)

export const MinusSvg = ({ styles, onPress }: { styles?: StyleProp<any>, onPress: () => void }) => (
    <Pressable
        style={styles}
        onPress={onPress}
    >
        {({ pressed }) => (
            <SvgXml xml={minusSvg} width='30' height='30' fill={pressed ? colors.greyRed : colors.darkRed} />
        )}
    </Pressable>
)

export const AirplaneSvg = ({ styles }: { styles?: StyleProp<any> }) => (
    <SvgXml xml={airplaneSvg} width='20' height='20' fill={colors.primary} style={styles} />
)

export const PortraitSvg = ({ styles, pressed }: { styles?: StyleProp<any>, pressed?: boolean }) => (
    <SvgXml xml={portraitSvg} width='30' height='30' fill={pressed ? colors.white : colors.primary} style={styles} />
)


export const Icon = ({ type, size, color, pressColor, onPress, style }: { type: string, size: number, color: string, pressColor?: string, onPress?: () => void, style?: StyleProp<any> }) => (
    <Pressable onPress={onPress} style={style}>
        {({ pressed }) => <Feather name={type} size={size} color={pressed ? pressColor : color} />}
    </Pressable>
)

interface CustomButtonProps {
    text: string;
    onPress?: () => void;
    type: "primary" | "secondary" | "white_outline" | "red_outline" | "disabled";
    moreStyles?: StyleProp<any>;
    indicatorColor?: string | false;
    size?: 'small' | 'regular'
}

//buttons
export const CustomButton = ({ text, onPress, type, moreStyles, indicatorColor, size }: CustomButtonProps) => {

    const { pressed, unpressed } = button_styles(size, type)

    const handlePressableStyle = (props: { pressed: boolean }) => [props.pressed ? pressed.button : unpressed.button, moreStyles]

    return <Pressable
        disabled={indicatorColor ? true : false}
        onPress={onPress}
        style={handlePressableStyle}
    >
        {(props) => (
            <View style={{ flexDirection: 'row' }}>
                {indicatorColor ? <ActivityIndicator size='small' color={indicatorColor} /> : <Text style={props.pressed ? pressed.text : unpressed.text}>{text}</Text>}
            </View>
        )}
    </Pressable>
}

export const UnderlineHeader = ({ text, styles }: { text: string, styles?: StyleProp<any> }) => (
    <View style={[underline_header_styles.section, styles]}>
        <View style={underline_header_styles.container}>
            <Text style={underline_header_styles.text}>{text}</Text>
            <View style={underline_header_styles.underline} />
        </View>
    </View>
)