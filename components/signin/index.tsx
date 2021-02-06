import * as React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Picker,
} from 'react-native';
import * as FirebaseRecaptcha from 'expo-firebase-recaptcha';
import firebase from 'firebase';
import { firebaseConfig } from '../../services/firebase';
import { CustomButton, BodyText, HeaderText } from '../utils';
import { colors } from '../utils/styles';

export default function PhoneAuthScreen() {
    const recaptchaVerifier = React.useRef(null);
    const verificationCodeTextInput = React.useRef<any>(null);
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [verificationId, setVerificationId] = React.useState('');
    const [ctryCode, setCtryCode] = React.useState<string>('+1')
    const [verifyError, setVerifyError] = React.useState<{ message: string }>();
    const [verifyInProgress, setVerifyInProgress] = React.useState(false);
    const [verificationCode, setVerificationCode] = React.useState('');
    const [confirmError, setConfirmError] = React.useState<{ message: string }>();
    const [confirmInProgress, setConfirmInProgress] = React.useState(false);
    const isConfigValid = !!firebaseConfig.apiKey;


    if (verificationId) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <BodyText
                        style={styles.title}
                    >Enter Verification Code</BodyText>
                    <TextInput
                        ref={verificationCodeTextInput}
                        style={styles.textInput}
                        editable={!!verificationId}
                        keyboardType='numeric'
                        placeholder="123456"
                        onChangeText={(verificationCode: string) => setVerificationCode(verificationCode)}
                    />
                    <CustomButton
                        text="Confirm"
                        type={!verificationCode ? 'disabled' : 'primary'}
                        disabled={!verificationCode}
                        indicatorColor={confirmInProgress && colors.white}
                        moreStyles={styles.button}
                        onPress={async () => {
                            try {
                                setConfirmError(undefined);
                                setConfirmInProgress(true);
                                const credential = firebase.auth.PhoneAuthProvider.credential(
                                    verificationId,
                                    verificationCode
                                );
                                await firebase.auth().signInWithCredential(credential);
                                // setConfirmInProgress(false);
                                // setVerificationId('');
                                // setVerificationCode('');
                                // verificationCodeTextInput.current?.clear();
                                // Alert.alert('Phone authentication successful!');
                            } catch (err) {
                                setConfirmError(err);
                                setConfirmInProgress(false);
                            }
                        }}
                    />
                    <CustomButton
                        text="Try again."
                        type='secondary'
                        onPress={() => setVerificationId('')}
                        moreStyles={styles.button}
                    />
                    {confirmError && <Text style={styles.error}>{`Error: ${confirmError.message}`}</Text>}
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                    attemptInvisibleVerification={true}
                />
                <HeaderText
                    style={styles.title}
                >Enter Phone Number</HeaderText>
                <View style={styles.phone_form}>
                    <Picker
                        enabled={false}
                        selectedValue={ctryCode}
                        onValueChange={(text) => setCtryCode(text)}
                        style={styles.picker}
                        itemStyle={styles.picker_item}
                    >
                        <Picker.Item label='+1' value='+1' />
                    </Picker>
                    <TextInput
                        style={styles.textInput}
                        autoFocus={isConfigValid}
                        autoCompleteType="tel"
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                        placeholder="+1 999 999 9999"
                        editable={!verificationId}
                        onChangeText={(phoneNumber: string) => setPhoneNumber(phoneNumber)}
                    />
                </View>
                <CustomButton
                    text={`${verificationId ? 'Resend' : 'Send'} Verification Code`}
                    indicatorColor={verifyInProgress && colors.white}
                    disabled={!phoneNumber}
                    type={!phoneNumber ? 'disabled' : 'primary'}
                    onPress={async () => {
                        const phoneProvider = new firebase.auth.PhoneAuthProvider();
                        try {
                            setVerifyError(undefined);
                            setVerifyInProgress(true);
                            setVerificationId('');
                            const formattedPhoneNum = ctryCode + phoneNumber.replace(/[^0-9]/g, '');
                            const verificationId = await phoneProvider.verifyPhoneNumber(
                                formattedPhoneNum,
                                // @ts-ignore
                                recaptchaVerifier.current
                            );
                            setVerifyInProgress(false);
                            setVerificationId(verificationId);
                            verificationCodeTextInput.current?.focus();
                        } catch (err) {
                            console.log(err)
                            setVerifyError(err);
                            setVerifyInProgress(false);
                        }
                    }}
                />
                {verifyError && <Text style={styles.error}>{verifyError.message}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        justifyContent: 'center'
    },
    content: {
        alignItems: 'center'
    },
    title: {
        marginBottom: 10,
        fontSize: 20,
        color: colors.primary
    },
    phone_form: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    picker: {
        flexBasis: '20%',
    },
    picker_item: {
        fontSize: 12,
        height: 100,
    },
    subtitle: {
        marginBottom: 10,
        opacity: 0.35,
        fontWeight: 'bold',
    },
    text: {
        marginTop: 10,
        marginBottom: 4,
    },
    textInput: {
        fontSize: 17,
        borderBottomColor: colors.primary,
        padding: 10,
        borderBottomWidth: 1,
        marginBottom: 10,
        minWidth: 160
    },
    error: {
        marginTop: 10,
        fontWeight: 'bold',
        color: 'red',
    },
    button: {
        marginTop: 10
    }
});
