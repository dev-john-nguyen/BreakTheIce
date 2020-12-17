import { StyleSheet, Pressable, Dimensions } from 'react-native'

//colors
export const colors = {
    primary: '#28DF99',
    secondary: '#99F3BD',
    tertiary: '#d2f6c5',
    quaternary: 'f6f7d4',
    white: '#ffffff'
}

//buttons
const buttonBase = {
    borderRadius: 20,
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 2
}

export const buttonsStyles = StyleSheet.create({
    button_primary: {
        ...buttonBase,
        backgroundColor: colors.primary,
        borderColor: colors.primary
    },
    button_primary_text: {
        color: colors.white,
        fontSize: 12
    },
    button_primary_pressed: {
        ...buttonBase,
        backgroundColor: colors.secondary,
        borderColor: colors.secondary
    },
    button_secondary: {
        ...buttonBase,
        borderColor: colors.primary
    },
    button_secondary_pressed: {
        ...buttonBase,
        borderColor: colors.primary,
        backgroundColor: colors.primary
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
    button_inactive: {
        ...buttonBase,
        borderColor: colors.secondary,
        backgroundColor: colors.secondary
    },
    button_inactive_text: {
        fontSize: 12,
        color: colors.white
    }
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
export const ListContainerStyle = StyleSheet.create({
    container: {
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderBottomColor: colors.primary,
        borderTopColor: colors.primary,
        marginBottom: 10,
        marginTop: 10,
        position: 'relative'
    },
    content: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 10,
        paddingTop: 20
    },
    topLeft: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    profile_section: {
        flexBasis: "30%",
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 130,
        paddingBottom: 10
    },
    topLeft_text: {
        fontSize: 8,
        color: colors.primary
    },
    username: {
        fontSize: 16,
        color: colors.primary,
        textAlign: 'center'
    },
    age: {
        fontSize: 12,
        color: colors.primary,
        textAlign: 'center'
    },
    content_section: {
        height: 130,
        flex: 1,
        justifyContent: 'space-evenly',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
    content_section_text: {
        height: '70%',
        fontSize: 12,
        color: colors.primary,
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center'
    },
    content_section_buttons: {
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
        fontSize: 10
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
        fontSize: 10
    },
    content_section_button_secondary_text_pressed: {
        color: colors.white,
        fontSize: 10
    },
})

//modal
export const modalStyle = StyleSheet.create({
    center_view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        height: Math.round(Dimensions.get('window').height),
        width: Math.round(Dimensions.get('window').width)
    },
    modal_view: {
        position: 'relative',
        margin: 20,
        backgroundColor: colors.primary,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '70%',
        height: '30%',
        justifyContent: 'space-between'
    },
    text_area: {
        backgroundColor: colors.white,
        color: colors.primary,
        fontSize: 12,
        borderRadius: 20,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        flex: 1,
        margin: 20,
        width: '100%'
    },
    header_text: {
        fontSize: 22,
        color: colors.white
    },
    close_button: {
        position: 'absolute',
        right: 10,
        top: 10,
    }
})


export const baseStyles = StyleSheet.create({
    button: {
        marginTop: 5,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#eee',
        padding: 4
    },
    buttonPressed: {
        marginTop: 5,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#eee',
        backgroundColor: 'green',
        padding: 4
    },
    input: {
        borderWidth: 2,
        borderColor: '#eee',
        padding: 4,
        marginTop: 4
    }
})


export const circleStyle = {
    fillColor: 'rgba(238,238,238,.5)',
    strokeWidth: 1,
    strokeColor: 'rgba(238,238,238,.8)'
}