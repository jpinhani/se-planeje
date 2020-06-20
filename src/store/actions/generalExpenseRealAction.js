const addExpense = expenseReal => ({
    type: 'INSERT_EXPENSEREAL',
    payload: expenseReal
})

const listExpensesPaga = expenseReals => {

    return ({
        type: 'LIST_EXPENSEREAL',
        payload: expenseReals
    })
}


export { addExpense, listExpensesPaga }