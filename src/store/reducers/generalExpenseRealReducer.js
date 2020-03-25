const INITIAL_STATE = []

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'ADD_EXPENSEREAL':
            state = action.payload
            return state
        case 'LIST_EXPENSEREAL':
            state = action.payload
            return state
        default:
            return state
    }
}