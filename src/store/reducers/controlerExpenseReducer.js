const INITIAL_STATE = []

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'LIST_EXPENSEMETACONTROLER':
            state = action.payload
            return state
        default:
            return state
    }
}