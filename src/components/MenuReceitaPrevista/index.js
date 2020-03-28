import React, { useState } from 'react'

import { Switch, Button, message } from 'antd'
import { urlBackend, config, userID } from '../../routes/urlBackEnd'

import { useDispatch } from 'react-redux'
import axios from 'axios'

export default (props) => {

    const dispatch = useDispatch()

    const [deleteReceita, setDeleteReceita] = useState('Deletar Receita Selecionada')

    function handleReceitaDelete(e) {
        e ? setDeleteReceita('Deletar Todas Receitas do grupo a partir da Selecionada') :
            setDeleteReceita('Deletar Receita Selecionada');
    }

    async function handleDelete() {
        const valor = {
            idUser: userID(),
            dataPrevista: props.data.DATANOVA,
            valorPrevisto: props.data.VL_PREVISTO2,
            categoria: props.data.ID_CATEGORIA,
            parcela: props.data.NUM_PARCELA,
            descrDespesa: props.data.DESCR_DESPESA,
            valueEdit: deleteReceita,
            idGrupo: props.data.ID_GRUPO,
        }

        const body = valor
        const endpoint = `${urlBackend}api/receitas/teste/${props.data.ID}`

        const resultStatus = await axios.put(endpoint, body, config)

        if (resultStatus.status === 200) {

            message.success('Receita Excluida com Sucesso', 5)

            const endpointAPIget = `${urlBackend}api/receitas/${body.idUser}`
            const result = await axios.get(endpointAPIget)

            const receita = result.data

            dispatch({
                type: 'LIST_REVENUE',
                payload: receita
            })

        } else {
            message.erro('A Receita não pode ser Excluida, Error ' + resultStatus.status, 5)
        }

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





