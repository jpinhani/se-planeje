import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { Input, Button } from 'antd'

import axios from 'axios'

import { login } from '../../auth'
import { urlBackend } from '../../routes/urlBackEnd'
import './styles.scss'

function Login() {

  const history = useHistory()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {

    e.preventDefault()
    // const teste = process.env.AMBIENTE
    // console.log('teste', process.env.AMBIENTE)
    const endpoint = `${urlBackend}api/authenticate`

    const body = {
      email: email,
      password: password
    }

    const response = await axios.post(endpoint, body)

    // console.log('response.status', response.status)

    if (response.status === 200) {

      const token = response.data.token
      const userId = response.data.user.ID

      login(userId, token)

      history.push('/')

    }
  }

  return (
    <div className='login'>
      <form onSubmit={handleSubmit}>

        <h1><span className='logoheaderLogin'>Se</span>Planeje</h1>

        <div>
          <Input
            type='email'
            placeholder="Seu melhor e-mail"
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            type='password' placeholder="Sua senha"
            onChange={e => setPassword(e.target.value)}
          />
          <Button className='blogar' htmlType='submit'><p> Entrar</p></Button>
        </div>
      </form>
    </div>
  )
}

export default Login