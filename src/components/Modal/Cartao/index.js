import React, { useState } from 'react'
import { Icon, Modal, Input } from 'antd'
import 'antd/dist/antd.css';
import './styles.scss'


export default () => {
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


    return <div classname='ajustaModal'>
        <Icon type="plus-circle" style={{ fontSize: '36px', color: '#08c' }} title='Adicionar novo Cartão' theme="twoTone" onClick={showModal} />
        <Modal
            title="Basic Modal"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <form>
                <Input name='natureDescription' placeholder="Informe o nome do Cartão de Crédito" />
                <Input type='number' max='31' min='1' name='statusDescription' placeholder="Informe o dia de Vencimento da Fatura " />
                <Input type='number' max='31' min='1' name='statusDescription' placeholder="Informe o melhor dia de Compra" />
            </form>
        </Modal>
    </div >


}