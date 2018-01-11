import React from 'react';
import {connect} from 'react-redux';
import {getUserInfo} from '../../ducks/users'

 class Private extends React.Component {
    
    componentDidMount(){
        this.props.getUserInfo()
    }

    bankBalance() {
        return '$' + Math.floor((Math.random() + 1) * 1000) + '.00';
    }
    render() {
        const user = this.props.user;
        return (
            <div className=''>
                <h1>Community Bank</h1><hr />
                <h4>Account information:</h4>
                {user ? <img className='avatar' src={user.img} /> : null}
                <p>Username: {user ? user.user_name : null}</p>
                <p>Email: {user ? user.email : null}</p>
                <p>ID: {user ? user.auth_id : null}</p>
                <h4>Available balance: {user ? this.bankBalance() : null} </h4>
                <a href='http://localhost:4000/auth/logout'><button>Log out</button></a>
            </div>
        )
    }
}
function mapStateToProps(state){
    return {
        user: state.user
    }
}

//let decoratedComp = connect()'
//export default decoratedComp()
//above is the same thing as below minus the {getUserInfo}.
export default connect(mapStateToProps, {getUserInfo})(Private)