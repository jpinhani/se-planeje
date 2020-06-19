
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';



import { Input, Button, message } from 'antd'

import axios from 'axios'



import { login } from '../../auth'
import { urlBackend } from '../../services/urlBackEnd'
import './styles.scss'

function Login() {

  const history = useHistory()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {

    e.preventDefault()


    const endpoint = `${urlBackend}api/authenticate`

    const body = {
      email: email,
      password: password
    }

    const response = await axios.post(endpoint, body)
    console.log(response)

    if (response.data.status !== 400 && response.data.status !== 401) {

      const token = response.data.token
      const userId = response.data.user

      login(userId, token)

      history.push('/')

    } else {
      response.data.status === 401 ?
        message.error('Parece haver um problema com seu pagamento', 5) :
        message.error('Usuário ou Senha não reconhecida', 5)
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