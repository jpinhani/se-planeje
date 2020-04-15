const listFaturaPaga = FaturaReal => {

    console.log('action', FaturaReal)

    return ({
        type: 'LIST_FATURAREAL',
        payload: FaturaReal
    })
}


export { listFaturaPaga }