import React, { useEffect, useCallback } from 'react';
import { cartaoRealizado, cartaoPrevisto, realizadas, previstas } from '../../components/ResumoDespesa'

export default (props) => {

    const ResumoDespesa = useCallback(() => {
        const despesas = props.data;
        const visaoSetada = props.visao;
        const cartaoListagem = props.cartao;
        const cartaoReal = cartaoRealizado(despesas, cartaoListagem, visaoSetada);
        const cartaoPrev = cartaoPrevisto(despesas, cartaoListagem, visaoSetada);
        const real = realizadas(despesas, visaoSetada);
        const prev = previstas(despesas, visaoSetada);

        console.log('cartaoReal', cartaoReal)
        console.log('cartaoPrevisto', cartaoPrev)
        console.log('realizadas', real)
        console.log('previstas', prev)
    }, [props.data, props.visao, props.cartao])

    useEffect(() => {
        ResumoDespesa()
    }, [ResumoDespesa])

    return (
        <div>
            Tabela de Despesas
        </div>
    )
}