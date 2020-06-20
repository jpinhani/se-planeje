const addExpense = expense => ({
    type: 'INSERT_EXPENSE',
    payload: expense
})

const listExpenses = expenses => {

    return ({
        type: 'LIST_EXPENSE',
        payload: expenses
    })
}

export { addExpense, listExpenses }