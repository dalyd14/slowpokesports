import React, { useEffect, useState } from 'react'
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
            console.log(dashboardData)
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
                    dashboard.readers.map(reader => (
                        <>
                        <div id={'reader-' + reader.sys_id} key={reader.sys_id + '1'} className="row no-gutters reader-row">
                            <div className="col-1 border-left border-right border-bottom border-info d-flex justify-content-center align-items-center">
                                <button type="button" className="btn btn-link no-underline text-dark d-flex justify-content-center align-items-center w-100" data-toggle="collapse" data-target={"#subzoneExpand_" + reader.sys_id} aria-expanded="false" aria-controls="subzoneExpand">
                                    <span id={"toggle-subzones-"  + reader.sys_id} className="material-icons expand-icon">expand</span>
                                </button>
                            </div>
                            <div className="col-3 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                                <p className="m-0">{reader.display_name}</p>
                            </div>
                            <div data-filter="reader-all" className="col-4 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center">
                                <p className="m-0">All Subzones</p>
                            </div>
                            <div data-filter="reader-PRES" className="col-2 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center px-1">
                                <span className="badge zoneBadge badge-pill badge-success text-dark">{reader.tagCountPres}</span>
                            </div>
                            <div data-filter="reader-MISS" className="col-2 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center px-1">
                                <span className="badge zoneBadge badge-pill badge-warning">{reader.tagCountMiss}</span>
                            </div>
                        </div>
                        <div className="collapse" id={"subzoneExpand_" + reader.sys_id} key={reader.sys_id + '2'} >
                            {
                                reader.antennas.map(antenna => (
                                    <div id={"antenna-" + antenna.sys_id} key={antenna.sys_id} className="row no-gutters antenna-row bg-light">
                                        <div className="col-1 border-left border-right border-bottom border-info"></div>
                                        <div className="col-3 border-right border-bottom border-info d-flex justify-content-center align-items-center"></div>
                                        <div data-filter="antenna-all" className="col-4 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center">
                                            <p className="m-0">{antenna.display_name}</p>
                                        </div>
                                        <div data-filter="antenna-PRES" className="col-2 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center px-1">
                                            <span className="badge subzoneBadge badge-pill badge-success text-dark">{antenna.tagCountPres}</span>
                                        </div>
                                        <div data-filter="antenna-MISS" className="col-2 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center px-1">
                                            <span className="badge subzoneBadge badge-pill badge-warning">{antenna.tagCountMiss}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        </>
                    ))
                }
            </div>
        </section>
    )
}

export default Dashboard