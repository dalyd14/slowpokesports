import React, { useEffect, useState } from 'react'
import ReaderRow from '../../components/ReaderRow'
import Auth from '../../utils/auth'

const Dashboard = () => {

    const [dashboard, setDashboard] = useState()

    useEffect( () => {
        const token = Auth.getToken()

        const fetchDashboard = async token => {
            let dashboardData = await fetch('/api/company/dashboard', {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            })

            dashboardData = await dashboardData.json()

            setDashboard(dashboardData)            
        }

        fetchDashboard(token)
    }, [])

    if (!dashboard) {
        return (
            <h2>Loading</h2>
        )
    }

    return (
        <section id="reader-overview" className="d-flex flex-column align-items-center mt-5">
            <div className="container text-center">
                <div className="row no-gutters header-row bg-secondary text-light">
                    <div className="col-1 border-left border-top border-bottom border-info d-flex align-items-center justify-content-center">

                    </div>
                    <div className="col-3 border-left border-top border-bottom border-info d-flex align-items-center justify-content-center">
                        <h4>Zone</h4>
                    </div>
                    <div className="col-4 border-left border-top border-bottom border-info d-flex align-items-center justify-content-center">
                        <h4>Subzone</h4>
                    </div>
                    <div className="col-2 border-left border-top border-bottom border-info d-flex align-items-center justify-content-center">
                        <h4>Visible</h4>
                    </div>
                    <div className="col-2 border-left border-right border-top border-bottom border-info d-flex align-items-center justify-content-center">
                        <h4>Unaccounted</h4>
                    </div>
                </div>

                {
                    dashboard.readers.map(reader => <ReaderRow key={reader.sys_id} reader={reader} />)
                }
            </div>
        </section>
    )
}

export default Dashboard