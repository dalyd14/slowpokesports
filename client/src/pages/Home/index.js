import React from 'react'

const Home = ({companyName}) => {

    return (
        <h1 className="text-center">Welcome to {companyName || "Effikas"}</h1>
    )
}

export default Home