import React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleProp } from 'react-native';
import { colors } from '../styles';

const bottomSvg = `<svg width="414" height="79" viewBox="0 0 414 79" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M414 79L414 11.7598L388.604 5.26751C375.02 1.79468 360.857 1.21738 347.035 3.57309L315.507 8.9465C304.578 10.8091 293.416 10.8414 282.477 9.04223L243.005 2.55014C232.731 0.860419 222.257 0.785458 211.96 2.32797L163.587 9.57467C153.915 11.0236 144.082 11.0459 134.404 9.64069L83.7382 2.28492C73.3116 0.771152 62.7113 0.914629 52.3295 2.71004L5.87832e-06 11.7599L0 79L414 79Z" fill=${colors.primary} stroke=${colors.secondary}/>
</svg>`

const topSvg = `<svg width="414" height="80" viewBox="0 0 414 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 1.5752L0.255829 68.8149L25.6759 75.2105C39.2734 78.6317 53.4384 79.1551 67.2513 76.7468L98.7587 71.2534C109.68 69.3493 120.842 69.2745 131.788 71.032L171.285 77.3739C181.565 79.0245 192.039 79.0596 202.33 77.4779L250.676 70.0473C260.342 68.5615 270.174 68.5019 279.858 69.8702L330.551 77.0331C340.984 78.5072 351.583 78.3234 361.958 76.4885L414.253 67.2397L413.997 4.64348e-05L0 1.5752Z" fill=${colors.primary} stroke=${colors.secondary}/>
</svg>
`

const messageCurvePrimary = (color: string) => `<svg viewBox="0 0 47 67" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M46 1V66.5H1C1 65.1193 2.13892 64.0071 3.51783 63.9366C38.7627 62.1339 42.254 22.3358 46 1Z" fill=${color} stroke=${color} />
</svg>
`

export const BottomNavBackground = ({ style, height, width }: { style: StyleProp<any>, height: string, width: string }) => (
    <SvgXml xml={bottomSvg} height={height} width={width} style={style} preserveAspectRatio='none' />
)

export const TopProfileBackground = ({ style, height, width }: { style: StyleProp<any>, height: string, width: string }) => (
    <SvgXml xml={topSvg} height={height} width={width} style={style} preserveAspectRatio='none' />
)

export const MessageCurve = ({ style, color }: { style: StyleProp<any>, color: string }) => (
    <SvgXml xml={messageCurvePrimary(color)} style={style} preserveAspectRatio='none' />
)
