const INITIAL_STATE = 'testqweqweqwewqeqweqwee'

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'UPDATE_ALL_USER':
      state = action.payload
      return state
    default:
      return state
  }
}