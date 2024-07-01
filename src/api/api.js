import axios from 'axios'
import config from '../public/config'

const Api = () => {
    const authToken = localStorage.getItem('authToken')
    return axios.create({
        baseURL: config.api,
        withCredentials: false,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: authToken ? `Bearer ${authToken}` : null,
            'accept-language': localStorage.getItem('i18nextLng')
        }
    })
}

export default Api