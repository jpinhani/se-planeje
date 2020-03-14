import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Table, Icon, Input, Popconfirm } from 'antd'

import AddAcount from '../../components/Modal/Vision/index'
import EditaAcount from '../../components/Modal/ContaEdit/index'

import 'antd/dist/antd.css'
import './styles.scss'
import axios from 'axios'

function Vision(props) {
  const visions = useSelector(state => state.vision)
  const dispatch = useDispatch()

  const columns = [
    {
      title: 'Visao',
      dataIndex: 'VISAO',
      key: 'DESCR_CONTA'
    },
    {
      title: 'Inicio',
      dataIndex: 'DT_INICIO',
      key: 'DT_INICIO'
    },
    {
      title: 'Final',
      dataIndex: 'DT_FIM',
      key: 'DT_FIM'
    },
    {
      title: 'Action',
      key: 'action',

      render: acount => (
        <div className='ModeloBotoesGrid'>
          <span className='ModeloBotoesGridDetalhes' >
            <EditaAcount data={acount} />
            <Popconfirm title="Sure to delete?" onConfirm={() => alert('a')}>
              <Icon type="delete" style={{ fontSize: '18px', color: '#08c' }} />
            </Popconfirm>
          </span>
        </div>
      )
    }
  ]

  async function getVisions() {
    const endpoint = `http://localhost:8082/api/visions/`

    const result = await axios.get(endpoint)

    const visions = result.data

    dispatch({
      type: 'LIST_VISION',
      payload: visions
    })
  }

  useEffect(() => {
    getVisions()
  }, [])

  return (
    <>
      <AddAcount />
      <Input name='conta' placeholder="Procure aqui a conta especifica" />
      <Table columns={columns} dataSource={visions} rowKey='ID' />
    </>
  )
}

export default Vision