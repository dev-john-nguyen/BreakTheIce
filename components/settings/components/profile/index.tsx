import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, StyleSheet, Picker, ScrollView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Pressable, ActivityIndicator } from 'react-native';
import { colors, dropShadowListContainer, normalize } from '../../../utils/styles';
import { Feather } from '@expo/vector-icons';
import { UpdateUserProfileProps, UserDispatchActionsProps, UserRootStateProps, NewProfileImgProps, InterviewProps } from '../../../../services/user/types';
import { BannerDispatchActionProps } from '../../../../services/banner/tsTypes';
import { MeStackNavigationProp } from '../../../navigation/utils/types';
import { isEqual, isEmpty } from 'lodash';
import EditProfileImg from './components/ProfileImage';
import { ageArr } from '../../../../utils/variables';
import { BodyText, CustomInput } from '../../../utils';
import Questions from './components/Questions';
import { likesInitIndex, carrerInitIndex, familyInitIndex, valuesInitIndex } from './components/utils';

interface EditProfileProps {
    user: UserRootStateProps;
    update_profile: UserDispatchActionsProps['update_profile'];
    set_banner: BannerDispatchActionProps['set_banner'];
    navigation: MeStackNavigationProp;
    handleCameraRollPermission: () => Promise<boolean>
}

const EditProfile = ({ user, update_profile, set_banner, navigation, handleCameraRollPermission }: EditProfileProps) => {
    const [profileImg, setProfileImg] = useState<NewProfileImgProps>();
    const [profileVals, setProfileVals] = useState<Omit<UpdateUserProfileProps, 'interview'>>()
    const [interviewVals, setInterviewVals] = useState<InterviewProps>({
        likes: [likesInitIndex, ''],
        career: [carrerInitIndex, ''],
        family: [familyInitIndex, ''],
        values: [valuesInitIndex, '']
    });
    const [loading, setLoading] = useState(false);
    const mount = useRef<boolean>()

    useLayoutEffect(() => {
        mount.current = true;
        navigation.setOptions({
            headerRight: () => {
                if (loading) {
                    return <ActivityIndicator size='small' color={colors.primary} style={{ marginRight: 15 }} />
                } else {
                    return (
                        <Pressable onPress={handleSave} style={{ marginRight: 15 }}>
                            {({ pressed }) => <Feather name='save' size={30} color={pressed ? colors.secondary : colors.primary} />}
                        </Pressable >
                    )
                }
            }
        })

        return () => {
            mount.current = false
            navigation.setOptions({ headerRight: undefined })
        }
    }, [loading, profileVals, profileImg, interviewVals, user])

    useEffect(() => {
        const { name, statusMsg, bioLong, age, gender, profileImg, interview } = user;

        setProfileVals({
            name,
            statusMsg,
            bioLong,
            age,
            gender: gender ? gender : 'man',
        })

        if (profileImg) {
            setProfileImg(undefined)
        }

        if (!isEmpty(interview)) {
            setInterviewVals(interview)
        }

    }, [user])


    if (!profileVals) return (
        <View style={styles.container}>
            <ActivityIndicator size='large' />
        </View>
    )

    const handleValidation = (formVals: UpdateUserProfileProps) => {

        const { name, statusMsg, bioLong, age, gender, interview } = user;

        var oldVals = { name, statusMsg, bioLong, age, gender, interview };

        if (isEqual(oldVals, formVals)) {
            if (mount.current) {
                set_banner('No updates found.', 'warning')
                setLoading(false)
            }
            return false
        }

        let key: keyof typeof profileVals;

        for (key in profileVals) {
            if (!profileVals[key]) {
                if (mount.current) {
                    set_banner('Please ensure all fields are filled out.', 'error')
                    setLoading(false)
                }
                return false
            }

        }

        return true
    }


    const handleSave = () => {
        Keyboard.dismiss()

        mount.current && setLoading(true)

        const formVals: UpdateUserProfileProps = { ...profileVals, interview: interviewVals }

        if (!profileImg) {
            if (!handleValidation(formVals)) return;
        }

        update_profile(formVals, profileImg)
            .then(() => {
                mount.current && setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                mount.current && set_banner('Oops! Something went wrong updating your profile.', 'error')
                mount.current && setLoading(false)
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
                                style={[styles.text_input, dropShadowListContainer]}
                                maxLength={200}
                            />
                        </View>

                        <View style={styles.text_input_container}>
                            <BodyText style={styles.text_input_label}>Status:</BodyText>
                            <BodyText style={styles.text_input_info}>
                                <Feather name="info" size={10} color={colors.primary} /> The status in which the other users will initially see. 100 character limit.
                            </BodyText>
                            <CustomInput
                                placeholder='status'
                                multiline
                                maxLength={100}
                                value={profileVals.statusMsg}
                                onChangeText={(text) => setProfileVals({ ...profileVals, statusMsg: text })}
                                style={[styles.text_input, dropShadowListContainer]} />
                        </View>

                        <View style={styles.text_input_container}>
                            <BodyText style={styles.text_input_label}>Brief summary about yourself</BodyText>
                            <BodyText style={styles.text_input_info}>
                                <Feather name="info" size={10} color={colors.primary} /> 200 character limit.
                            </BodyText>
                            <CustomInput
                                placeholder='Long Bio'
                                multiline
                                maxLength={200}
                                value={profileVals.bioLong}
                                onChangeText={(text) => setProfileVals({ ...profileVals, bioLong: text })}
                                style={[styles.text_input, dropShadowListContainer]} />
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
                                    style={[styles.picker, dropShadowListContainer]}
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
                                    style={[styles.picker, dropShadowListContainer]}
                                    itemStyle={styles.picker_item}
                                >
                                    <Picker.Item label='Man' value='man' />
                                    <Picker.Item label='Woman' value='woman' />
                                    <Picker.Item label="Other" value='other' />
                                </Picker>
                            </View>
                        </View>

                        <Questions
                            setInterviewVals={setInterviewVals}
                            interviewVals={interviewVals}
                        />

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
        paddingBottom: 100,
        alignItems: 'stretch'
    },
    text_input_container: {
        margin: 10,
    },
    text_input: {
        backgroundColor: colors.white,
        borderRadius: 10,
    },
    text_input_label: {
        fontSize: normalize(10),
        color: colors.black,
        marginBottom: 5,
        marginLeft: 2
    },
    text_input_info: {
        fontSize: normalize(8),
        color: colors.black,
        marginBottom: 10,
        marginLeft: 4,
        alignItems: 'center'
    },
    pickers_container: {
        flexDirection: 'row',
        margin: 10,
        alignSelf: 'stretch',
        justifyContent: 'space-around',
    },
    picker: {
        width: 100,
        backgroundColor: colors.white,
        borderRadius: 30,
        height: 100
    },
    picker_item: {
        fontSize: normalize(10),
        height: 100
    }
})

export default EditProfile;