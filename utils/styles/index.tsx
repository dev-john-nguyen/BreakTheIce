import { StyleSheet, StyleProp } from 'react-native'


//colors
export const colors = {
    // primary: '#28DF99',
    // secondary: '#99F3BD',
    // tertiary: '#d2f6c5',
    // quaternary: '#f6f7d4',

    primary: '#26baee',
    primary_rgb: '38, 186, 238',
    secondary: '#9fe8fa',
    secondary_rgb: '159, 232, 250',
    tertiary: '#73d2f3',
    lightWhite: '#fff4e0',
    lightWhite_rgb: '255, 244, 244',
    lightOrange: '#f58634',
    yellow: '#fddb3a',
    green: '#28DF99',

    white: '#ffffff',
    white_rgb: '255,255,255',
    red: '#ff4646',
    lightRed: '#ff8585',
    greyRed: '#ef4f4f',
    darkRed: '#c70039',
    darkGreen: '#16c79a',
    lightGrey: '#dddddd',
    black: '#1a1c20'
}


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

const smallButtonBase: StyleProp<any> = {
    borderRadius: 20,
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
    };

    var unpressed: {
        button: StyleProp<any>
        text: StyleProp<any>
    };


    switch (type) {
        case 'red_outline':
            pressed = {
                button: {
                    ...baseBtn,
                    backgroundColor: colors.lightRed,
                    borderColor: colors.lightRed
                },
                text: {
                    ...baseText,
                    color: colors.white
                }
            }
            unpressed = {
                button: {
                    ...baseBtn,
                    borderColor: colors.lightRed
                },
                text: {
                    ...baseText,
                    color: colors.lightRed
                }
            }
            break;
        case 'white_outline':
            pressed = {
                button: {
                    ...baseBtn,
                    backgroundColor: colors.primary,
                    borderColor: colors.primary
                },
                text: {
                    ...baseText,
                    color: colors.white
                }
            }
            unpressed = {
                button: {
                    ...baseBtn,
                    borderColor: colors.white
                },
                text: {
                    ...baseText,
                    color: colors.white
                }
            }
            break;
        case 'secondary':
            pressed = {
                button: {
                    ...baseBtn,
                    backgroundColor: colors.primary,
                    borderColor: colors.primary
                },
                text: {
                    ...baseText,
                    color: colors.white
                }
            }
            unpressed = {
                button: {
                    ...baseBtn,
                    borderColor: colors.primary
                },
                text: {
                    ...baseText,
                    color: colors.primary
                }
            }
            break;
        case 'disabled':
            pressed = {
                button: {
                    ...baseBtn,
                    backgroundColor: colors.lightGrey,
                    borderColor: colors.lightGrey
                },
                text: {
                    ...baseText,
                    color: colors.white
                }
            }
            unpressed = {
                button: {
                    ...baseBtn,
                    backgroundColor: colors.lightGrey,
                    borderColor: colors.lightGrey
                },
                text: {
                    ...baseText,
                    color: colors.white
                }
            }
        case 'primary':
        default:
            pressed = {
                button: {
                    ...baseBtn,
                    backgroundColor: colors.secondary,
                    borderColor: colors.secondary
                },
                text: {
                    ...baseText,
                    color: colors.white
                }
            }
            unpressed = {
                button: {
                    ...baseBtn,
                    backgroundColor: colors.primary,
                    borderColor: colors.primary
                },
                text: {
                    ...baseText,
                    color: colors.white
                }
            }
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
        color: colors.primary
    },
    underline: {
        position: 'absolute',
        backgroundColor: colors.primary,
        opacity: .5,
        height: 15,
        borderRadius: 20,
        bottom: 3,
        alignSelf: 'center',
        width: '120%'
    }
}