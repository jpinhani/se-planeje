
const listRevenuesReal = revenues => {

    return ({
        type: 'LIST_REVENUE_REAL',
        payload: revenues
    })
}

export { listRevenuesReal }