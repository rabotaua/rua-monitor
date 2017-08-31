import dateFns from 'date-fns'
var ruLocale = require('date-fns/locale/ru')

export const formatDateTime = (dtString, format = 'DD-MM-YYYY HH:mm') => {
	const dateObj = new Date(dtString)
	return dateFns.format(dateObj, format, {locale: ruLocale})
}