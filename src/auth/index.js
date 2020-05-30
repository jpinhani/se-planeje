import moment from 'moment';

const login = (userId, tokenovo) => {
    localStorage.setItem('userId', userId)
    localStorage.setItem('token', tokenovo)
    localStorage.setItem('date', moment())
}

const logout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('token')
    localStorage.removeItem('date')
}
const isLogged = () => {

    const DataUltimoLogin = localStorage.getItem('date')
    const Limite = moment(DataUltimoLogin).add(1, 'h')
    const Agora = moment();

    const state = Agora < Limite ? !!localStorage.getItem('token') : logout()

    return state
}

export { login, logout, isLogged }