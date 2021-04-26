import React, { useState } from 'react'

const AddCompany = () => {

    const [formInputs, setFormInputs] = useState({
        display_name: '',
        signup_key: ''

    })
    const handleNewCompany = async (event) => {
        event.preventDefault()

        const sys_id = convertToSysId(formInputs.display_name)

        try {
            await fetch('api/company/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sys_id,
                    display_name: formInputs.display_name.trim(),
                    signup_key: formInputs.signup_key
                })
            })

            console.log('Company added successfully!')
            setFormInputs({
                display_name: '',
                signup_key: ''
            })
        } catch (e) {
            console.error('Error occured while adding company.')
        }
    }

    const convertToSysId = (companyName) => {
        let sys_id = companyName.trim()

        sys_id = sys_id.toLowerCase()
        sys_id = sys_id.replace(' ', '_')
        sys_id = sys_id.replace("'", '')
        sys_id = sys_id.replace('"', '')
        
        return sys_id
    }

    const handleChange = (event) => {
        setFormInputs({
            ...formInputs,
            [event.target.id]: event.target.value
        })
    }
    
    return (
        <div className="mx-5">
            <h2>Add Company</h2>
            <form onSubmit={handleNewCompany}>
                <div className="form-group">
                    <label htmlFor="companyName">Company Name</label>
                    <input onChange={handleChange} type="text" value={formInputs.display_name} className="form-control" id="display_name" aria-describedby="companyName" required />
                </div>
                <div className="form-group">
                    <label htmlFor="passcode">Company Joining Passcode</label>
                    <input onChange={handleChange} type="text" value={formInputs.signup_key} className="form-control" id="signup_key" aria-describedby="compnayPasscode" required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>            
        </div>
    )
}

export default AddCompany