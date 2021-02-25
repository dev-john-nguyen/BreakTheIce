import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Keyboard, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import AccountForm from './components/AccountForm';
import { RootProps } from '../../services';
import { UserRootStateProps, InterviewProps, NewProfileImgProps, NewGalleryItemProps } from '../../services/user/types';
import { set_banner } from '../../services/banner/actions';
import { BannerDispatchActionProps } from '../../services/banner/tsTypes';
import * as ImagePicker from 'expo-image-picker';
import ProfileImageForm from './components/ProfileImageForm';
import Interview from './components/Interview';
import { init_user, init_account } from '../../services/signin/actions';
import { SigninDispatchActionProps } from '../../services/signin/types';
import GalleryForm from './components/GalleryForm';
import { HeaderText, CustomButton } from '../utils';
import { normalize, colors } from '../utils/styles';
import { FontAwesome } from '@expo/vector-icons';
import { TopProfileBackground } from '../utils/svgs';
import { windowWidth, windowHeight } from '../../utils/variables';
import { likesInitIndex, carrerInitIndex, familyInitIndex, valuesInitIndex } from '../settings/components/profile/components/utils';
import TermsOfUse from '../settings/components/other/components/TermsOfUse';

/*
Account Creation Process
1. basic information
    1. username *
    2. name *
    3. age *
2. questions
    1. Q1
    2. Q2
    3. Q3
    4. Q4
3. profile image
4. gallery images
*/

interface AccountCreationProps {
    user: UserRootStateProps;
    set_banner: BannerDispatchActionProps['set_banner'];
    init_user: SigninDispatchActionProps['init_user'];
    init_account: SigninDispatchActionProps['init_account'];
}

const AccountCreation = ({ user, set_banner, init_user, init_account }: AccountCreationProps) => {
    const [step, setStep] = useState(0)
    const [profileImg, setProfileImg] = useState<NewProfileImgProps | undefined>();
    const [interviewVals, setInterviewVals] = useState<InterviewProps>({
        likes: [likesInitIndex, ''],
        career: [carrerInitIndex, ''],
        family: [familyInitIndex, ''],
        values: [valuesInitIndex, '']
    });
    const [imgObjs, setImgObjs] = useState<NewGalleryItemProps[]>([]);
    const [loading, setLoading] = useState(false)
    const mount = useRef(false)

    useEffect(() => {
        mount.current = true;

        if (user.username) {
            setStep(2)
        }

        return () => { mount.current = false }
    }, [])

    const handleSave = async () => {
        Keyboard.dismiss();

        if (imgObjs.length > 5) {
            return set_banner('Too many photos uploading. Theres a limit of 5 photos allowed in the gallery.', 'error');
        }

        //lodash clone deep causing the app to crash in production for some reason...

        var imgObjRev: NewGalleryItemProps[] = [];

        if (imgObjs.length > 0) {
            imgObjRev = [...imgObjs];

            imgObjRev.reverse()

            imgObjRev.forEach((item, index) => {
                if ((!item.url && !item.blob) || !item.id) {
                    return set_banner(`Oops! Looks like image #${index + 1} did not load correctly. Please try to remove and upload again.`, 'error')
                }
            })
        }

        setLoading(true)

        init_account(interviewVals, profileImg, imgObjRev)
            .then(() => {
                mount.current && setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                mount.current && setLoading(false)
            })
    }

    const handleNext = () => {
        if (step > 3) {
            handleSave()
        } else {
            setStep(step + 1)
        }
    }

    const handlePrevious = () => {
        if (step > 2) {
            setStep(step - 1)
        }
    }

    const handleCameraRollPermission = async (): Promise<boolean> => {
        try {
            const { status: CameraRollStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (CameraRollStatus !== 'granted') {
                set_banner('Camera roll access denied', 'warning')
                return false;
            }

            return true;
        } catch (e) {
            set_banner('Oops! Something went wrong accessing your camera roll.', 'error')
            return false;
        }
    }

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <View style={{ flex: 1 }}>
                        <TermsOfUse />
                        <CustomButton
                            text='I Agree To These Terms'
                            type='primary'
                            onPress={handleNext}
                            style={{ marginBottom: 20, alignSelf: 'center' }}
                        />
                    </View>
                )

            case 1:
                return <AccountForm init_user={init_user} onNext={handleNext} />
            case 2:
                return <Interview
                    onNext={handleNext}
                    interviewVals={interviewVals}
                    setInterviewVals={setInterviewVals}
                />
            case 3:
                return <ProfileImageForm
                    set_banner={set_banner}
                    handleCameraRollPermission={handleCameraRollPermission}
                    setProfileImg={setProfileImg}
                    profileImg={profileImg}
                />
            case 4:
                return <GalleryForm
                    handleCameraRollPermission={handleCameraRollPermission}
                    set_banner={set_banner}
                    imgObjs={imgObjs}
                    setImgObjs={setImgObjs}
                />
        }
    }

    if (loading) {
        return <View style={styles.completed_container}>
            <HeaderText style={styles.completed_text}>
                Congrats! You're All Finished! Hold On A Second While We Wrap Things Up.
        </HeaderText>
            <ActivityIndicator size='large' color={colors.primary} />
        </View>
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: (windowHeight / 20) }}>

                <FontAwesome name="arrow-circle-left" size={30} color={step > 2 ? colors.secondary : colors.lightGrey} onPress={handlePrevious} />

                <View style={styles.progress_content}>
                    <HeaderText style={styles.progress_text}>
                        {`Step ${step + 1}/5`}
                    </HeaderText>
                    <View style={styles.progress_bar}>
                        <View style={[{
                            width: `${(((step + 1) / 5) * 100)}%`,
                        }, styles.progress_bar_progress]} />
                    </View>
                </View>

                <FontAwesome name="arrow-circle-right" size={30} color={step > 1 ? colors.primary : colors.lightGrey} onPress={() => step > 1 && handleNext()} />
            </View>
            {renderStep()}
            <TopProfileBackground style={styles.header_background} height={'40%'} width={windowWidth.toString()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        marginTop: (windowHeight / 15),
        paddingLeft: 20,
        paddingRight: 20
    },
    progress_content: {
        flex: .6,
        alignItems: 'center'
    },
    progress: {
        width: '100%',
        borderRadius: 20,
        backgroundColor: colors.tertiary
    },
    progress_bar: {
        width: '100%',
        borderRadius: 20,
        backgroundColor: colors.tertiary,
        marginTop: 5
    },
    progress_bar_progress: {
        height: 10,
        backgroundColor: colors.primary,
        borderRadius: 20
    },
    next_step: {
        marginRight: 20
    },
    previous: {
        marginLeft: 20
    },
    progress_text: {
        fontSize: normalize(15),
        color: colors.primary
    },
    completed_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    completed_text: {
        fontSize: normalize(25),
        color: colors.primary,
        marginBottom: 20
    },
    header_background: {
        position: 'absolute',
        bottom: 0,
        transform: [{
            rotate: '180deg'
        }],
        zIndex: -10
    }
})

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})


export default connect(mapStateToProps, { set_banner, init_user, init_account })(AccountCreation);