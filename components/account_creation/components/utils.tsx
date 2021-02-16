import { StyleSheet } from 'react-native';
import { normalize, colors } from '../../utils/styles';
import { windowHeight } from '../../../utils/variables';


export const introStyles = StyleSheet.create({
    intro_header: {
        fontSize: normalize(25),
        color: colors.primary,
        marginTop: (windowHeight / 20)
    },
    intro_body: {
        fontSize: normalize(12),
        color: colors.secondary,
        margin: 20
    },
})
