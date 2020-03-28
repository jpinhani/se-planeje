const login = token => localStorage.setItem('token', token)

const logout = () => {

    localStorage.removeItem('token')
    localStorage.removeItem('userId')
}
const isLogged = () => !!localStorage.getItem('token')

export { login, logout, isLogged }