import React from 'react'

import Login from '../../components/Login'
import Register from '../../components/Register'

const Authentication = ({login, setUser, setLoggedin}) => {
    
    return (
        <>
            {login ? <Login setUser={setUser} setLoggedin={setLoggedin} /> : <Register setUser={setUser} setLoggedin={setLoggedin} />}
        </>
    )
}

export default Authentication