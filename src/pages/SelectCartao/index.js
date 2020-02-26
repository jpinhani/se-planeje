import React, { useState, useEffect } from 'react'
import AddCartao from '../../components/Modal/Cartao/index'
import EditCartao from '../../components/Modal/CartaoEdit/index'
import { Table, Divider, Icon, Input } from 'antd'
import axios from 'axios'

import 'antd/dist/antd.css';
import './styles.scss'



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

  return <div>
    {editCartao ? <EditCartao /> : null}
    {/* <EditCartao /> */}
    <AddCartao />
    <Divider type="horizontal" />
    <Input name='cartao' placeholder="Procure aqui o cartão especifico" />
    <Table columns={columns} dataSource={cartao} />
  </div >
}

