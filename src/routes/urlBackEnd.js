
const urlBackend = 'https://seplaneje-com.umbler.net/'
// process.env.REACT_APP_API_URL
// process.env.REACT_APP_API_URL
// 'http://localhost:8082/' ||
// const urlBackend = 'http://seplaneje-com.umbler.net:3000/'

// const urlBackend = process.env.AMBIENTE

// require('dotenv/config');
// const dot = require('dotenv/config')

// const urlBackend = 'http://localhost/8082/'



const userID = () => localStorage.getItem('userId');

const config = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});


export { urlBackend, config, userID }