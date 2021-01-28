import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Picker, ScrollView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Pressable, ActivityIndicator } from 'react-native';
import { colors } from '../../../../utils/styles';
import { Feather } from '@expo/vector-icons';
import { UpdateUserProfileProps, UserDispatchActionsProps, UserRootStateProps, NewProfileImgProps } from '../../../../services/user/types';
import { UtilsDispatchActionProps } from '../../../../services/utils/tsTypes';
import { MeStackNavigationProp } from '../../../navigation/utils/types';
import { isEqual } from 'lodash';
import EditProfileImg from './components/EditProfileImg';
import { ageArr } from '../../../../utils/variables';
import { BodyText, CustomInput } from '../../../../utils/components';

interface EditProfileProps {
    user: UserRootStateProps;
    update_profile: UserDispatchActionsProps['update_profile'];
    set_banner: UtilsDispatchActionProps['set_banner'];
    navigation: MeStackNavigationProp;
    handleCameraRollPermission: () => Promise<boolean>
}

const EditProfile = ({ user, update_profile, set_banner, navigation, handleCameraRollPermission }: EditProfileProps) => {
    const [profileImg, setProfileImg] = useState<NewProfileImgProps>();
    const [profileVals, setProfileVals] = useState<UpdateUserProfileProps>()


    const [loading, setLoading] = useState(false);

    useEffect(() => {
        var mount = true;
        navigation.setOptions({
            headerRight: () => {
                if (loading) {
                    return <ActivityIndicator size='small' color={colors.primary} style={{ marginRight: 30 }} />
                } else {
                    return (
                        <Pressable onPress={() => handleSave(mount)} style={{ marginRight: 20 }}>
                            {({ pressed }) => <Feather name='save' size={30} color={pressed ? colors.secondary : colors.primary} />}
                        </Pressable >
                    )
                }
            }
        })

        return () => {
            mount = false
            navigation.setOptions({ headerRight: undefined })
        }
    }, [loading, profileVals, user, profileImg])

    useEffect(() => {
        const { name, bioShort, bioLong, age, gender, profileImg } = user;

        setProfileVals({
            name,
            bioShort,
            bioLong,
            age,
            gender: gender ? gender : 'man'
        })

        if (profileImg) {
            setProfileImg(undefined)
        }

    }, [user])


    if (!profileVals) return (
        <View style={styles.container}>
            <ActivityIndicator size='large' />
        </View>
    )

    const handleValidation = (mount: boolean) => {

        const { name, bioShort, bioLong, age, gender } = user;

        var oldVals = { name, bioShort, bioLong, age, gender };

        if (isEqual(oldVals, profileVals)) {
            if (mount) {
                set_banner('No updates found.', 'warning')
                setLoading(false)
            }
            return false
        }

        let key: keyof typeof profileVals;

        for (key in profileVals) {
            if (!profileVals[key]) {
                if (mount) {
                    set_banner('Please ensure all fields are filled out.', 'error')
                    setLoading(false)
                }
                return false
            }

        }

        return true
    }


    const handleSave = (mount: boolean) => {

        mount && setLoading(true)
        if (!profileImg) {
            if (!handleValidation(mount)) return;
        }

        update_profile(profileVals, profileImg)
            .then(() => {
                mount && setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                mount && set_banner('Oops! Something went wrong updating your profile.', 'error')
                mount && setLoading(false)
            })
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollView}>

                        <View style={styles.profile_image_container}>
                            <EditProfileImg
                                set_banner={set_banner}
                                profileImg={user.profileImg}
                                setImgObj={setProfileImg}
                                imgObj={profileImg}
                                handleCameraRollPermission={handleCameraRollPermission}
                            />
                        </View>

                        <View style={styles.text_input_container}>
                            <BodyText style={styles.text_input_label}>Name:</BodyText>
                            <CustomInput
                                placeholder='Name'
                                value={profileVals.name}
                                onChangeText={(text) => setProfileVals({ ...profileVals, name: text })}
                                style={styles.text_input}
                                maxLength={200}
                            />
                        </View>

                        <View style={styles.text_input_container}>
                            <BodyText style={styles.text_input_label}>Short Bio:</BodyText>
                            <BodyText style={styles.text_input_info}>
                                <Feather name="info" size={10} color={colors.primary} /> Other will initially see this. Make a good first impression. Max character length is 100.
                            </BodyText>
                            <CustomInput
                                placeholder='Short Bio'
                                multiline
                                maxLength={100}
                                value={profileVals.bioShort}
                                onChangeText={(text) => setProfileVals({ ...profileVals, bioShort: text })}
                                style={styles.text_input} />
                        </View>

                        <View style={styles.text_input_container}>
                            <BodyText style={styles.text_input_label}>Long Bio:</BodyText>
                            <BodyText style={styles.text_input_info}>
                                <Feather name="info" size={10} color={colors.primary} /> Will be displayed on your profile. Max character length is 200.
                            </BodyText>
                            <CustomInput
                                placeholder='Long Bio'
                                multiline
                                maxLength={200}
                                value={profileVals.bioLong}
                                onChangeText={(text) => setProfileVals({ ...profileVals, bioLong: text })}
                                style={styles.text_input} />
                        </View>

                        <View style={styles.pickers_container}>
                            <View style={styles.text_input_container}>
                                <BodyText
                                    style={styles.text_input_label}
                                >Age:</BodyText>
                                <Picker
                                    enabled={false}
                                    selectedValue={profileVals.age}
                                    onValueChange={(num) => setProfileVals({ ...profileVals, age: parseInt(num) ? parseInt(num) : 0 })}
                                    style={styles.picker}
                                    itemStyle={styles.picker_item}
                                >
                                    {ageArr.map((age, index) => <Picker.Item key={index} label={index.toString()} value={index} />)}
                                </Picker>
                            </View>


                            <View style={styles.text_input_container}>
                                <BodyText style={styles.text_input_label}>Gender:</BodyText>
                                <Picker
                                    enabled={false}
                                    selectedValue={profileVals.gender}
                                    onValueChange={(itemValue) => {
                                        setProfileVals({ ...profileVals, gender: itemValue.toString() })
                                    }}
                                    style={styles.picker}
                                    itemStyle={styles.picker_item}
                                >
                                    <Picker.Item label='Man' value='man' />
                                    <Picker.Item label='Woman' value='woman' />
                                    <Picker.Item label="Other" value='other' />
                                </Picker>
                            </View>
                        </View>

                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    profile_image_container: {
        alignSelf: 'center'
    },
    scrollView: {
        paddingBottom: 40,
        alignItems: 'stretch'
    },
    text_input_container: {
        margin: 10
    },
    text_input: {
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 10
    },
    text_input_label: {
        fontSize: 12,
        color: colors.primary,
        marginBottom: 5,
        marginLeft: 2
    },
    text_input_info: {
        fontSize: 8,
        color: colors.primary,
        marginBottom: 5,
        marginLeft: 4,
        alignItems: 'center'
    },
    pickers_container: {
        flexDirection: 'row',
        margin: 10,
        alignSelf: 'stretch'
    },
    picker: {
        width: 100,
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: 5,
        height: 100
    },
    picker_item: {
        fontSize: 10,
        height: 100
    }
})

export default EditProfile;