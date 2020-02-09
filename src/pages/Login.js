import React from 'react'
import Title from '../components/Title'
import Field from '../components/Field'
import Button from '../components/Button'
import './style1.css'


function Login(){


    function handleSubmit(event) {
        event.preventDefault()
       console.log(event)
    }

    return (
        <form method='post' onSubmit={handleSubmit}>
            <div> 
                <Title text='Se Planeje - Acessar'/>
                <div> 
                    <Field name='txtusu'/>
                </div>
                <Field tipocampo='password' name='txtsenha' />
                <div> 
                    <Button />
                </div>
            </div>
        </form>
    )
}

export default Login