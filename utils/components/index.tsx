import React from 'react';
import { View, Pressable, StyleProp } from 'react-native';
import { profileStyles, colors } from '../styles';
import { SvgXml } from 'react-native-svg';
import { userDefaultSvg, linkSvg, settingSvg, editSvg, airplaneSvg } from '../svgs';

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


export const EditSvg = ({ styles }: { styles?: StyleProp<any> }) => (
    <SvgXml xml={editSvg} width='30' height='30' fill={colors.primary} style={styles} />
)

export const AirplaneSvg = ({ styles }: { styles?: StyleProp<any> }) => (
    <SvgXml xml={airplaneSvg} width='20' height='20' fill={colors.primary} style={styles} />
)