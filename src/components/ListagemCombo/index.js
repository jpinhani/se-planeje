import React from 'react'
import axios from 'axios'
import { Select } from 'antd'
import { urlBackend, userID } from '../../routes/urlBackEnd'

const { Option } = Select;


async function loadCategoriaReceita() {

    const endpoint = `${urlBackend}api/receitas/category/${userID()}`

    const result = await axios.get(endpoint)

    const options = result.data.map((desc, i) =>
        <Option key={i} value={desc.ID}>
            {desc.DESCR_CATEGORIA}
        </Option>
    )

    return options
}

async function loadCategoria() {

    const endpoint = `${urlBackend}api/despesas/category/${userID()}`
    const result = await axios.get(endpoint)

    const options = result.data.map((desc, i) =>
        <Option key={i} value={desc.ID}>
            {desc.DESCR_CATEGORIA}
        </Option>
    )

    return options
}

async function loadCartao() {

    const endpoint = `${urlBackend}api/despesas/cartao/${userID()}`
    const result = await axios.get(endpoint)

    const options = result.data.map((desc, i) =>
        <Option key={i} value={desc.ID}>
            {desc.CARTAO}
        </Option>
    )

    options.push(<Option key='nd' value='DÉBITO OU DINHEIRO'>DÉBITO OU DINHEIRO</Option>)


    return options
}


async function loadCartaoReal() {

    const endpoint = `${urlBackend}api/despesas/cartao/${userID()}`
    const result = await axios.get(endpoint)

    const options = result.data.map((desc, i) =>
        <Option key={i} value={desc.ID}>
            {desc.CARTAO}
        </Option>
    )


    return options
}

async function loadConta() {

    const endpoint = `${urlBackend}api/contas/${userID()}`
    const result = await axios.get(endpoint)

    const options = result.data.map((desc, i) =>
        <Option key={i} value={desc.ID}>
            {desc.DESCR_CONTA}
        </Option>
    )


    return options
}



export { loadCartao, loadCategoria, loadCategoriaReceita, loadCartaoReal, loadConta }