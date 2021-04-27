import React, { useState } from 'react'
import { Close } from '@material-ui/icons'

//"display: block; padding-right: 16px;"

const SettingsModal = ({ itemInfo, setCurrentItem, companyFilterData }) => {

    console.log(itemInfo)
    const [newValues, setNewValues] = useState(itemInfo)

    const handleSubmit = async (event) => {
        event.preventDefault()

        const { _id, ...body } = newValues

        if ('ip_address' in body) {
            try {
                await fetch(`/api/reader/${_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                })

                const newData = companyFilterData.readers.find(reader => reader._id === _id)
                newData.sys_id = body.sys_id
                newData.display_name = body.display_name
                newData.location_description = body.location_description
                newData.ip_address = body.ip_address
                newData.emailRfrain = body.emailRfrain
                newData.passwordRfrain = body.passwordRfrain
                newData.cnameRfrain = body.cnameRfrain

                setCurrentItem({
                    type: '',
                    _id: '',
                    showModal: false
                })
            } catch (e) {
                console.error(e)
            }
        } else {
            try {
                await fetch(`/api/antenna/${_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                })

                const newData = companyFilterData.readers.find(reader => reader._id === itemInfo.reader._id).antennas.find(ant => ant._id === _id)
                newData.sys_id = body.sys_id
                newData.display_name = body.display_name
                newData.location_description = body.location_description

                const newNewData = companyFilterData.antennas.find(ant => ant._id === _id)
                newNewData.sys_id = body.sys_id
                newNewData.display_name = body.display_name
                newNewData.location_description = body.location_description

                setCurrentItem({
                    type: '',
                    _id: '',
                    showModal: false
                })
            } catch (e) {
                console.error(e)
            }
        }
    }

    const handleClose = () => {
        setCurrentItem({
            type: '',
            _id: '',
            showModal: false
        })
    }

    const handleChange = (event, key) => {
        let trackValues = newValues
        trackValues[key] = event.target.value
        setNewValues(trackValues)
    }

    return (
        <div className="modal fade show" style={{display: 'block', paddingRight: '16px'}} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-modal="true">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Settings</h5>
                        <button onClick={handleClose} type="button" className="btn" data-bs-dismiss="modal" aria-label="Close">
                            <Close />
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="formGroup-displayName">Display Name</label>
                                <input onChange={(event) => {handleChange(event, 'display_name')}} type="text" className="form-control" id="formGroup-displayName" defaultValue={newValues.display_name} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="formGroup-hardwareId">Hardware ID</label>
                                <input onChange={(event) => {handleChange(event, 'sys_id')}} type="text" className="form-control" id="formGroup-hardwareId" defaultValue={newValues.sys_id} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="formGroup-locationDescription">Location Description</label>
                                <input onChange={(event) => {handleChange(event, 'location_description')}} type="text" className="form-control" id="formGroup-locationDescription" defaultValue={newValues.location_description} />
                            </div>
                            {
                                ('ip_address' in newValues) && (
                                    <>
                                    <div className="form-group">
                                        <label htmlFor="formGroup-ipAddress">IP Address</label>
                                        <input onChange={(event) => {handleChange(event, 'ip_address')}} type="text" className="form-control" id="formGroup-ipAddress" defaultValue={newValues.ip_address} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="formGroup-email">Email for RfRain Portal</label>
                                        <input onChange={(event) => {handleChange(event, 'emailRfrain')}} type="text" className="form-control" id="formGroup-email" defaultValue={newValues.emailRfrain} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="formGroup-password">Password for RfRain Portal</label>
                                        <input onChange={(event) => {handleChange(event, 'passwordRfrain')}} type="text" className="form-control" id="formGroup-password" defaultValue={newValues.passwordRfrain} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="formGroup-cname">Cname for RfRain Portal</label>
                                        <input onChange={(event) => {handleChange(event, 'cnameRfrain')}} type="text" className="form-control" id="formGroup-cname" defaultValue={newValues.cnameRfrain} />
                                    </div>
                                    </>
                                )
                            }
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button onClick={handleClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button onClick={(event) => {handleSubmit(event)}} type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsModal