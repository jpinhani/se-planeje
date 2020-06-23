import React, { useState } from 'react';
import { Input } from 'antd';

export default (props) => {

    const [password, setPassword] = useState('');

    return (
        <div>
            <div className="ContainerNovaSenha">
                <Input
                    type='password' placeholder="Nova Senha"
                    onChange={e => setPassword(e.target.value)}
                />
                <Input
                    type='password' placeholder="Confirmar Nova Senha"
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
        </div>
    )
}