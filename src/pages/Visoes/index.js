import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Table, Icon, Input, Popconfirm, message, notification, Spin } from 'antd'
import moment from 'moment'
import axios from 'axios'
import { urlBackend, config, userID } from '../../services/urlBackEnd'

import AddVision from '../../components/Modal/Vision/index'
import EditVision from '../../components/Modal/VisionEdit'

// import 'antd/dist/antd.css'
import './style.scss'

function Vision() {

  const [spin] = useState(false);
  const userId = userID()
  const endpoint = `${urlBackend}api/visions`

  const dispatch = useDispatch()
  const visions = useSelector(state => state.vision)

  const formatDate = (visions) => {
    if (visions.status === 402)
      return notification.open({
        message: 'SePlaneje - Problemas Pagamento',
        duration: 20,
        description:
          `Poxa!!! 
                        Foram identificados problemas com o pagamento da sua assinatura, acesse a página de Pagamento ou entre em contato conosco...`,
        style: {
          width: '100%',
          marginLeft: 335 - 600,
        },
      });


    const vis = visions.map(vision => {

      const date1 = moment(vision.DT_INICIO, "YYYY/MM/DD");
      vision.DT_INICIO = date1.format("DD/MM/YYYY")

      const date2 = moment(vision.DT_FIM, "YYYY/MM/DD");
      vision.DT_FIM = date2.format("DD/MM/YYYY")

      return vision

    })

    // setSpin(false);
    return vis
  }

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
            <Popconfirm title="Sure to delete?" onConfirm={() => { message.success('Excluido com sucesso'); removeVision(vision.ID) }}>
              <Icon type="delete" style={{ fontSize: '18px', color: '#08c' }} />
            </Popconfirm>
          </span>
        </div>
      )
    }
  ]

  const removeVision = async visionID => {
    await axios.delete(`${endpoint}/${visionID}`, config())

    dispatch({
      type: 'LIST_VISION',
      payload: (await axios.get(`${endpoint}/${userId}`, config())).data
    })
  }


  useEffect(() => {

    async function getVisions() {
      const resulStatus = await axios.get(`${endpoint}/${userId}`, config())
      if (resulStatus.status === 402)
        return notification.open({
          message: 'SePlaneje - Problemas Pagamento',
          duration: 20,
          description:
            `Poxa!!! 
                        Foram identificados problemas com o pagamento da sua assinatura, acesse a página de Pagamento ou entre em contato conosco...`,
          style: {
            width: '100%',
            marginLeft: 335 - 600,
          },
        });
      dispatch({
        type: 'LIST_VISION',
        payload: (resulStatus).data
      })
    }

    getVisions()
  }, [dispatch, endpoint, userId])

  return <>
    <Spin size="large" spinning={spin} />
    <div style={{ display: 'flex' }}>
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
        name='conta' placeholder="Procure aqui a visao especifica"
      />
    </div>
    <div>
      <Table className='table table-action2' columns={columns} dataSource={formatDate(visions)} rowKey='ID' />
    </div>
  </>
}

export default Vision