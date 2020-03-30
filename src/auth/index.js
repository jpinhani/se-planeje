const login = (userId, tokenovo) => {
    localStorage.setItem('userId', userId)
    localStorage.setItem('token', tokenovo)
}

const logout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('token')
}
const isLogged = () => !!localStorage.getItem('token')

export { login, logout, isLogged }