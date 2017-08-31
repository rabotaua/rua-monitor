export const getTokenData = (token) => {
	if (!token || !token.length) return { aud: '', email: '', exp: 0, given_name: '', iat: 0, iss: '', nbf: '', role: [], unique_name: '' }

	return JSON.parse(window.atob(token.split('.').splice(1, 1).shift().replace('-', '+').replace('_', '/')))
}