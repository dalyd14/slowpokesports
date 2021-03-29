import React from 'react'

import Login from '../../components/Login'
import Register from '../../components/Register'

const Authentication = ({login, company}) => {
    
    return (
        <>
            {login ? <Login /> : <Register company={company} />}
        </>
    )
}

export default Authentication