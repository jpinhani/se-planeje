import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Table, Icon, Input, Popconfirm } from 'antd'
import axios from 'axios'

import AddAcount from '../../components/Modal/Vision/index'
import EditaAcount from '../../components/Modal/ContaEdit/index'

import 'antd/dist/antd.css'
import './styles.scss'

function Vision() {
  const userId = window.localStorage.getItem('userId')
  const endpoint = `http://localhost:8082/api/visions`
  
  const dispatch = useDispatch()
  const visions = useSelector(state => state.vision)

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
            <Popconfirm title="Sure to delete?" onConfirm={() => removeVision(acount.ID)}>
              <Icon type="delete" style={{ fontSize: '18px', color: '#08c' }} />
            </Popconfirm>
          </span>
        </div>
      )
    }
  ]

  const removeVision = async visionID => {
    await axios.delete(`${endpoint}/${visionID}`)

    dispatch({
      type: 'LIST_VISION',
      payload: (await axios.get(`${endpoint}/${userId}`)).data
    })
  }
    
  useEffect(() => {
    async function getVisions() {  
      dispatch({
        type: 'LIST_VISION',
        payload: (await axios.get(`${endpoint}/${userId}`)).data
      })
    }

    getVisions()
  }, [dispatch, endpoint, userId])

  return <>
    <AddAcount />
    <Input name='conta' placeholder="Procure aqui a conta especifica" />
    <Table columns={columns} dataSource={visions} rowKey='ID' />
  </>
}

export default Vision