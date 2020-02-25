import { useState } from 'react'
import { Table, Icon, Modal } from 'antd'
import 'antd/dist/antd.css';
import './styles.scss'

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
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
    </Modal>
</div>


