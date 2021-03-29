import React, { useState } from 'react'
import Auth from '../../utils/auth'

const Login = ({setUser}) => {
    const [loginUser, setLoginUser] = useState({})

    const handleChange = (e) => {
        e.preventDefault()
        setLoginUser({...loginUser, [e.target.id]: e.target.value })
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        
        if (Object.keys(loginUser).length !== 2){
            return
        }

        const newUser = await fetch('/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginUser)
        })

        const { user, token } = await newUser.json()

        setUser(user)

        Auth.login(token)
    }

    return (
        <div>
            <h2>Login</h2>
            <form  onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input onChange={handleChange} type="email" className="form-control" id="email" aria-describedby="emailHelp" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input onChange={handleChange} type="password" className="form-control" id="password" aria-describedby="passwordHelp" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>            
        </div>
    )
}

export default Login