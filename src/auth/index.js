import moment from 'moment';

const login = (userId, tokenovo) => {
    localStorage.setItem('userId', userId)
    localStorage.setItem('token', tokenovo)
    localStorage.setItem('date', moment(new Date()).format("DD/MM/YYYY HH:mm:ss"))
}

const logout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('token')
    localStorage.removeItem('date')
}
const isLogged = () => {

    if (localStorage.getItem('date')) {
        const DataUltimoLogin = localStorage.getItem('date')

        let Limite = moment(moment(DataUltimoLogin, "DD/MM/YYYY HH:mm:ss").add(1, 'hour')).format("DD/MM/YYYY HH:mm:ss")


        let Agora = moment(new Date()).format("DD/MM/YYYY HH:mm:ss");

        const state = Agora < Limite ? !!localStorage.getItem('token') : logout()

        return state

    } else {
        return false
    }
}

export { login, logout, isLogged }