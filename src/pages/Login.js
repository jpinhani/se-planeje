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
        event.preventDefault()
       console.log(event)
    }

    return (
        <form method='post' onSubmit={handleSubmit}>
            <div style={styleLogin}>
                <Title/>
                <div style={styleContainerButton}>
                    <Field name='txtusu'/>
                </div>
                <Field tipocampo='password' name='txtsenha' />
                <div style={styleContainerButton}>
                    <Button />
                </div>
            </div>
        </form>
    )
}

export default Login