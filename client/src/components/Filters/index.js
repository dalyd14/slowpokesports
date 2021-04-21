import React, { useEffect, useState } from 'react'
import { Refresh, Close } from '@material-ui/icons'

import './filters.css'

import Auth from '../../utils/auth'

import { useSelector, useDispatch } from 'react-redux'
import { updateReaderSel, updateReaderInd, updateAntenna, updateStatus, selectFilters } from '../../utils/filterSlice'

const Filters = ({ setRefetch, refetch, searchString, setSearchString }) => {

    const [companyFilterData, setCompanyFilterData] = useState()

    const filters = useSelector(selectFilters)
    const dispatch = useDispatch()

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

    const handleRefresh = () => {
        setRefetch(!refetch)
    }

    const selectAllReadersAntennas = (reader_id) => {
        const readerAnts = companyFilterData.readers.find(reader => reader._id === reader_id)
            .antennas.map(ant => ant._id)

        const newAntennaArray = [...filters.antennas]
        readerAnts.forEach(ant => {
            if (!newAntennaArray.includes(ant)) {
                newAntennaArray.push(ant)
            }
        });

        dispatch(updateAntenna(newAntennaArray))
    }

    const deselectAllReadersAntennas = (reader_id) => {
        const readerAnts = companyFilterData.readers.find(reader => reader._id === reader_id)
            .antennas.map(ant => ant._id)

        const newAntennaArray = [...filters.antennas].filter(ant => !readerAnts.includes(ant))

        dispatch(updateAntenna(newAntennaArray))
    }

    const handleReaderIndetOrSel = (newAntArray, reader_id) => {
        const readerAnts = companyFilterData.readers.find(reader => reader._id === reader_id)
            .antennas.map(ant => ant._id)

        let i = 0
        newAntArray.forEach(ant => {
            if (readerAnts.includes(ant)) {
                i++
            }
        })
        
        if (i === 0) {
            dispatch(updateReaderSel([...filters.readers.sel].filter(reader => reader !== reader_id)))
            dispatch(updateReaderInd([...filters.readers.ind].filter(reader => reader !== reader_id)))           
        } else if (i === readerAnts.length) {
            dispatch(updateReaderSel([...filters.readers.sel, reader_id]))
            dispatch(updateReaderInd([...filters.readers.ind].filter(reader => reader !== reader_id)))
        } else {
            dispatch(updateReaderSel([...filters.readers.sel].filter(reader => reader !== reader_id)))
            if (!filters.readers.ind.includes(reader_id)) {
                dispatch(updateReaderInd([...filters.readers.ind, reader_id]))
            }
        }        
    }

    const handleChange = (event, filterType, _id, reader_id) => {
        const checked = event.target.checked

        if (filterType === 'reader') {
            if (checked) {
                dispatch(updateReaderSel([...filters.readers.sel, _id]))
                dispatch(updateReaderInd([...filters.readers.ind].filter(reader => reader !== _id)))           
                selectAllReadersAntennas(_id)
            } else {
                dispatch(updateReaderSel(filters.readers.sel.filter(reader => reader !== _id)))
                deselectAllReadersAntennas(_id)
            }
            
        } else if (filterType === 'antenna') {
            if (checked) {
                dispatch(updateAntenna([...filters.antennas, _id]))
                handleReaderIndetOrSel([...filters.antennas, _id], reader_id)
            } else {
                dispatch(updateAntenna(filters.antennas.filter(ant => ant !== _id)))
                handleReaderIndetOrSel(filters.antennas.filter(ant => ant !== _id), reader_id)
            }

        } else if (filterType === 'status') {
            if (checked) {
                dispatch(updateStatus([...filters.status, _id]))
            } else {
                if (filters.status.length === 1) {
                    dispatch(updateStatus(['PRES', 'MISS']))
                } else {
                    dispatch(updateStatus(filters.status.filter(stat => stat !== _id)))
                }
            }
        }
    }

    const handleSearchColumnChange = (event) => {
        setSearchString({ ...searchString, searchColumn: event.target.value })
    }

    const handleSearchStringChange = (event) => {
        setSearchString({ ...searchString, string: event.target.value })
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
                                                onChange={(event) => handleChange(event, 'reader', reader._id)} 
                                                className="form-check-input" type="checkbox" 
                                                ref={el => el && (el.indeterminate = filters.readers.ind.includes(reader._id))} 
                                                checked={filters.readers.sel.includes(reader._id)} />
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
                                                onChange={(event) => handleChange(event, 'antenna', antenna._id, antenna.reader._id)} 
                                                className="form-check-input" type="checkbox" 
                                                checked={filters.antennas.includes(antenna._id)}
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
                                    <input onChange={(event) => handleChange(event, 'status', 'PRES')} className="form-check-input" type="checkbox" checked={filters.status.includes('PRES')} id="status-PRES" />
                                    <label className="form-check-label" htmlFor="status-PRES">Present</label>
                                </div>
                                <div className="form-check">
                                    <input onChange={(event) => handleChange(event, 'status', 'MISS')} className="form-check-input" type="checkbox" checked={filters.status.includes('MISS')} id="status-MISS" />
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
                                    <select onChange={handleSearchColumnChange} id="search-column" className="form-control" value={searchString.searchColumn}>
                                        <option value="default" defaultValue>Choose Column...</option>
                                        <option value="sys_id">Tag ID</option>
                                        <option value="tagname">Tag Name</option>
                                        <option value="reader">Zone</option>
                                        <option value="antenna">Subzone</option>
                                        <option value="status">Status</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <input onChange={handleSearchStringChange} id="product-search-input" type="text" className="form-control" placeholder="Enter Search Term" aria-label="Enter Search Term" value={searchString.string}/>
                                    <div className="input-group-append">
                                        <button onClick={() => setSearchString({...searchString, string: ''})} className="btn btn-outline-secondary" type="button" id="button-clear">
                                            <Close />
                                        </button>
                                    </div>
                                </div>                
                            </form>    
                        </div>
                    </div>
                </div>
                <div className="col-1">
                    <button onClick={handleRefresh} id="refresh-btn" className="btn mx-auto d-flex justify-content-center align-items-center visible">
                        <Refresh />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Filters