const addExpense = expense => ({
    type: 'INSERT_EXPENSE',
    payload: expense
})

const listExpenses = expenses => {

    console.log('action', expenses)

    return ({
        type: 'LIST_EXPENSE',
        payload: expenses
    })
}

export { addExpense, listExpenses }