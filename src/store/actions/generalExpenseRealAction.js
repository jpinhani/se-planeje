const addExpense = expenseReal => ({
    type: 'INSERT_EXPENSEREAL',
    payload: expenseReal
})

const listExpensesPaga = expenseReals => {

    console.log('action', expenseReals)

    return ({
        type: 'LIST_EXPENSEREAL',
        payload: expenseReals
    })
}


const listFaturaPaga = FaturaReal => {

    console.log('action', FaturaReal)

    return ({
        type: 'LIST_FATURAREAL',
        payload: FaturaReal
    })
}


export { addExpense, listExpensesPaga, listFaturaPaga }