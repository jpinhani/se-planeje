



const urlBackend = process.env.REACT_APP_HOSTBACKEND



const userID = () => localStorage.getItem('userId');

const config = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});


export { urlBackend, config, userID }