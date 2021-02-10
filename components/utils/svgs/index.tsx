import React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleProp } from 'react-native';
import { colors } from '../styles';

const bottomSvg = `<svg viewBox="0 0 414 79" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M414 79L414 11.7598L388.604 5.26751C375.02 1.79467 360.857 1.21737 347.035 3.57309L315.507 8.94649C304.578 10.8091 293.416 10.8415 282.477 9.04223L243.005 2.55015C232.731 0.86042 222.257 0.78546 211.96 2.32797L163.587 9.57467C153.915 11.0236 144.082 11.0459 134.404 9.64069L83.7382 2.28491C73.3116 0.771149 62.7113 0.914627 52.3295 2.71004L5.87832e-06 11.7599L0 79L414 79Z" fill="#26BAEE" stroke="#73D2F3" stroke-width='2'/>
</svg>
`

const topSvg = `<svg viewBox="0 0 414 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 1.5752L0.255829 68.8149L25.6759 75.2105C39.2734 78.6317 53.4384 79.1551 67.2513 76.7468L98.7587 71.2535C109.68 69.3493 120.842 69.2745 131.788 71.032L171.285 77.3739C181.565 79.0245 192.039 79.0596 202.33 77.478L250.676 70.0473C260.342 68.5615 270.174 68.5019 279.858 69.8702L330.551 77.0331C340.984 78.5072 351.583 78.3234 361.958 76.4885L414.253 67.2397L413.997 4.64348e-05L0 1.5752Z" fill="#26BAEE" stroke="#73D2F3" stroke-width='2' />
</svg>`

const messageCurvePrimary = `<svg viewBox="0 0 49 67" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M48 1V66.5H3C-0.311457 64.5683 1.04535 58.7213 4.74243 57.7071C32.4996 50.0923 44.6719 19.9557 48 1Z" fill=${colors.primary} stroke=${colors.primary}/>
</svg>
`

const greyMessageCurve = `<svg viewBox="0 0 49 67" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1L1 66.5L46 66.5C49.3115 64.5683 47.9547 58.7213 44.2576 57.7071C16.5004 50.0923 4.3281 19.9557 1 1Z" fill=${colors.lightGrey} stroke=${colors.lightGrey} />
</svg>`

export const BottomNavBackground = ({ style, height, width }: { style: StyleProp<any>, height: string, width: string }) => (
    <SvgXml xml={bottomSvg} height={height} width={width} style={style} preserveAspectRatio='none' />
)

export const TopProfileBackground = ({ style, height, width }: { style: StyleProp<any>, height: string, width: string }) => (
    <SvgXml xml={topSvg} height={height} width={width} style={style} preserveAspectRatio='none' />
)

export const MessageCurve = ({ style, color }: { style: StyleProp<any>, color: 'primary' | 'grey' }) => (
    color === 'primary' ?
        <SvgXml xml={messageCurvePrimary} style={style} preserveAspectRatio='none' /> :
        <SvgXml xml={greyMessageCurve} style={style} preserveAspectRatio='none' />

)
