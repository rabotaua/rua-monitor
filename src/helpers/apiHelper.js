import axios from 'axios'

export const getTokenApi = (username, password) => {
	return axios.post('https://adjwt-api.rabota.ua/token', {username, password})
}

export const getData = (query) => {
	const token = localStorage.getItem('authToken')

	return axios.post('https://bigquery.azurewebsites.net/query', { query }, {
		headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
	}).then(({data}) => data).catch(e => {
		if(e && e.response && e.response.status === 401) {
			localStorage.removeItem('authToken')
			window.location = '/rua-monitor/'
		}
		else {
			throw e
		}
	})
}