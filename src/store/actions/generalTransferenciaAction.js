const listTransferencia = transferencia => {

    return ({
        type: 'LIST_TRANSFERENCIA',
        payload: transferencia
    })
}


export { listTransferencia }