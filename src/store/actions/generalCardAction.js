
const addCard = card => {
  return ({
    type: 'INSERT_CARD',
    payload: card
  })
}

const listCards = cards => {

  return ({
    type: 'LIST_CARD',
    payload: cards
  })
}

export { addCard, listCards }