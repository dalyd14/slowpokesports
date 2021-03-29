import React from 'react'

const Home = ({companyName}) => {

    return (
        <h1>Welcome to {companyName || "Default"}</h1>
    )
}

export default Home