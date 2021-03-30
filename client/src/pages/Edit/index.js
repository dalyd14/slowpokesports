import React, { useEffect, useState } from 'react'

import EditReaderRow from '../../components/EditReaderRow'

import Auth from '../../utils/auth'

const Edit = () => {
    const [companyEquipment, setCompanyEquipment] = useState()

    useEffect(() => {
        const token = Auth.getToken()

        const fetchCompanyEquipment = async token => {
            let companyEq = await fetch('/api/company/getOne', {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            })

            companyEq = await companyEq.json()

            setCompanyEquipment(companyEq)
        }

        fetchCompanyEquipment(token)
    }, [])

    if (!companyEquipment) {
        return <h2>Loading...</h2>
    }

    return (
        <section id="reader-overview" className="mt-5">
            <div id="edit-zones-container" className="container text-center">
                <div className="row no-gutters header-row bg-secondary text-light">
                    <div className="col-1 border-left border-top border-bottom border-info">
                    </div>
                    <div className="col-2 border-left border-top border-bottom border-info d-flex align-items-center justify-content-center">
                        <h4>Hardware ID</h4>
                    </div>
                    <div className="col-3 border-left border-top border-bottom border-info d-flex align-items-center justify-content-center">
                        <h4>Zone Name</h4>
                    </div>
                    <div className="col-3 border-left border-top border-bottom border-info d-flex align-items-center justify-content-center">
                        <h4>Location Description</h4>
                    </div>
                    <div className="col-2 border-left border-top border-bottom border-info d-flex align-items-center justify-content-center">
                        <h4>IP Address</h4>
                    </div>
                    <div className="col-1 border-left border-right border-top border-bottom border-info d-flex align-items-center justify-content-center">
                        <h4>Save</h4>
                    </div>
                </div>
                { companyEquipment.readers.map(reader => <EditReaderRow reader={reader} key={reader.sys_id} />) }
            </div> 
        </section>
    )
}

export default Edit