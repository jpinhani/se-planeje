import React from 'react'
import axios from 'axios'
import { Input, Button } from 'antd'

import './styles.scss'

export default () => {

  function handleSubmit(event) {
    event.preventDefault()

    const endpointAPI = 'http://localhost:8082/api/naturezas'

    const body = {
      idUser: 2,
      descrNatureza: 'NuBank',
      status: 'Ativo'
    }

    axios.post(endpointAPI, body).then(function (result) {
      console.log(result)
    }).catch(function(err) {
      console.log(err)
    })
    
  }

  return (
    <div className='nature-page'>
      <form onSubmit={handleSubmit}>
        <Input placeholder="Informe o nome da natureza" />
        <Button htmlType='submit'>Enviar</Button>
      </form>
    </div>
  )
}