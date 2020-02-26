import React, { useState } from 'react'
import axios from 'axios'
import { Icon, Modal, Input } from 'antd'
import 'antd/dist/antd.css';
import './styles.scss'


export default () => {

    /* -------------------------------------  Comandos para Funcionamento do Modal*/
    const [visible, setVisible] = useState(false)

    function showModal() {
        setVisible(true)
    };

    function handleOk() {
        setVisible(false)
    };

    function handleCancel() {
        setVisible(false)
    };
    /* -------------------------------------  Comandos para Funcionamento do Modal*/

    const [cartao, InsertCartao] = useState(null)
    const [dtvencimento, InsertDtVencimento] = useState(null)
    const [diacompra, InsertDiaCompra] = useState(null)
    // const [status, InsertStatus] = useState(null)

    function handleCartao(event) {
        InsertCartao(event.target.value)
    }

    function handleDtVencimento(event) {
        // console.log(event.target)
        InsertDtVencimento(event.target.value)
    }

    function handleDiaCompra(event) {
        // console.log(event.target)
        InsertDiaCompra(event.target.value)
    }
    function handleSubmit(event) {
        event.preventDefault()

        const endpointAPI = 'http://localhost:8082/api/cartoes'

        const body = {
            idUser: 2,
            cartao: cartao,
            dtVencimento: dtvencimento,
            diaCompra: diacompra,
            status: "Ativo"
        }

        console.log(body)

        axios.post(endpointAPI, body).then(function (result) {
            console.log(result)
        }).catch(function (err) {
            console.log(err)
        })

    }


    return <div className='ajustaModal'>
        <Icon type="plus-circle" style={{ fontSize: '36px', color: '#08c' }} title='Adicionar novo Cartão' theme="twoTone" onClick={showModal} />
        <form onSubmit={handleSubmit}>
            <Modal
                title="Basic Modal"
                visible={visible}
                onOk={handleSubmit}
                onCancel={handleCancel}
            >

                <Input name='cartao' onChange={handleCartao} placeholder="Informe o nome do Cartão de Crédito" />
                <Input type='number' onChange={handleDtVencimento} max='31' min='1' name='dtVencimento' placeholder="Informe o dia de Vencimento da Fatura " />
                <Input type='number' onChange={handleDiaCompra} max='31' min='1' name='diaCompra' placeholder="Informe o melhor dia de Compra" />

            </Modal>
        </form>
    </div >


}