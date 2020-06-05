import React, { useEffect, useCallback } from 'react';
// import { GetRequest } from '../../components/crudSendAxios/crud';
import { SaldoCategoria } from '../../components/ResumoCategoria/'

export default (props) => {

    // const novosDados = useCallback(async () => {
    //     return await GetRequest('api/categorias')
    // }, [])


    const requestApi = useCallback(async () => {
        // const categorias = await novosDados();

        const dados1 = SaldoCategoria(props.data, props.visao, 'PREVISTO', props.cartao);
        const dados2 = SaldoCategoria(props.data, props.visao, 'REAL', props.cartao);
        const dados3 = SaldoCategoria(props.data, props.visao, 'FORECAST', props.cartao);


        console.log('Previsto', dados1);
        console.log('Real', dados2);
        console.log('Forecast', dados3);

    }, [/* novosDados, */ props.data, props.visao, props.cartao])

    useEffect(() => {
        requestApi()
    }, [requestApi])


    return (
        <div>
            Teste
        </div>
    )
}