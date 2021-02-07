import React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleProp } from 'react-native';
import { colors } from '../styles';

const bottomSvg = `<svg viewBox="0 0 416 69" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M415.5 68.5L415.5 1.25985L379.749 7.86166C379.253 7.95336 378.745 7.9693 378.244 7.90897L323.531 1.32377C323.178 1.28128 322.821 1.27657 322.467 1.30971L251.497 7.95345C251.167 7.98441 250.834 7.98234 250.503 7.94729L188.005 1.31346C187.669 1.27782 187.331 1.27628 186.995 1.30888L118.587 7.94308C118.197 7.98089 117.804 7.97276 117.416 7.91884L70.1247 1.34667C69.7099 1.28902 69.2895 1.28372 68.8733 1.33088L37.047 4.93801C36.6834 4.97921 36.3164 4.98039 35.9526 4.94151L1.50001 1.25985L1.5 68.5L415.5 68.5Z" fill="#26BAEE" stroke="#73D2F3"/>
<path d="M201.5 44.5L225.302 24.9826C225.863 24.522 225.762 23.635 225.111 23.313L180 1" stroke="rgba(${colors.white_rgb}, .6)"/>
<path d="M315.5 31L307.298 55.6055C307.131 56.1078 307.384 56.6535 307.875 56.8502L337 68.5" stroke="rgba(${colors.white_rgb}, .6)"/>
<path d="M1 40.5L93.2201 22.7464C94.0593 22.5848 94.926 22.6411 95.7373 22.9098L171.893 48.1335C172.621 48.3746 173.395 48.445 174.155 48.3394L229.907 40.5825C230.301 40.5277 230.687 40.426 231.057 40.2796L274.574 23.0643C275.503 22.6966 276.522 22.6159 277.498 22.8328L355.703 40.2117C356.553 40.4006 357.438 40.3642 358.269 40.1061L415 22.5" stroke="rgba(${colors.white_rgb}, .6)"/>
<path d="M117.5 68.5L93.0478 45.4319C91.7764 44.2325 91.2237 42.4563 91.5899 40.7473L95.5 22.5" stroke="rgba(${colors.white_rgb}, .6)"/>
</svg>
`

const topSvg = `<svg viewBox="0 0 414 71" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.255829 -1.95562e-05L0.255836 68.8147L50.395 62.0812C50.7968 62.0273 51.2038 62.0224 51.6068 62.0667L112.454 68.7547C112.817 68.7946 113.183 68.7946 113.546 68.7547L174.288 62.0783C174.76 62.0264 175.238 62.0421 175.706 62.1249L213.068 68.7381C213.355 68.789 213.647 68.8147 213.939 68.8147L273.136 68.8147C273.378 68.8147 273.621 68.7971 273.861 68.7619L319.267 62.1074C319.753 62.0362 320.247 62.037 320.733 62.1097L365.132 68.7596C365.377 68.7963 365.624 68.8147 365.872 68.8147L413.997 68.8147L413.997 -0.000148857L0.255829 -1.95562e-05Z" fill="#26BAEE" stroke="#73D2F3"/>
<path d="M0 36.5H50.7221C51.5606 36.5 52.3855 36.7108 53.1212 37.1131L81.0294 52.3754C82.8235 53.3566 85.0342 53.1464 86.6112 51.8447L113.747 29.4473C114.861 28.5277 116.318 28.135 117.743 28.3701L214.506 44.336C215.162 44.4443 215.833 44.4206 216.48 44.2665L299.807 24.4036C300.903 24.1422 302.056 24.259 303.078 24.7351L343.759 43.6889C344.88 44.211 346.154 44.2994 347.336 43.9371L414 23.5" stroke="rgba(${colors.white_rgb}, .6)"/>
<path d="M36 36.5L55.1387 19.2486C55.5924 18.8396 55.5767 18.123 55.1055 17.7344L33 -0.5" stroke="rgba(${colors.white_rgb}, .6)"/>
<path d="M69 45.5L62 64" stroke="rgba(${colors.white_rgb}, .6)"/>
<path d="M126.5 -0.5L114.5 29" stroke="rgba(${colors.white_rgb}, .6)"/>
<path d="M220.5 43.5L200.813 58.0308C200.212 58.4743 200.292 59.3959 200.96 59.7298L219.5 69" stroke="rgba(${colors.white_rgb}, .6)"/>
<path d="M301.5 24L311.513 15.9122C313.275 14.4896 313.86 12.0608 312.941 9.99182L308.5 0" stroke="rgba(${colors.white_rgb}, .6)"/>
<path d="M367.5 37.5L388.424 57.4734C388.938 57.9637 388.791 58.8182 388.144 59.109L365 69.5" stroke="rgba(${colors.white_rgb}, .6)"/>
<path d="M176 38L201.916 20.9867C201.999 20.9319 202.09 20.89 202.186 20.8622L223.659 14.6374C224.518 14.3885 224.643 13.2238 223.857 12.7978L198.396 -1" stroke="rgba(${colors.white_rgb}, .6)"/>
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
