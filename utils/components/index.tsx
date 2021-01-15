import React from 'react';
import { View, Pressable, StyleProp, Text, ActivityIndicator } from 'react-native';
import { profileStyles, colors, buttonsStyles } from '../styles';
import { SvgXml } from 'react-native-svg';
import { userDefaultSvg, linkSvg, settingSvg, editSvg, airplaneSvg, saveSvg, portraitSvg, plusSvg, minusSvg } from '../svgs';
import { Feather } from '@expo/vector-icons';

export const ProfileImg = ({ friend, fillColor }: { friend: boolean, fillColor?: string }) => (
    <View style={profileStyles.container}>
        <SvgXml xml={userDefaultSvg} width='50' height='50' fill={fillColor ? fillColor : colors.primary} />
        {friend && <SvgXml xml={linkSvg} width='12' height='12' fill={fillColor ? fillColor : colors.primary} style={profileStyles.friend} />}
    </View>
)

export const MapProfileImg = ({ friend }: { friend: boolean }) => (
    <View style={profileStyles.container}>
        <SvgXml xml={userDefaultSvg} width='25' height='25' fill={colors.primary} />
        {friend && <SvgXml xml={linkSvg} width='10' height='10' fill={colors.primary} style={profileStyles.friend_small} />}
    </View>
)

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


export const Icon = ({ type, size, color, pressColor, onPress, style }: { type: string, size: number, color: string, pressColor: string, onPress: () => void, style?: StyleProp<any> }) => (
    <Pressable onPress={onPress} style={style}>
        {({ pressed }) => <Feather name={type} size={size} color={pressed ? pressColor : color} />}
    </Pressable>
)

interface CustomButtonProps {
    text: string;
    onPress?: () => void;
    type: "primary" | "secondary" | "white_outline" | "red_outline" | "disabled";
    moreStyles?: StyleProp<any>;
    indicatorColor?: string | false
}

//buttons
export const CustomButton = ({ text, onPress, type, moreStyles, indicatorColor }: CustomButtonProps) => {

    const handlePressableStyles = ({ pressed }: { pressed: boolean }): StyleProp<any> => {
        var styles: StyleProp<any>;

        switch (type) {
            case 'disabled':
                styles = buttonsStyles.button_disabled
                break;
            case "secondary":
                styles = pressed ? buttonsStyles.button_secondary_pressed : buttonsStyles.button_secondary
                break;
            case "white_outline":
                styles = pressed ? buttonsStyles.button_white_outline_pressed : buttonsStyles.button_white_outline
                break;
            case "red_outline":
                styles = pressed ? buttonsStyles.button_red_outline : buttonsStyles.button_red_outline_pressed
                break;
            default:
                styles = pressed ? buttonsStyles.button_primary_pressed : buttonsStyles.button_primary
        }

        return [styles, moreStyles]
    }

    const renderText = ({ pressed }: { pressed: boolean }) => {
        var styles: StyleProp<any>;

        switch (type) {
            case 'disabled':
                styles = buttonsStyles.button_disabled_text
                break;
            case "secondary":
                styles = pressed ? buttonsStyles.button_secondary_text_pressed : buttonsStyles.button_secondary_text
                break;
            case "white_outline":
                styles = pressed ? buttonsStyles.button_white_outline_text_pressed : buttonsStyles.button_white_outline_text
                break;
            case "red_outline":
                styles = pressed ? buttonsStyles.button_red_outline_text : buttonsStyles.button_red_outline_text_pressed
                break;
            default:
                styles = buttonsStyles.button_primary_text
        }
        return (
            <View style={{ flexDirection: 'row' }}>
                {indicatorColor ? <ActivityIndicator size='small' color={indicatorColor} /> : <Text style={styles}>{text}</Text>}
            </View>
        )
    }

    return <Pressable
        disabled={indicatorColor ? true : false}
        onPress={onPress}
        style={handlePressableStyles}
    >
        {renderText}
    </Pressable>
}