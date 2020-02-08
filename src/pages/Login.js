import React from 'react'
import Title from '../components/Title'
import Field from '../components/Field'
import Button from '../components/Button'

const styleLogin = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red'
}

const styleContainerButton = {
    margin: '10px 0'
}

function Login(){


    function handleSubmit(event) {
       console.log(event.target)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div style={styleLogin}>
                <Title/>
                <div style={styleContainerButton}>
                    <Field/>
                </div>
                <Field tipocampo='password' />
                <div style={styleContainerButton}>
                    <Button />
                </div>
            </div>
        </form>
    )
}

export default Login