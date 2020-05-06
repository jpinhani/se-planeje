
const listRevenuesReal = revenues => {

    console.log('action', revenues)

    return ({
        type: 'LIST_REVENUE_REAL',
        payload: revenues
    })
}

export { listRevenuesReal }