import React, { useEffect, useState } from 'react'
import RefreshIcon from '@material-ui/icons/Refresh'

import './filters.css'

import Auth from '../../utils/auth'

const Filters = ({ setFilters, setRefetch, refetch }) => {
    const [companyFilterData, setCompanyFilterData] = useState()
    const [visualFilters, setVisualFilters] = useState({
        readers: {
            ind: [],
            sel: []
        },
        antennas: [],
        status: []
    })

    const [filterList, setFilterList] = useState({
        readers: [],
        antennas: []
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
            configVisualFilters(companyFilters)
        }
        fetchFilters(token)
    }, [])

    const handleRefresh = () => {
        setRefetch(!refetch)
    }

    const configVisualFilters = (compFilters) => {
        const dummyList = {
            readers: [],
            antennas: []
        }
        dummyList.readers = compFilters.readers.map(reader => {
            return {
                sys_id: reader.sys_id,
                antennas: reader.antennas.map(ant => ant.sys_id)
            }
        })
        dummyList.antennas = compFilters.antennas.map(ant => {
            return {
                sys_id: ant.sys_id,
                reader: ant.reader.sys_id
            }
        })
        setFilterList(dummyList)
    }

    const handleReaderAndKids = (dummy, select, reader_sys_id) => {
        if (select) {
            dummy.readers.sel.push(reader_sys_id)
            dummy.readers.ind = dummy.readers.ind.filter(reader => reader !== reader_sys_id)
            filterList.readers.find(reader => reader.sys_id === reader_sys_id)
                .antennas.forEach(ant => {
                    if (!dummy.antennas.includes(ant)) {
                        dummy.antennas.push(ant)
                    }
                })
            
            dummy.readers.ind.filter(reader => reader.sys_id !== reader_sys_id)
        } else {
            dummy.readers.sel = dummy.readers.sel.filter(reader => reader !== reader_sys_id)
            filterList.readers.find(reader => reader.sys_id === reader_sys_id)
                .antennas.forEach(ant => {
                    dummy.antennas = dummy.antennas.filter(antenna => antenna !== ant)
                })
        
            dummy.readers.ind.filter(reader => reader.sys_id !== reader_sys_id)
        }

        console.log(dummy)
        return dummy
        // setVisualFilters(dummy)
    }

    const handleAntennaAndParent = (dummy, select, reader_sys_id, antenna_sys_id) => {
        if (select) {
            dummy.antennas.push(antenna_sys_id)
            let pres = true
            filterList.readers.find(reader => reader.sys_id === reader_sys_id)
                .antennas.forEach(ant => {
                    if (pres) {
                        pres = dummy.antennas.includes(ant)                      
                    }
                })
            if (pres) {
                dummy.readers.sel.push(reader_sys_id)
                dummy.readers.ind = dummy.readers.ind.filter(reader => reader !== reader_sys_id)
            } else if (!dummy.readers.ind.includes(reader_sys_id)) {
                dummy.readers.ind.push(reader_sys_id)
            }
        } else {
            dummy.antennas = dummy.antennas.filter(ant => ant !== antenna_sys_id)
            let pres = false
            filterList.readers.find(reader => reader.sys_id === reader_sys_id)
                .antennas.forEach(ant => {
                    if (!pres) {
                        pres = dummy.antennas.includes(ant)                      
                    }
                })
                
            dummy.readers.sel = dummy.readers.sel.filter(reader => reader !== reader_sys_id)
            if (!pres) {    
                dummy.readers.ind = dummy.readers.ind.filter(reader => reader !== reader_sys_id)
            } else if (!dummy.readers.ind.includes(reader_sys_id)) {
                dummy.readers.ind.push(reader_sys_id)
            }
        }

        return dummy
        // setVisualFilters(dummy)
    }

    const handleStatus = (dummy, select, status) => {
        
        if (select) {
            dummy.status.push(status)
        } else {
            dummy.status = dummy.status.filter(stat => stat !== status)
        }

        return dummy
        // setVisualFilters(dummy)
    }

    const handleSetFilters = (dummy) => {

        const dummyFilters = {
            reader: [],
            antenna: [],
            status: ''
        }

        dummy.readers.sel.forEach(reader => {
            dummyFilters.reader.push(
                companyFilterData.readers.find(read => read.sys_id === reader)._id
            )
        })

        dummy.readers.ind.forEach(reader => {
            const antennas = filterList.readers.find(read => read.sys_id === reader).antennas
            antennas.forEach(ant => {
                if (dummy.antennas.includes(ant)) {
                    dummyFilters.antenna.push(
                        companyFilterData.antennas.find(anten => anten.sys_id === ant)._id
                    )
                }
            })
        })

        if (dummy.status.length === 2 || dummy.status.length === 0) {
            dummyFilters.status = ''
        } else {
            dummyFilters.status = dummy.status[0]
        }
        setFilters(dummyFilters)
        setVisualFilters(dummy)
    }

    const handleChange = (event, filterType, sys_id, reader_sys_id) => {
        const checked = event.target.checked
        let dummy = { ...visualFilters }

        if (filterType === 'reader') {
            if (checked) {
                dummy = handleReaderAndKids(dummy, true, sys_id)
            } else {
                dummy = handleReaderAndKids(dummy, false, sys_id)
            }
            
        } else if (filterType === 'antenna') {
            if (checked) {
                dummy = handleAntennaAndParent(dummy, true, reader_sys_id, sys_id)
            } else {
                dummy = handleAntennaAndParent(dummy, false, reader_sys_id, sys_id)
            }

        } else if (filterType === 'status') {
            if (checked) {
                dummy = handleStatus(dummy, true, sys_id)
            } else {
                dummy = handleStatus(dummy, false, sys_id)
            }
        }
        handleSetFilters(dummy)
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
                                            <input 
                                                onChange={(event) => handleChange(event, 'reader', reader.sys_id)} 
                                                className="form-check-input" type="checkbox" 
                                                ref={el => el && (el.indeterminate = visualFilters.readers.ind.includes(reader.sys_id))} 
                                                checked={visualFilters.readers.sel.includes(reader.sys_id)} />
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
                                            <input 
                                                onChange={(event) => handleChange(event, 'antenna', antenna.sys_id, antenna.reader.sys_id)} 
                                                className="form-check-input" type="checkbox" 
                                                checked={visualFilters.antennas.includes(antenna.sys_id)}
                                            />
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
                    <button onClick={handleRefresh} id="refresh-btn" className="btn mx-auto d-flex justify-content-center align-items-center visible">
                        <RefreshIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Filters