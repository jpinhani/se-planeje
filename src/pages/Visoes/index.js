import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Table, Icon, Input, Popconfirm } from 'antd'
import axios from 'axios'

import AddVision from '../../components/Modal/Vision/index'
import EditVision from '../../components/Modal/VisionEdit'

import 'antd/dist/antd.css'
import './styles.scss'

function Vision() {
  const userId = window.localStorage.getItem('userId')
  const endpoint = `http://seplaneje-com.umbler.net/api/visions`

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

      render: vision => (
        <div className='ModeloBotoesGrid'>
          <span className='ModeloBotoesGridDetalhes' >
            <EditVision data={vision} />
            <Popconfirm title="Sure to delete?" onConfirm={() => removeVision(vision.ID)}>
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
    <AddVision />
    <Input
      onChange={
        async e => (
          dispatch({
            type: 'LIST_VISION',
            payload: (
              await axios.get(`${endpoint}/${userId}/${e.target.value}`)
            ).data
          })
        )
      }
      name='conta' placeholder="Procureeee aqui a visao especifica"
    />
    <Table columns={columns} dataSource={visions} rowKey='ID' />
  </>
}

export default Vision