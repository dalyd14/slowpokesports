import React, { useState } from 'react'
import { Close } from '@material-ui/icons'

import Auth from '../../utils/auth'

const SettingsNewItemModal = ({ setNewItem, newItem, companyFilterData }) => {

    const [newValues, setNewValues] = useState({})

    console.log(companyFilterData)

    const handleSubmit = async (event) => {
        event.preventDefault()
        
        let user
        
        if (!Auth.loggedIn()) {
            return
        } else {
            user = Auth.getProfile().data
        }

        if (newItem.type === "Reader") {
            
            let body = {
                sys_id: newValues.sys_id,
                display_name: newValues.display_name,
                location_description: newValues.location_description,
                ip_address: newValues.ip_address,
                company: user.company._id,
                cnameRfrain: newValues.cnameRfrain,
                emailRfrain: newValues.emailRfrain,
                passwordRfrain: newValues.passwordRfrain,
                sessionkey: '',
                last: null,
                antennas: []
            }
            
            try {
                let newReader = await fetch(`/api/reader/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                })

                newReader = await newReader.json()

                companyFilterData.readers.push({
                    antennas: newReader.antennas,
                    cnameRfrain: newReader.cnameRfrain,
                    display_name: newReader.display_name,
                    emailRfrain: newReader.emailRfrain,
                    ip_address: newReader.ip_address,
                    last: newReader.last,
                    location_description: newReader.location_description,
                    passwordRfrain: newReader.passwordRfrain,
                    sessionkey: newReader.sessionkey,
                    sys_id: newReader.sys_id,
                    _id: newReader._id
                })

                setNewItem({
                    type: '',
                    showModal: false
                })
            } catch (e) {
                console.error(e)
            }
        } else if (newItem.type === 'Antenna') {
            let body = {
                sys_id: newValues.sys_id,
                display_name: newValues.display_name,
                location_description: newValues.location_description,
                company: user.company._id,
                reader: newValues.reader_assoc
            }
            
            try {
                let newAntenna = await fetch(`/api/antenna/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                })

                newAntenna = await newAntenna.json()

                companyFilterData.antennas.push({
                    company: newAntenna.company,
                    display_name: newAntenna.display_name,
                    location_description: newAntenna.location_description,
                    reader: newAntenna.reader,
                    sys_id: newAntenna.sys_id,
                    _id: newAntenna._id
                })

                companyFilterData.readers
                    .find(reader => reader._id === newValues.reader_assoc)
                    .antennas.push({
                        company: newAntenna.company,
                        display_name: newAntenna.display_name,
                        location_description: newAntenna.location_description,
                        reader: newAntenna.reader,
                        sys_id: newAntenna.sys_id,
                        _id: newAntenna._id                       
                    })

                setNewItem({
                    type: '',
                    showModal: false
                })
            } catch (e) {
                console.error(e)
            }
        }
    }

    const handleClose = () => {
        setNewItem({
            type: '',
            showModal: false
        })
    }

    const handleChange = (event, key) => {
        let trackValues = newValues
        trackValues[key] = event.target.value
        console.log(trackValues)
        setNewValues(trackValues)
    }

    return (
        <div className="modal fade show" style={{display: 'block', paddingRight: '16px'}} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-modal="true">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">New {newItem.type}</h5>
                        <button onClick={handleClose} type="button" className="btn" data-bs-dismiss="modal" aria-label="Close">
                            <Close />
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            {
                                (newItem.type === "Antenna") && (
                                    <div className="form-group">
                                        <label htmlFor="formGroup-reader">Choose the Reader that this Antenna is Asscociated With</label>
                                        <select onChange={(event) => {handleChange(event, 'reader_assoc')}} className="form-control">
                                            <option value="0">Choose reader...</option>
                                            {
                                                companyFilterData.readers.map(reader => {
                                                    return (
                                                        <option key={reader._id} value={reader._id}>{reader.display_name} | {reader.sys_id} | {reader.ip_address}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                )
                            }
                            <div className="form-group">
                                <label htmlFor="formGroup-displayName">Display Name</label>
                                <input onChange={(event) => {handleChange(event, 'display_name')}} type="text" className="form-control" id="formGroup-displayName" defaultValue={newValues?.display_name || ''} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="formGroup-hardwareId">Hardware ID</label>
                                <input onChange={(event) => {handleChange(event, 'sys_id')}} type="text" className="form-control" id="formGroup-hardwareId" defaultValue={newValues?.sys_id || ''} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="formGroup-locationDescription">Location Description</label>
                                <input onChange={(event) => {handleChange(event, 'location_description')}} type="text" className="form-control" id="formGroup-locationDescription" defaultValue={newValues?.location_description || ''} />
                            </div>
                            {
                                (newItem.type === "Reader") && (
                                    <>
                                    <div className="form-group">
                                        <label htmlFor="formGroup-ipAddress">IP Address</label>
                                        <input onChange={(event) => {handleChange(event, 'ip_address')}} type="text" className="form-control" id="formGroup-ipAddress" defaultValue={newValues?.ip_address || ''} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="formGroup-email">Email for RfRain Portal</label>
                                        <input onChange={(event) => {handleChange(event, 'emailRfrain')}} type="text" className="form-control" id="formGroup-email" defaultValue={newValues?.emailRfrain || ''} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="formGroup-password">Password for RfRain Portal</label>
                                        <input onChange={(event) => {handleChange(event, 'passwordRfrain')}} type="text" className="form-control" id="formGroup-password" defaultValue={newValues?.passwordRfrain || ''} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="formGroup-cname">Cname for RfRain Portal</label>
                                        <input onChange={(event) => {handleChange(event, 'cnameRfrain')}} type="text" className="form-control" id="formGroup-cname" defaultValue={newValues?.cnameRfrain || ''} />
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

export default SettingsNewItemModal