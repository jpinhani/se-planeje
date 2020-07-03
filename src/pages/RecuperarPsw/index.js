import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { urlBackend } from './../../services/urlBackEnd'
import axios from 'axios';

export default (props) => {
    const [visible, setVisible] = useState(false);
    const [mail, setMail] = useState('');
    const [digits, setLastDigits] = useState('');

    async function handleEnvia(e) {
        e.preventDefault();
        const body = {
            mail: mail,
            lastdigits: digits
        }

        const rs = await axios.post(`${urlBackend}api/envpsw`, body)



        if (rs.data !== 'ok')
            return message.error({
                type: "error",
                content: "Não foi possível encontrar essa conta no SEPLANJE, em caso de duvidas entre em contato conosco.",
                duration: 15
            })

        message.open({
            type: "success",
            content: "Um Email foi enviado para você com as definições de recuperação de Senha, caso tenha duvidas entre em contato conosco",
            duration: 15
        })

        setVisible(false)

    }

    return (
        <div>
            <Button type='link' onClick={() => setVisible(true)} >Esqueci Minha Senha</Button>
            <Modal
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={handleEnvia}
                title='Você receberá em seu Email cadastrado os passos para redefinição de Senha.'
            >
                <Input type='email' name='Email' onChange={valor => setMail(valor.target.value)} />
                <Input
                    data-ls-module="charCounter"
                    required
                    type="text"
                    maxLength={4}
                    title='Somente numeros'
                    placeholder="Informe os 4 ultimos Digitos do Cartão utilizado na Assinatura SEPLANEJE"
                    name="lastDigits"
                    onChange={valor => setLastDigits(valor.target.value)} />
                {/* <Input type='email' name='Email' onChange={valor => setMail(valor.target.value)} /> */}
            </Modal>

        </div >
    )
}