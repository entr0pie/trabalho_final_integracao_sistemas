// src/services/authService.js
const axios = require('axios');

async function isAuthenticated(token) {

    try {
        const res = await axios.get('http://auth-api.local/verify', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.authenticated === true;
    } catch(err) {
        return false;
    }
}

module.exports = { isAuthenticated };