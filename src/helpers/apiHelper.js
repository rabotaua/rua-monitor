import axios from 'axios'

export const getTokenApi = (username, password) => {
	return axios.post('https://adjwt-api.rabota.ua/token', {username, password})
}

export const getData = (query) => {
	const token = localStorage.getItem('authToken')

	return axios.post('https://rualogs.appspot.com/query', query, {
		headers: { 'Authorization': token }
	}).then(({data}) => data).catch(e => {
		if(e && e.response && e.response.status === 401) {
			localStorage.removeItem('authToken')
			window.location = '/rua-monitor'
		}
		else {
			throw e
		}
	})
}