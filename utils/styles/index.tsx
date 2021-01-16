import { StyleSheet, Dimensions, StyleProp } from 'react-native'

//colors
export const colors = {
    primary: '#28DF99',
    secondary: '#99F3BD',
    tertiary: '#d2f6c5',
    quaternary: '#f6f7d4',
    white: '#ffffff',
    red: '#ff4646',
    lightRed: '#ff8585',
    greyRed: '#ef4f4f',
    darkRed: '#c70039',
    darkGreen: '#16c79a',
    lightGrey: '#dddddd',
    black: '#1a1c20'
}

//font styles
export const fontStyles = StyleSheet.create({
    small: {
        fontSize: 10
    },
    medium: {
        fontSize: 12
    },
    large: {
        fontSize: 14
    }
})

//base styles
export const emptyStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        color: colors.primary
    }
})

//profileSvg

export const profileStyles = StyleSheet.create({
    container: {
        position: 'relative'
    },
    friend: {
        position: 'absolute',
        right: -5
    },
    friend_small: {
        position: 'absolute',
        right: -5,
        top: -2
    }
})

//buttons
const buttonBase: StyleProp<any> = {
    borderRadius: 20,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 2,
    maxHeight: 40,
    alignItems: 'center',
}

export const buttonsStyles = StyleSheet.create({
    button_primary: {
        ...buttonBase,
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    button_primary_text: {
        color: colors.white,
        fontSize: 12
    },
    button_primary_pressed: {
        ...buttonBase,
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
    },
    button_secondary: {
        ...buttonBase,
        borderColor: colors.primary,
    },
    button_secondary_pressed: {
        ...buttonBase,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    button_secondary_text: {
        fontSize: 12,
        color: colors.primary
    },
    button_secondary_text_pressed: {
        fontSize: 12,
        color: colors.white,
        borderColor: colors.white
    },
    button_white_outline: {
        ...buttonBase,
        borderColor: colors.white
    },
    button_white_outline_pressed: {
        ...buttonBase,
        borderColor: colors.white,
        backgroundColor: colors.white
    },
    button_white_outline_text: {
        fontSize: 12,
        color: colors.white
    },
    button_white_outline_text_pressed: {
        fontSize: 12,
        color: colors.primary
    },
    button_disabled: {
        ...buttonBase,
        borderColor: colors.lightGrey,
        backgroundColor: colors.lightGrey
    },
    button_disabled_text: {
        fontSize: 12,
        color: colors.white
    },
    button_red_outline: {
        ...buttonBase,
        borderColor: colors.red
    },
    button_red_outline_pressed: {
        ...buttonBase,
        backgroundColor: colors.lightRed,
        borderColor: colors.lightRed
    },
    button_red_outline_text: {
        color: colors.red,
        fontSize: 12
    },
    button_red_outline_text_pressed: {
        color: colors.white,
        fontSize: 12
    },
})

const ListContainerButtonBase = {
    borderRadius: 20,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 2
}

//list containers
export const ListContainerStyle = (color: string, backgroundColor?: string) => StyleSheet.create({
    container: {
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderBottomColor: colors.primary,
        borderTopColor: colors.primary,
        marginTop: 20,
        position: 'relative',
    },
    content: {
        flexDirection: 'row',
        backgroundColor: backgroundColor ? backgroundColor : undefined,
        paddingLeft: 30,
        paddingRight: 10,
        paddingTop: 20,
    },
    topLeft: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    profile_section: {
        flex: .5,
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 130,
        paddingBottom: 10
    },
    topLeft_text: {
        fontSize: 8,
        color: color
    },
    profile_section_text: {
        bottom: 5
    },
    username: {
        marginTop: 15,
        fontSize: 16,
        color: color,
        textAlign: 'center',
        overflow: 'visible'
    },
    age: {
        fontSize: 12,
        color: color,
        textAlign: 'center'
    },
    content_section: {
        flex: 1,
        justifyContent: 'space-evenly',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 10,
        alignSelf: 'center'
    },
    content_section_text: {
        fontSize: 12,
        color: color,
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center'
    },
    content_section_small: {
        alignSelf: 'flex-end',
        flexDirection: 'row'
    },
    content_section_small_text: {
        fontSize: 8,
        color: colors.secondary,
        margin: 5
    },
    content_section_buttons: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    content_section_button_primary: {
        ...ListContainerButtonBase,
        backgroundColor: colors.primary,
        borderColor: colors.primary
    },
    content_section_button_primary_pressed: {
        ...ListContainerButtonBase,
        backgroundColor: colors.secondary,
        borderColor: colors.secondary
    },
    content_section_button_primary_text: {
        color: colors.white,
        fontSize: 12
    },
    content_section_button_secondary: {
        ...ListContainerButtonBase,
        borderColor: colors.primary,
        marginLeft: 10
    },
    content_section_button_secondary_pressed: {
        ...ListContainerButtonBase,
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        marginLeft: 10
    },
    content_section_button_secondary_text: {
        color: colors.primary,
        fontSize: 12
    },
    content_section_button_secondary_text_pressed: {
        color: colors.white,
        fontSize: 12
    },
})