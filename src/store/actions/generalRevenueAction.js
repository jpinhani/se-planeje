const addRevenue = revenue => ({
    type: 'INSERT_REVENUE',
    payload: revenue
})

const listRevenues = revenues => {

    console.log('action', revenues)

    return ({
        type: 'LIST_REVENUE',
        payload: revenues
    })
}

export { addRevenue, listRevenues }