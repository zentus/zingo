const is = require('@sindresorhus/is')
const assert = is.assert

const capitalize = string => string[0].toUpperCase() + string.slice(1)

module.exports = {
	is,
	assert,
	capitalize
}
