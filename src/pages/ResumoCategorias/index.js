import React, { useEffect, useCallback } from 'react';
import { GetRequest } from '../../components/crudSendAxios/crud';

export default (props) => {

    const novosDados = useCallback(async () => {
        return await GetRequest('api/categorias')
    }, [])


    const requestApi = useCallback(async () => {
        const categorias = await novosDados();
        const dados = props.data;
        const visao = props.visao

        console.log('categorias', categorias);
        console.log('dados', dados);
        console.log('visao', visao);
    }, [novosDados, props.data, props.visao])

    useEffect(() => {
        requestApi()
    }, [requestApi])


    return (
        <div>
            Teste
        </div>
    )
}