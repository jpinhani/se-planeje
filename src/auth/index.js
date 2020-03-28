const login = (token, userId) => {
    localStorage.setItem('userId', userId)
    localStorage.setItem('token', token)
}

const logout = () => {

    localStorage.removeItem('token')
    localStorage.removeItem('userId')
}
const isLogged = () => !!localStorage.getItem('token')

export { login, logout, isLogged }