import { StyleSheet, StyleProp } from 'react-native'


//colors
export const colors = {
    // primary: '#28DF99',
    // secondary: '#99F3BD',
    // tertiary: '#d2f6c5',
    // quaternary: '#f6f7d4',

    primary: '#26baee',
    primary_rgb: '38, 186, 238',
    secondary: '#73d2f3',
    secondary_rgb: '115, 210, 243',
    secondaryLight: '#e8f8fd',
    secondaryLightRgb: '232, 248, 253',
    secondaryMedium: '#abe4f8',
    secondaryMediumRgb: '171, 228, 248',
    tertiary: '#9fe8fa',
    tertiary_rgb: '159, 232, 250',
    lightWhite: '#fff4e0',
    lightWhite_rgb: '255, 244, 244',
    lightOrange: '#f58634',
    yellow: '#ffcc29',
    green: '#28DF99',

    white: '#ffffff',
    white_rgb: '255,255,255',
    red: '#ff4646',
    lightRed: '#ff8585',
    greyRed: '#ef4f4f',
    darkRed: '#c70039',
    darkGreen: '#16c79a',
    lightGrey: '#dddddd',
    black: '#1a1c20',
    blackLight: '#454a54',
    black_rgb: '26, 28, 32'
}

export const opacity_colors = {
    secondary_light: `rgba(${colors.secondary_rgb}, .1)`,
    secondary_medium: `rgba(${colors.secondary_rgb}, .5)`
}

export const drop_shadow: StyleProp<any> = {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
}

export const drop_shadow_light: StyleProp<any> = {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
}


//buttons
const buttonBase: StyleProp<any> = {
    borderRadius: 5,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    alignItems: 'center',
}

const smallButtonBase: StyleProp<any> = {
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: 1,
    alignItems: 'center',
}

const textBase = {
    fontSize: 12
}

const smallTextBase = {
    fontSize: 8
}

interface ButtonStylesProps {
    pressed: {
        button: StyleProp<any>
        text: StyleProp<any>
    };
    unpressed: {
        button: StyleProp<any>
        text: StyleProp<any>
    }
}

export const button_styles = (size: 'small' | 'regular' | undefined, type: string): ButtonStylesProps => {
    const baseBtn = size === 'small' ? smallButtonBase : buttonBase;
    const baseText = size === 'small' ? smallTextBase : textBase;

    var pressed: {
        button: StyleProp<any>
        text: StyleProp<any>
    } = {
        button: { ...baseBtn },
        text: { ...baseText }
    };

    var unpressed: {
        button: StyleProp<any>
        text: StyleProp<any>
    } = {
        button: { ...baseBtn },
        text: { ...baseText }
    };


    switch (type) {
        case 'white':
            pressed.button.backgroundColor = colors.tertiary;
            pressed.button.borderColor = colors.white;
            pressed.text.color = colors.primary;

            unpressed.button.backgroundColor = colors.white;
            unpressed.button.borderColor = colors.lightWhite;
            unpressed.text.color = colors.primary;
            break;
        case 'red':
            pressed.button.backgroundColor = colors.lightRed;
            pressed.button.borderColor = colors.red;
            pressed.text.color = colors.white;

            unpressed.button.backgroundColor = colors.red;
            unpressed.button.borderColor = colors.red;
            unpressed.text.color = colors.white;
            break;
        case 'red_outline':
            pressed.button.backgroundColor = colors.lightRed;
            pressed.button.borderColor = colors.lightRed;
            pressed.text.color = colors.white;

            unpressed.button.backgroundColor = 'transparent';
            unpressed.button.borderColor = colors.lightRed;
            unpressed.text.color = colors.lightRed;
            break;
        case 'white_outline':
            pressed.button.backgroundColor = colors.tertiary;
            pressed.button.borderColor = colors.white;
            pressed.text.color = colors.white;

            unpressed.button.backgroundColor = 'transparent';
            unpressed.button.borderColor = colors.white;
            unpressed.text.color = colors.white;
            break;
        case 'secondary':
            pressed.button.backgroundColor = colors.primary;
            pressed.button.borderColor = colors.primary;
            pressed.text.color = colors.white;

            unpressed.button.backgroundColor = 'transparent';
            unpressed.button.borderColor = colors.primary;
            unpressed.text.color = colors.primary;
            break;
        case 'disabled':
            pressed.button.backgroundColor = colors.lightGrey;
            pressed.button.borderColor = colors.lightGrey;
            pressed.text.color = colors.blackLight;

            unpressed.button.backgroundColor = colors.lightGrey;
            unpressed.button.borderColor = colors.lightGrey;
            unpressed.text.color = 'grey';
            break;
        case 'primary':
        default:
            pressed.button.backgroundColor = colors.secondary;
            pressed.button.borderColor = colors.primary;
            pressed.text.color = colors.white;

            unpressed.button.backgroundColor = colors.primary;
            unpressed.button.borderColor = colors.secondary;
            unpressed.text.color = colors.white;
    }

    return {
        pressed,
        unpressed
    }
}

//underline header style
export const underline_header_styles: StyleProp<any> = {
    section: {
        justifyContent: 'center',
        alignSelf: 'center',
    },
    container: {
        position: 'relative'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 25,
        letterSpacing: 2,
        position: 'relative',
        bottom: 5,
        zIndex: 10
    },
    underline: {
        position: 'absolute',
        opacity: .9,
        height: 10,
        borderRadius: 5,
        bottom: 3,
        alignSelf: 'center',
        width: '120%',
        backgroundColor: colors.tertiary
    }
}

export const bannerStyles = (type: string) => {
    interface StylesProps {
        container: StyleProp<any>
        text: StyleProp<any>
    }

    var styles: StylesProps = {
        container: {
            padding: 10
        },
        text: {
            textAlign: 'center',
            fontSize: 12,
            letterSpacing: .5,
            textTransform: 'capitalize'
        }
    }

    switch (type) {
        case 'warning':
            styles.container.backgroundColor = colors.yellow
            styles.text.color = colors.white
            break;
        case 'error':
            styles.container.backgroundColor = colors.red
            styles.text.color = colors.white
            break;
        default:
            styles.container.backgroundColor = colors.green
            styles.text.color = colors.white
    }
    return styles
}