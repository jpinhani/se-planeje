
const urlBackend = 'http://seplaneje-com.umbler.net/'
// const urlBackend = 'http://localhost:8082/'


const USER_TOKEN = localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${USER_TOKEN}` }
};

const userID = localStorage.getItem('userId')

export { urlBackend, config, userID }