import React from 'react'
import moment from 'moment'

const LifeRow = ({ seen_unix, note, reader, antenna, status }) => {
    
    const convertEpoch = epoch => {
        let m = moment(epoch * 1000);
        return m.format("M/D/YYYY h:mm a")
    }

    const returnBadgeClass = status => {
        let badgeClass
        if (status === 'PRES') {
            badgeClass = 'badge-success text-dark'
        } else {
            badgeClass = 'badge-warning'
        }
        return badgeClass
    }

    return (
        <div className="row no-gutters">
            <div data-column="seen" className="col-2 border-left border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{convertEpoch(seen_unix)}</p>
            </div>
            <div data-column="note" className="col-4 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{note}</p>
            </div>
            <div data-column="zone" className="col-2 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{reader.display_name}</p>
            </div>
            <div data-column="subzone" className="col-2 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{antenna.display_name}</p>
            </div>
            <div data-column="status" className="col-2 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <span className={`badge zoneBadge badge-pill ${returnBadgeClass(status)}`}>{status}</span>
            </div>
        </div>
    )
}

export default LifeRow