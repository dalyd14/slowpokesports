import React from 'react'

const Register = ({company}) => {
    return (
        <div>
            <h2>Register your {company.name} employees!</h2>
            <form>
                <div className="form-row">
                    <div className="col">
                        <input type="text" id="emp-first-name" name="emp-first-name" className="form-control" placeholder="First Name" />
                    </div>
                    <div className="col">
                        <input type="text" id="emp-last-name" name="emp-last-name" className="form-control" placeholder="Last Name" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="col">
                        <input type="text" id="emp-email" name="emp-email" className="form-control" placeholder="Email" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="col">
                        <label htmlFor="inputPermission">Permissions</label>
                        <select id="inputPermission" class="form-control">
                            <option value="default" selected>Choose...</option>
                            <option value="admin">Admin</option>
                            <option value="employee">Employee</option>
                        </select>
                    </div>
                </div>
            </form>            
        </div>

    )
}

export default Register