const listHome = Registros => {

    console.log('action', Registros)

    return ({
        type: 'LIST_HOME',
        payload: Registros
    })
}


export { listHome }