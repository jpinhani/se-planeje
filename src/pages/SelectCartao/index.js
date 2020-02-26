import React, { useState, useEffect } from 'react'
import AddCartao from '../../components/Modal/Cartao/index'
import EditCartao from '../../components/Modal/CartaoEdit/index'
import { Table, Divider, Icon, Input } from 'antd'
import axios from 'axios'

import 'antd/dist/antd.css';
import './style.scss'



export default () => {
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
    },
    {
      title: 'Action',
      key: 'action',
      // width: '40%',
      render: () => (
        <div className='ModeloBotoesGrid'>
          < span className='ModeloBotoesGridDetalhes' >
            <Icon type="edit" style={{ fontSize: '18px', color: '#08c' }} onClick={showEditCartaoModal} />
            {/* <Link to='/selectconta'><Icon type="edit" style={{ fontSize: '18px', color: '#08c' }} /></Link> */}
          </span>
          <Divider type="vertical" />
          < span className='ModeloBotoesGridDetalhes' >
            <Icon type="delete" style={{ fontSize: '18px', color: '#08c' }} />
          </span >
        </div>
      ),
    }
  ]

  const [cartao, setCartao] = useState([])
  const [editCartao, setEditCartao] = useState(false)

  async function getCartao() {
    const endpointAPI = 'http://localhost:8082/api/cartoes'

    const result = await axios.get(endpointAPI)

    const cartao = result.data

    setCartao(cartao)
  }


  useEffect(() => {
    getCartao()
  }, [])

  function showEditCartaoModal() {
    setEditCartao(true)
  }

  async function SearchCartao(event) {



    const endpointAPI = 'http://localhost:8082/api/cartoes/'
    const result = await axios.get(endpointAPI + event.target.value)
    const cartao = result.data
    console.log(cartao)
    setCartao(cartao)
  }

  return <div>
    {editCartao ? <EditCartao /> : null}
    {/* <EditCartao /> */}
    <div className='ViewCartao'>
      <AddCartao />

      <Input onChange={SearchCartao} name='cartao' placeholder="Procure aqui o cartão especifico" />
    </div>
    <Divider type="horizontal" />
    <Table columns={columns} dataSource={cartao} />
  </div >
}

