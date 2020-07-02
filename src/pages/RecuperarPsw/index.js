import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';

export default (props) => {
    const [visible, setVisible] = useState(false);

    return (
        <div>
            <Button type='link' /*onClick={() => setVisible(true)}*/ >Esqueci Minha Senha</Button>
            <Modal
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={() => console.log("Teste de Ok")}
            >
                <Input type='email' name='Email' />
            </Modal>
        </div>
    )
}