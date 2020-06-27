import React, { useEffect, useCallback, useState } from 'react';
import { GetRequest } from '../../components/crudSendAxios/crud';

import { Button } from 'antd';

import './styles.scss';

export default () => {

    const [detailsUsers, setDetailsUsers] = useState([]);

    const details = useCallback(async () => {
        const detailsUser = await GetRequest('api/getUserData');

        setDetailsUsers(detailsUser.length > 0 ? detailsUser[0] : []);

    }, [])

    useEffect(() => {
        details();
    }, [details]);


    // EMAIL: "jp@seplaneje.com.br"
    // ID: 6
    // PAYSTATUS: "trialing"
    // STATUS: "Ativo"
    // date_Created: null
    // idtrans: 1
    // manage_url: null
    // namePlan: null
    // old_status: null
    return (
        <div className="PaymentContainer">
            <div>
                <div>Email</div>
                <p>{detailsUsers.EMAIL}</p>
            </div>
            <div>
                <div>Id do usuário</div>
                <p>{detailsUsers.ID}</p>
            </div>
            <div>
                <div>Status do Usuário</div>
                <p>{detailsUsers.STATUS}</p>
            </div>
            <div>
                <div>Data de Criação</div>
                <p>{detailsUsers.date_Created}</p>
            </div>
            <div>
                <div>ID Transação</div>
                <p>{detailsUsers.idtrans}</p >
            </div>
            <div>
                <div>Gerenciar Pagamento</div>
                <p><Button type="link" block onClick={() => window.open(detailsUsers.manage_url, '_blank')}>
                    Clique Aqui Para Editar o Pagamento Seplaneje
                    </Button></p >
            </div>
            <div>
                <div>Nome do Plano Atual</div>
                <p>{detailsUsers.namePlan}</p >
            </div>
            <div>
                <div>Status Antigo</div>
                <p>{detailsUsers.old_status}</p >
            </div>
            <div>
                <div>Status de Pagamento Atual</div>
                <p>{detailsUsers.PAYSTATUS}</p>
            </div>
        </div>
    )
}