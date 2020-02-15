import React from 'react'
import Header from '../components/Header/Header'
import Menu from '../components/Menu/Menu'


function CadNatureza() {


    function handleSubmit(event) {
        event.preventDefault()
        console.log(event)
    }

    return (
        <div>
            <Header></Header>
            <Menu></Menu>
        </div>
    )
}

export default CadNatureza