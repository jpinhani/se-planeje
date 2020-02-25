import React, { useState, useEffect } from 'react'
import AddCartao from '../../components/Modal/Cartao/index'
import { Table } from 'antd'
import axios from 'axios'

import 'antd/dist/antd.css';
import './styles.scss'



const columns = [
  {
    title: 'Descrição do Cartão',
    dataIndex: 'CARTAO',
    key: 'CARTAO'
  },
  {
    title: 'Dia de Vencimento',
    dataIndex: 'DT_VENCIMENTO',
    key: 'DT_VENCIMENTO'
  },
  {
    title: 'Melhor dia de Compra',
    dataIndex: 'DIA_COMPRA',
    key: 'DIA_COMPRA'
  }
]

export default () => {
  const [cartao, setCartao] = useState([])

  async function getCartao() {
    const endpointAPI = 'http://localhost:8082/api/cartoes'

    const result = await axios.get(endpointAPI)

    const cartao = result.data

    setCartao(cartao)
  }


  useEffect(() => {
    getCartao()
  }, [])


  return <div>
    <AddCartao />
    <Table columns={columns} dataSource={cartao} />
  </div >
}

