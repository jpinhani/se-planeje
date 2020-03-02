const addCategory = category => ({
    type: 'INSERT_CATEGORY',
    payload: category
})

const listCategorys = categorys => {

    // console.log('action', categorys)

    return ({
        type: 'LIST_CATEGORY',
        payload: categorys
    })
}

export { addCategory, listCategorys }