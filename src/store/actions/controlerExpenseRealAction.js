
const listExpenseControlerPaga = expenseReals => {

    console.log('action', expenseReals)

    return ({
        type: 'LIST_EXPENSEREALCONTROLER',
        payload: expenseReals
    })
}


export { listExpenseControlerPaga }