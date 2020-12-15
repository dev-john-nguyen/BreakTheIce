import { StyleSheet, Pressable, Dimensions } from 'react-native'

//colors
export const colors = {
    primary: '#28DF99',
    secondary: '#99F3BD',
    tertiary: '#d2f6c5',
    quaternary: 'f6f7d4',
    white: '#ffffff'
}


const buttonBase = {
    borderRadius: 20,
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 10,
    paddingBottom: 10
}

//buttons
export const buttonsStyles = StyleSheet.create({
    button_primary: {
        ...buttonBase,
        backgroundColor: colors.primary
    },
    button_primary_text: {
        color: colors.white,
        fontSize: 12
    },
    button_primary_pressed: {
        ...buttonBase,
        backgroundColor: colors.secondary
    },
    button_secondary: {
        ...buttonBase,
        backgroundColor: colors.white
    },
    button_secondary_text: {
        color: colors.primary
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