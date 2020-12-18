import React from 'react';
import { View, Text } from 'react-native';
import { profileStyles, colors } from '../styles';
import { SvgXml } from 'react-native-svg';
import { userDefaultSvg, linkSvg } from '../svgs';

export const ProfileImg = ({ friend }: { friend: boolean }) => (
    <View style={profileStyles.container}>
        <SvgXml xml={userDefaultSvg} width='50' height='50' fill={colors.primary} />
        {friend && <SvgXml xml={linkSvg} width='12' height='12' fill={colors.primary} style={profileStyles.friend} />}
    </View>
)