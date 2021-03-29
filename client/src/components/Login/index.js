import React from 'react'

const Login = () => {
    return (
        <div>
            <h2>Login</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="inputEmployeeEmail">Email address</label>
                    <input type="email" className="form-control" id="inputEmployeeEmail" aria-describedby="emailHelp" />
                </div>
                <div className="form-group">
                    <label htmlFor="inputEmployeePassword">Password</label>
                    <input type="password" className="form-control" id="inputEmployeePassword" aria-describedby="passwordHelp" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>            
        </div>
    )
}

export default Login