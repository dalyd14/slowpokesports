import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import Auth from '../../utils/auth'

import LifeRow from '../../components/LifeRow'

const ProductLife = () => {
    
    const [tags, setTags] = useState([])
    const { sys_id } = useParams()
    
    useEffect(() => {
        const token = Auth.getToken()

        const getTagHistory = async token => {
            let foundTags = await fetch(`/api/tag/history/${sys_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            })

            foundTags = await foundTags.json()

            foundTags = addNotes(foundTags)

            setTags(foundTags)
        }

        getTagHistory(token)
    }, [sys_id])

    const addNotes = (tagArr) => {
        const reversedArr = tagArr.reverse()
        //let lastReader = reversedArr[0].reader.sys_id
        let lastAntenna = reversedArr[0].antenna.sys_id
        let lastStatus = reversedArr[0].status
    
        for ( let i = 0; i < reversedArr.length; i++) {
            if (i === 0) {
                // these statements deal with the first entry in the history
                if (lastStatus === 'PRES') {
                    // This is the most common first tag note: being read by its first antenna
                    reversedArr[i].note = `This tag entered subzone: ${reversedArr[i].antenna.display_name}`
                } else {
                    // An error because a tag can't start by being unnacounted for
                    reversedArr[i].note = `Error 1`
                }
            } else if (i === reversedArr.length - 1) {
                // these statements deal with the current tag entry in the history
                if (reversedArr[i].status === 'PRES') {
                    // this tag is the current status and it is being read by an antenna
                    reversedArr[i].note = `This tag is currently in subzone: ${reversedArr[i].antenna.display_name}`
                } else {
                    // this tag is the current status but it is unnaccounted for
                    reversedArr[i].note = `This tag has left subzone: ${reversedArr[i].antenna.display_name}`
                }
            } else {
                // these statements deal with all other entries
                if (reversedArr[i].antenna.sys_id === lastAntenna ) {
                    // These statements are for if the antenna is the same as the last tag entry
                    if (reversedArr[i].status === lastStatus && lastStatus === 'PRES') {
                        // this tag has not switched antennas but is still present... kind of weird but not necessarily an error
                        reversedArr[i].note = `This tag is still in subzone: ${reversedArr[i].antenna.display_name}`
                    } else if (reversedArr[i].status === lastStatus && lastStatus === 'MISS') {
                        // this tag has not switched antennas but is still missing... this is an error because it shouldnt be double counted like this if it is missing
                        reversedArr[i].note = `Error 2`
                    } else if (reversedArr[i].status !== lastStatus && lastStatus === 'MISS') {
                        // this tag was missing from this antenna but has now re-entered the antenna
                        reversedArr[i].note = `This tag entered subzone: ${reversedArr[i].antenna.display_name}`
                    } else if (reversedArr[i].status !== lastStatus && lastStatus === 'PRES') {
                        // this tag has left this subzone and is currently unaccounted for  
                        reversedArr[i].note = `This tag has left subzone: ${reversedArr[i].antenna.display_name}`
                    } 
                } else {
                    // These statements are for if the antenna is different than the last tag entry
                    if (reversedArr[i].status === 'PRES') {
                        // this is if the tag has switched antennas and is currently being read by the new one
                        reversedArr[i].note = `This tag entered subzone: ${reversedArr[i].antenna.display_name}`
                    } else if (reversedArr[i].status === 'MISS') {
                        // this is an error because it is saying that the antenna switched but it is not being read
                        reversedArr[i].note = `Error 3`
                    }
                }
                
            }
            //lastReader = reversedArr[i].reader.sys_id
            lastAntenna = reversedArr[i].antenna.sys_id
            lastStatus = reversedArr[i].status
        }
        return reversedArr.reverse()
    }

    if (!tags.length) {
        return <h2>Loading...</h2>
    }

    return (
        <>
        <div className="container my-3">
            <h4><span className="font-weight-bold">Tag Id: </span>{tags[0].sys_id}</h4>
            <h4><span className="font-weight-bold">Tag Name: </span>{tags[0].tagname}</h4>
            <h4><span className="font-weight-bold">Current Status: </span>{tags[0].status}</h4>
        </div>

        <div className="container my-4">
            <div className="row no-gutters header-row bg-secondary text-light cursor-pointer">
                <div id='seen' className="header-col col-2 border-left border-right border-top border-bottom border-info d-flex align-items-center">
                    <h4 className="m-0 mx-auto disable-user-select">Seen</h4>
                </div>
                <div id='note' className="header-col col-4 border-left border-right border-top border-bottom border-info d-flex align-items-center">
                    <h4 className="m-0 mx-auto disable-user-select">Note</h4>
                </div>
                <div id='zone' className="header-col col-2 border-left border-top border-bottom border-info d-flex align-items-center">
                    <h4 className="m-0 mx-auto disable-user-select">Zone</h4>
                </div>
                <div id='subzone' className="header-col col-2 border-left border-top border-bottom border-info d-flex align-items-center">
                    <h4 className="m-0 mx-auto disable-user-select">Subzone</h4>
                </div>
                <div id='status' className="header-col col-2 border-left border-top border-bottom border-info d-flex align-items-center">
                    <h4 className="m-0 mx-auto disable-user-select">Status</h4>
                </div>
            </div>
            <section id="product-rows">
                {
                    tags.map(tag => <LifeRow key={tag._id} reader={tag.reader} antenna={tag.antenna} note={tag.note} seen_unix={tag.seen_unix} status={tag.status} />)
                }
            </section>
        </div>
        </>
    )
}

export default ProductLife