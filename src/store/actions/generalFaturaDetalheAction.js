
const listFaturadetalhe = faturaDetalhe => {

    return ({
        type: 'LIST_FATURADETALHE',
        payload: faturaDetalhe
    })
}

export { listFaturadetalhe }