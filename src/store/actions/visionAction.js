const addVision = category => ({
  type: 'INSERT_VISION',
  payload: category
})

const listVisions = categorys => {
  return ({
      type: 'LIST_VISION',
      payload: categorys
  })
}

export { addVision, listVisions }