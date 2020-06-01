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
        // console.log('Limite', Limite)
        // Limite = moment(Limite).format('DD/MM/YYYY H:MM')

        let Agora = moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
        // Agora = moment(Agora).format('DD/MM/YYYY H:MM')

        // console.log('Agora', Agora)
        const state = Agora < Limite ? !!localStorage.getItem('token') : logout()

        return state
        // return false
    } else {
        return false
    }
}

export { login, logout, isLogged }