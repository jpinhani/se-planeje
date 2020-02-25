import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import axios from 'axios'

const columns = [
  {
    title: 'Descrição do Cartão',
    dataIndex: 'cartao',
    key: 'cartao'
  },
  {
    title: 'Dia de Vencimento',
    dataIndex: 'dtVencimento',
    key: 'dtVencimento'
  },
  {
    title: 'Melhor dia de Compra',
    dataIndex: 'dtCompra',
    key: 'dtCompra'
  }
]

export default () => {
  const [cartao, setCartao] = useState([])

  async function getCartao() {
    const endpointAPI = 'http://localhost:8082/api/cartao'

    const result = await axios.get(endpointAPI)

    const cartao = result.data

    setContas(cartao)
  }

  useEffect(() => {
    getCartao()
  }, [])

  return <Table columns={columns} dataSource={cartao} />
}