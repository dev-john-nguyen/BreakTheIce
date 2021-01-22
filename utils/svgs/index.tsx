import React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleProp } from 'react-native';

const backgroundSvg = `<svg viewBox="0 0 414 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.5 23L0 7.95598V80H414V45.2201V1L381.5 23L341.263 13.4214L299.699 7.95597L258.135 1L246.103 13.4214H209.461L190.32 1L141.646 7.95597L130.708 13.4214L100.082 7.95597L76.5654 1L64.5337 7.95597H43.7516L23.5 23Z" fill="#26BAEE" fill-opacity="0.5" stroke="#26BAEE"/>
</svg>`

export const BottomNavBackground = ({ style, height, width }: { style: StyleProp<any>, height: string, width: number }) => (
    <SvgXml xml={backgroundSvg} height={height} width={width} style={style} preserveAspectRatio='none' />
)
