import { getToken } from './auth'

const API = {
    BACKEND: 'http://localhost:3000/',

    authHeader: () => ({ 'Authorization': 'bearer ' + getToken() }),

    contentHeader: { 'Content-Type': 'application/json'}
}

export default API

