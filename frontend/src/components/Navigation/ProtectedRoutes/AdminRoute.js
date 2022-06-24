import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Route } from 'react-router-dom'


const AdminRoute = ({component:Component, ...rest}) => {
    //check if user login
    const user = useSelector(state=>state?.users);
    const {userAuth} = user;
    return (
        <Route 
            {...rest} 
            render = {() => 
                userAuth?.isAdmin ? <Component {...rest} /> : <Redirect to='/login' />
            }
        />
    );
};

export default AdminRoute