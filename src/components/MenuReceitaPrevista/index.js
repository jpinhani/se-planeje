import React, { useState } from 'react'

import { Switch, Button } from 'antd'
import { userID } from '../../services/urlBackEnd'

import { GetRequest, UpdateRequest } from '../crudSendAxios/crud'
import { verifySend } from '../verifySendAxios/index'

import { useDispatch } from 'react-redux'

export default (props) => {

    const dispatch = useDispatch()

    const [deleteReceita, setDeleteReceita] = useState('Deletar Receita Selecionada')

    function handleReceitaDelete(e) {
        e ? setDeleteReceita('Deletar Todas Receitas do grupo a partir da Selecionada') :
            setDeleteReceita('Deletar Receita Selecionada');
    }

    async function handleDelete() {
        const valor = {
            id: props.data.ID,
            idUser: userID(),
            dataPrevista: props.data.DATANOVA,
            valorPrevisto: props.data.VL_PREVISTO2,
            categoria: props.data.ID_CATEGORIA,
            parcela: props.data.NUM_PARCELA,
            descrReceita: props.data.DESCR_RECEITA,
            valueEdit: deleteReceita,
            idGrupo: props.data.ID_GRUPO,
        }

        const body = valor

        const resultStatus = await UpdateRequest(body, 'api/receitas/teste')
        verifySend(resultStatus, 'DELETE', body.descrReceita)

        const Data = resultStatus === 200 ? await GetRequest('api/receitas') : {}


        dispatch({
            type: 'LIST_REVENUE',
            payload: Data
        })


    }

    return (<div>
        <div>
            {deleteReceita}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Switch
                style={{ width: '10%' }}
                title='Habilite para Excluir Todas as Receitas'
                onChange={handleReceitaDelete}
            />
            <Button onClick={handleDelete}>Excluir</Button>
        </div>
    </div>
    )
}





