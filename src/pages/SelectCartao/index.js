import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import axios from 'axios'

const columns = [
  {
    title: 'Descrição Natureza',
    dataIndex: 'DESCR_NATUREZA',
    key: 'DESCR_NATUREZA'
  },
  {
    title: 'Status',
    dataIndex: 'STATUS',
    key: 'STATUS'
  }
]

export default () => {
  const [ contas, setContas ] = useState([])

  async function getContas() {
    const endpointAPI = 'http://localhost:8082/api/naturezas' 

    const result = await axios.get(endpointAPI)

    const contas = result.data

    setContas(contas)
  }

  useEffect(() => {
    getContas()
  }, [])

  return <Table columns={columns} dataSource={contas} />
}