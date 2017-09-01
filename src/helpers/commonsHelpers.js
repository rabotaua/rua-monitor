export const getTokenData = (token) => {
	if (!token || !token.length) return { aud: '', email: '', exp: 0, given_name: '', iat: 0, iss: '', nbf: '', role: [], unique_name: '' }

	return JSON.parse(window.atob(token.split('.').splice(1, 1).shift().replace('-', '+').replace('_', '/')))
}

export const checkExpireToken = (token) => {
	if (!token || !token.length) return false

	const tokenData = getTokenData(token)
	if(!tokenData.hasOwnProperty('exp')) return false

	return (tokenData.exp * 1000) - Date.now() > 1 // check expire token
}