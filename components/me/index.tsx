import React from 'react';
import { MeStackNavigationProp } from '../navigation';
import { connect } from 'react-redux';
import { RootProps } from '../../services';
import ProfileContent from '../profile/components/content';

interface MeProps {
    navigation: MeStackNavigationProp;
    user: RootProps['user'];
}

const Me = ({ navigation, user }: MeProps) => {
    const directToFriends = () => navigation.navigate('Friends')

    return <ProfileContent user={user} directToFriends={directToFriends} admin={true} />
}

const mapStateToProps = (state: RootProps) => ({
    user: state.user
})

export default connect(mapStateToProps, {})(Me);