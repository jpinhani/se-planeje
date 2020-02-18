const login = token => localStorage.setItem('token', token)

const logout = () => localStorage.removeItem('token')

const isLogged = () => !!localStorage.getItem('token')

export { login, logout, isLogged }