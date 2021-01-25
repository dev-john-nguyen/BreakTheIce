import React from 'react';
import { MeStackNavigationProp } from '../navigation/utils/types';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import Profile from '../profile/components/Profile';

interface MeProps {
    navigation: MeStackNavigationProp;
    user: RootProps['user'];
}

const Me = ({ navigation, user }: MeProps) => {
    return <Profile navigation={navigation} user={user} />
}

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})

export default connect(mapStateToProps, {})(Me);