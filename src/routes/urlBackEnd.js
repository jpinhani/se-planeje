
// const urlBackend = 'http://seplaneje-com.umbler.net/'
const urlBackend = 'http://localhost:8082/'

const userID = () => localStorage.getItem('userId');

const config = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});


export { urlBackend, config, userID }