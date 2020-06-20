const addRevenue = revenue => ({
    type: 'INSERT_REVENUE',
    payload: revenue
})

const listRevenues = revenues => {

    return ({
        type: 'LIST_REVENUE',
        payload: revenues
    })
}

export { addRevenue, listRevenues }