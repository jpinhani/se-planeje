import React, { useState } from 'react';
import { Input, Button, Form } from 'antd';
import { UpdateRequest } from '../../components/crudSendAxios/crud';
import { userID } from '../../services/urlBackEnd';
import { message } from 'antd'

import './style.scss';

export default (props) => {

    const [password, setPassword] = useState('');
    const [consPassword, setConsPassword] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        if (password !== consPassword)
            return message.error(`As senhas não são identicas`)

        if (password === undefined || password === '')
            return message.error(`Por Favor informar nova senha.`)

        const body = {
            id: userID(),
            password: password
        }
        const res = await UpdateRequest(body, 'api/alterpsw')
        res === 200 ?
            message.success(`Senha alterada Com sucesso`) :
            message.error(`Ocorreu um erro, tente novamente ou contate o suporte do SePlaneje`)
    }

    return (
        <div className="ContainerNovaSenha">
            <div><strong>Informar Nova Senha SEPLANEJE</strong></div>
            <Form onSubmit={handleSubmit}>
                <Input
                    type='password' placeholder="Nova Senha"
                    onChange={e => setPassword(e.target.value)}
                />
                <Input
                    type='password' placeholder="Confirmar Nova Senha"
                    onChange={e => setConsPassword(e.target.value)}
                />
                <Button type="primary" htmlType="submit"> Alterar Senha </Button>
            </Form>
        </div>
    )
}