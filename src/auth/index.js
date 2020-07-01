import moment from 'moment';

const login = (userId, tokenovo) => {
    localStorage.setItem('userId', userId)
    localStorage.setItem('token', tokenovo)
    localStorage.setItem('date', moment(new Date()).format("YYYY/MM/DD HH:mm:ss"))
}

const logout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('token')
    localStorage.removeItem('date')
}


const isLogged = () => {

    if (localStorage.getItem('date')) {
        const DataUltimoLogin = localStorage.getItem('date')

        let Limite = moment(moment(DataUltimoLogin).add(1, 'hour')).format("YYYY/MM/DD HH:mm:ss")

        let Agora = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");

        const res = (Agora <= Limite) ? !!localStorage.getItem('token') : logout()


        return res

    } else {
        return false
    }
}

export { login, logout, isLogged }