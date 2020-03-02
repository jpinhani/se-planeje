const INITIAL_STATE = []

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'ADD_CATEGORY':
            state = action.payload
            return state
        case 'LIST_CATEGORY':
            // console.log('reducer', action.payload)
            state = action.payload
            return state

        default:
            return state
    }
}