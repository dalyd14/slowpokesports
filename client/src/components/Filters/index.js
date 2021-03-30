import React, { useEffect, useState } from 'react'
import RefreshIcon from '@material-ui/icons/Refresh'

import './filters.css'

import Auth from '../../utils/auth'

const Filters = ({ query }) => {
    const [companyFilterData, setCompanyFilterData] = useState()
    const [queryFilters, setQueryFilters] = useState({
        reader: [],
        antenna: [],
        status: []
    })

    useEffect(() => {
        const token = Auth.getToken()

        const fetchFilters = async token => {
            let companyFilters = await fetch('/api/company/filters', {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            })

            companyFilters = await companyFilters.json()

            setCompanyFilterData(companyFilters)  
        }

        fetchFilters(token)

    }, [])

    const handleChange = (event, filterType, sys_id, reader_sys_id) => {
        const checked = event.target.checked

        if (filterType === 'reader') {
            if (checked) {
                queryFilters.reader.push(sys_id)
            } else {
                queryFilters.reader = queryFilters.reader.filter(readerEq => readerEq !== sys_id)
            }
            
        } else if (filterType === 'antenna') {
            if (checked) {
                queryFilters.antenna.push({ sys_id, reader: reader_sys_id })
            } else {
                queryFilters.antenna = queryFilters.antenna.filter(antennaEq => antennaEq.sys_id !== sys_id)
            }
        } else if (filterType === 'status') {
            if (checked) {
                queryFilters.status.push(sys_id)
            } else {
                queryFilters.status = queryFilters.status.filter(stat => stat !== sys_id)
            }
        }
        console.log(queryFilters)
    }

    if (!companyFilterData) {
        return <h2>Loading...</h2>
    }

    return (
        <div className="container mt-4">
            <div className="form-row">
                <div className="col">
                    <form id="product-filters" className="row">
                        <div className="col">
                            <h4>Zones</h4>
                            <div id="zones-checklist" className="form-group">
                                {
                                    companyFilterData.readers.map(reader => (
                                        <div className="form-check" key={reader.sys_id}>
                                            <input onChange={(event) => handleChange(event, 'reader', reader.sys_id)} className="form-check-input" type="checkbox" id={"reader-" + reader.sys_id} />
                                            <label className="form-check-label" htmlFor={"reader-" + reader.sys_id}>{reader.display_name}</label>
                                        </div>                                        
                                    ))
                                }
                            </div>
                        </div>
                        <div className="col">
                            <h4>Subzones</h4>
                            <div id="subzones-checklist" className="form-group">
                                {
                                    companyFilterData.antennas.map(antenna => (
                                        <div className="form-check" key={antenna.sys_id}>
                                            <input onChange={(event) => handleChange(event, 'antenna', antenna.sys_id, antenna.reader.sys_id)} className="form-check-input" type="checkbox" data-reader={antenna.reader.sys_id} id={"antenna-" + antenna.sys_id} />
                                            <label className="form-check-label" htmlFor={"antenna-" + antenna.sys_id}>{antenna.display_name}</label>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="col">
                            <h4>Status</h4>
                            <div id="status-checklist" className="form-group">
                                <div className="form-check">
                                    <input onChange={(event) => handleChange(event, 'status', 'PRES')} className="form-check-input" type="checkbox" id="status-PRES" />
                                    <label className="form-check-label" htmlFor="status-PRES">Present</label>
                                </div>
                                <div className="form-check">
                                    <input onChange={(event) => handleChange(event, 'status', 'MISS')} className="form-check-input" type="checkbox" id="status-MISS" />
                                    <label className="form-check-label" htmlFor="status-MISS">Missing</label>
                                </div>
                            </div>
                        </div>    
                    </form>    
                </div>
                <div className="col">
                    <div className="form-row">
                        <div className="col">
                            <h4>Search</h4>
                            <form id="search-form">
                                <div className="form-group">
                                    <select id="search-column" className="form-control">
                                        <option value="default" defaultValue>Choose Column...</option>
                                        <option value="tag_id">Tag ID</option>
                                        <option value="tag_name">Tag Name</option>
                                        <option value="zone">Zone</option>
                                        <option value="subzone">Subzone</option>
                                        <option value="status">Status</option>
                                        <option value="seen">Seen</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <input id="product-search-input" type="text" className="form-control" placeholder="Enter Search Term" aria-label="Enter Search Term" />
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary" type="button" id="button-clear">X</button>
                                    </div>
                                </div>                
                            </form>    
                        </div>
                    </div>
                </div>
                <div className="col-1">
                    <button id="refresh-btn" className="btn mx-auto d-flex justify-content-center align-items-center visible">
                        <RefreshIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Filters