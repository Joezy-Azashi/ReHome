/**
 *
 * @param {string} phoneNumberString number to return in the format +1 (123) 456-7890
 * @returns
 */
 export function formatPhoneNumber(phoneNumberString) {
	var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
	var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
	if (match) {
		// var intlCode = match[1] ? '+1 ' : '';
		return ['(', match[2], ') ', match[3], '-', match[4]].join('');
	}
	return null;
}

export function convertCurrencySystem(labelValue) {
	// Nine Zeroes for Billions
	return Math.abs(Number(labelValue)) >= 1.0e9
		? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + 'B'
		: // Six Zeroes for Millions
		Math.abs(Number(labelValue)) >= 1.0e6
		? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + 'M'
		: // Three Zeroes for Thousands
		Math.abs(Number(labelValue)) >= 1.0e3
		? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
		: Math.abs(Number(labelValue));
}

export function getAllDaysInMonth(year, month) {
	const today = new Date().getDate();
	const date = new Date(year, month, today);

	const dates = [];

	while (date.getMonth() === month) {
		dates.push(new Date(date).toDateString());
		date.setDate(date.getDate() + 1);
	}

	return dates;
}
