const listHome = Registros => {

    return ({
        type: 'LIST_HOME',
        payload: Registros
    })
}


export { listHome }