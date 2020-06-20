import React, { useState } from 'react'

import { Switch, Button } from 'antd'
import { userID } from '../../services/urlBackEnd'

import { GetRequest, UpdateRequest } from '../crudSendAxios/crud'
import { verifySend } from '../verifySendAxios/index'

import { useDispatch } from 'react-redux'

export default (props) => {

    const dispatch = useDispatch()

    const [deleteDespesa, setDeleteDespesa] = useState('Deletar Despesa Selecionada')
    function handleDespesaDelete(e) {
        e ? setDeleteDespesa('Deletar Todas Despesas do grupo a partir da Selecionada') :
            setDeleteDespesa('Deletar Despesa Selecionada');

    }

    async function handleDelete() {
        const valor = {
            id: props.data.ID,
            idUser: userID(),
            dataPrevista: props.data.DATANOVA,
            valorPrevisto: props.data.VL_PREVISTO2,
            cartao: props.data.ID_CARTAO,
            categoria: props.data.ID_CATEGORIA,
            parcela: props.data.NUM_PARCELA,
            descrDespesa: props.data.DESCR_DESPESA,
            valueEdit: deleteDespesa,
            idGrupo: props.data.ID_GRUPO,
        }

        const body = valor

        const resultStatus = await UpdateRequest(body, 'api/despesas/delete')
        verifySend(resultStatus, 'DELETE', body.descrDespesa)

        const despesa = resultStatus === 200 ? await GetRequest('api/despesas') : {}

        dispatch({
            type: 'LIST_EXPENSE',
            payload: despesa
        })

    }

    return (<div>
        <div>
            {deleteDespesa}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Switch
                style={{ width: '10%' }}
                title='Habilite para Excluir Todas as Despesas'
                onChange={handleDespesaDelete}
            />
            <Button onClick={handleDelete}>Salvar</Button>
        </div>
    </div>
    )
}





