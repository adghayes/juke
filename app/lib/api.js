
const API = {
    setToken(token){
        window.localStorage.setItem('sessionToken', token)
    },

    getToken(){
        window.localStorage.getItem('sessionToken')
    },

    loggedIn(){
        return !!this.getToken()
    }
}

export default API