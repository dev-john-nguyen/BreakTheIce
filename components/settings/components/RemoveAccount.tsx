import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { UserDispatchActionsProps } from '../../../services/user/types';
import { colors } from '../../utils/styles';
import { CustomButton, CustomInput } from '../../utils';
import { Picker } from '@react-native-picker/picker';

interface RemoveAccountProps {
    remove_account: UserDispatchActionsProps['remove_account'];
}

const RemoveAccount = ({ remove_account }: RemoveAccountProps) => {
    const [loading, setLoading] = useState(false);
    const [ctryCode, setCtryCode] = useState<string | number>('+1')
    const [phoneNumber, setPhoneNumber] = useState('');
    const mount = useRef(false);

    useEffect(() => {
        mount.current = true;
        return () => {
            mount.current = false
        }
    }, [])

    const handleOnSumbit = () => {
        setLoading(true)
        remove_account(phoneNumber, ctryCode)
            .then(() => {
                mount.current && setLoading(false);
            })
            .catch((err) => {
                mount.current && setLoading(false);
                console.log(err)
            })
    }


    return (
        <View style={styles.container}>
            <View style={styles.phone_form}>
                <Picker
                    enabled={false}
                    selectedValue={ctryCode}
                    onValueChange={(num) => setCtryCode(num)}
                    style={styles.picker}
                    itemStyle={styles.picker_item}
                >
                    <Picker.Item label='+1' value='+1' />
                </Picker>
                <CustomInput
                    style={styles.textInput}
                    autoCompleteType="tel"
                    keyboardType="phone-pad"
                    textContentType="telephoneNumber"
                    placeholder="+1 999 999 9999"
                    maxLength={20}
                    value={phoneNumber}
                    onChangeText={(phoneNumber: string) => setPhoneNumber(phoneNumber)}
                />
            </View>
            <CustomButton type='red' text='Remove' onPress={handleOnSumbit} indicatorColor={loading && colors.white} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginRight: 20,
        marginLeft: 20
    },
    phone_form: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    picker: {
        flexBasis: '20%',
        marginRight: 5,
    },
    picker_item: {
        fontSize: 12,
        height: 40,
        backgroundColor: 'transparent',
        color: colors.primary
    },
    textInput: {
        fontSize: 17,
        borderBottomColor: colors.primary,
        padding: 10,
        borderBottomWidth: 1,
        marginBottom: 0,
        minWidth: 160
    },
})

export default RemoveAccount;