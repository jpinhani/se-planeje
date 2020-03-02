const addAcount = acount => ({
    type: 'INSERT_ACOUNT',
    payload: acount
})

const listAcounts = acounts => {

    // console.log('action', acounts)

    return ({
        type: 'LIST_ACOUNT',
        payload: acounts
    })
}

export { addAcount, listAcounts }