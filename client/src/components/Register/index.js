import React, { useState } from 'react'

import Auth from '../../utils/auth'

const Register = ({ setUser, setLoggedin }) => {

    const [registeredUser, setRegisteredUser] = useState({})

    const handleChange = (e) => {
        e.preventDefault()
        setRegisteredUser({...registeredUser, [e.target.id]: e.target.value })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        
        if (Object.keys(registeredUser).length !== 5){
            return
        }

        console.log(registeredUser)
        const newUser = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registeredUser)
        })

        const { user, token} = await newUser.json()

        setUser(user)

        Auth.login(token)
    }

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <input onChange={handleChange} type="text" className="form-control" id="first_name" aria-describedby="emailHelp" />
                </div>
                <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input onChange={handleChange} type="text" className="form-control" id="last_name" aria-describedby="emailHelp" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input onChange={handleChange} type="email" className="form-control" id="email" aria-describedby="emailHelp" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input onChange={handleChange} type="password" className="form-control" id="password" aria-describedby="passwordHelp" />
                </div>

                <div className="form-group">
                    <label htmlFor="signup_key">Company Code</label>
                    <input onChange={handleChange} type="text" id="signup_key" name="signup_key" className="form-control" placeholder="Enter Your Company Code" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>            
        </div>
    )
}

export default Register