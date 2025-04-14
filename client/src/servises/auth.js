


export const AuthService = {
    async login(email, password) {
        const response = await axios.post < IAuthResponse > (
            `${API_URL}${getAuthUrl('/login')}`,
            {
                email,
                password,
            }
        )

        if (response.data.accessToken) {
            saveToStorage(response.data)
        }

        return response
    },
    logout() {
        removeTokensStorage()
        localStorage.removeItem('user')
    },

}