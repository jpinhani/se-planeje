const listFaturaContabilizada = FaturaReal => {

    console.log('action', FaturaReal)

    return ({
        type: 'LIST_FATURACONTABILIZADA',
        payload: FaturaReal
    })
}


export { listFaturaContabilizada }