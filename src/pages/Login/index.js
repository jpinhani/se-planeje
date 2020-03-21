import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Input, Button } from 'antd'
import axios from 'axios'
import { login } from '../../auth'
import './styles.scss'

function Login() {

  const history = useHistory()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    const endpoint = 'http://seplaneje-com.umbler.net/api/authenticate'

    const body = {
      email: email,
      password: password
    }

    const response = await axios.post(endpoint, body)

    if (response.status === 200) {
      const token = response.data.token
      const userId = response.data.user.ID

      localStorage.setItem('userId', userId)

      login(token)

      history.push('/')
    }
  }

  return (
    <div className='login'>
      <form onSubmit={handleSubmit}>
        <h1>SE PLANEJE</h1>
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
          <Button htmlType='submit'>Entrar</Button>
        </div>
      </form>
    </div>
  )
}

export default Login