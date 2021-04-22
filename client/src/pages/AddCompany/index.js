import React from 'react'

const AddCompany = () => {

    const handleNewCompany = () => {

    }

    const convertToSysId = (companyName) => {
        
    }

    const handleChange = () => {

    }
    
    return (
        <div>
            <h2>Add Company</h2>
            <form onSubmit={handleNewCompany}>
                <div className="form-group">
                    <label htmlFor="companyName">Company Name</label>
                    <input onChange={handleChange} type="text" className="form-control" id="companyName" aria-describedby="companyName" />
                </div>
                <div className="form-group">
                    <label htmlFor="passcode">Company Joining Passcode</label>
                    <input onChange={handleChange} type="text" className="form-control" id="passcode" aria-describedby="compnayPasscode" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>            
        </div>
    )
}

export default AddCompany