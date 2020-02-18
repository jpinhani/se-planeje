import React, { useState } from 'react'
import axios from 'axios'
import { Input, Button } from 'antd'

import './styles.scss'

export default () => {

  const [descricao, atualizaEstadoDescricao] = useState(null)
  const [status, atualizaEstadoStatus] = useState(null)

  function handleDescriptionChange(event) {
    // console.log(event.target)
    atualizaEstadoDescricao(event.target.value)
  }

  function handleStatusChange(event) {
    // console.log(event.target)
    atualizaEstadoStatus(event.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const endpointAPI = 'http://localhost:8082/api/naturezas'

    const body = {
      idUser: 2,
      descrNatureza: descricao,
      status: status
    }

    console.log(body)

    axios.post(endpointAPI, body).then(function (result) {
      // console.log(result)
    }).catch(function (err) {
      console.log(err)
    })

  }

  return (
    <div className='nature-page'>
      <form onSubmit={handleSubmit}>
        <Input name='natureDescription' onChange={handleDescriptionChange} placeholder="Informe o nome da natureza" />
        <Input name='statusDescription' onChange={handleStatusChange} placeholder="Informe o Status" />
        <Button htmlType='submit'>Enviar</Button>
      </form>
    </div>
  )
}