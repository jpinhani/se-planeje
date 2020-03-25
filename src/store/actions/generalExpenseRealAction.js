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

export { addExpense, listExpensesPaga }