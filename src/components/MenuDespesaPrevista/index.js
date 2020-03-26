import React, { useState } from 'react'

import { Switch, Button, message } from 'antd'
import { urlBackend, config, userID } from '../../routes/urlBackEnd'

import { useDispatch } from 'react-redux'
import axios from 'axios'

export default (props) => {

    const dispatch = useDispatch()

    const [deleteDespesa, setDeleteDespesa] = useState('Deletar Despesa Selecionada')
    function handleDespesaDelete(e) {
        e ? setDeleteDespesa('Deletar Todas Despesas do grupo a partir da Selecionada') :
            setDeleteDespesa('Deletar Despesa Selecionada');

        console.log(deleteDespesa)
    }

    async function handleDelete() {
        const valor = {
            idUser: userID,
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

        const endpoint = `${urlBackend}api/despesas/delete/${props.data.ID}`

        const resultStatus = await axios.put(endpoint, body, config)

        if (resultStatus.status === 200) {

            message.success('   Despesa Excluida com Sucesso', 5)

            const endpointAPIget = `${urlBackend}api/despesas/${body.idUser}`

            const result = await axios.get(endpointAPIget)

            const despesa = result.data

            dispatch({
                type: 'LIST_EXPENSE',
                payload: despesa
            })

        } else {
            message.erro('   A Despesa não pode ser Excluida, Error ' + resultStatus.status, 5)
        }

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





