import React, { useEffect, useState } from 'react'

import SettingsReaderRow from '../../components/SettingsReaderRow'
import SettingsModal from '../../components/SettingsModal'
import SettingsNewItemModal from '../../components/SettingsNewItemModal'

import Auth from '../../utils/auth'

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const Settings = () => {

    const [companyFilterData, setCompanyFilterData] = useState()
    const [currentItem, setCurrentItem] = useState({
        type: '',
        _id: '',
        showModal: false
    })

    const [newItem, setNewItem] = useState({
        type: '',
        showModal: false
    })

    useEffect( () => {
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

    const handleNewItem = (type) => {
        setNewItem({
            type,
            showModal: true
        })
    }


    if (!companyFilterData) {
        return (
            <h2>Loading...</h2>
        )
    }

    let itemInfo

    if (currentItem.showModal) {
        const {
            antennas,
            last,
            sessionkey,
            __v,
            ...rest
        } = companyFilterData[currentItem.type].find(reader => reader._id === currentItem._id)

        itemInfo = rest
    }

    return (
        <section id="reader-overview" className="d-flex flex-column align-items-center mt-5">
            {
                newItem.showModal && <SettingsNewItemModal companyFilterData={companyFilterData} setCompanyFilterData={setCompanyFilterData} newItem={newItem} setNewItem={setNewItem} />
            }
            {
                currentItem.showModal && <SettingsModal companyFilterData={companyFilterData} setCompanyFilterData={setCompanyFilterData} setCurrentItem={setCurrentItem} itemInfo={itemInfo} />
            }
            <div className="d-flex flex-row align-items-center mb-2">
                <button onClick={() => handleNewItem('Reader') } className="btn btn-success mr-3"><span className="mr-1"><AddCircleOutlineIcon /></span> Add Reader</button>
                <button onClick={() => handleNewItem('Antenna') } className="btn btn-success ml-3"><span className="mr-1"><AddCircleOutlineIcon /></span> Add Antenna</button>                
            </div>

            <div className="container text-center">
                <div className="row no-gutters header-row bg-secondary text-light">
                    <div className="col-1 border-left border-top border-bottom border-info d-flex align-items-center justify-content-center"></div>
                    <div className="col-4 border-left border-top border-bottom border-info d-flex align-items-center justify-content-center">
                        <h4>Zone</h4>
                    </div>
                    <div className="col-4 border-left border-top border-bottom border-info d-flex align-items-center justify-content-center">
                        <h4>Subzone</h4>
                    </div>
                    <div className="col-3 border-left border-top border-bottom border-info d-flex align-items-center justify-content-center">
                        <h4>Hardware ID</h4>
                    </div>
                </div>
                {
                    companyFilterData.readers.map(reader => <SettingsReaderRow key={reader.sys_id} reader={reader} setCurrentItem={setCurrentItem} />)
                }
            </div>
        </section>
    )
}

export default Settings