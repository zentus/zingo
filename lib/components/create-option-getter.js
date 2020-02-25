const { is, assert } = require('../utils')

const createOptionGetter = (options = [], passedFlags) => {
	const getOption = input => {
		assert.string(input)

		const notPassed = {
			passed: false,
			input: null
		}

		if (options.length === 0) {
			return notPassed
		}

		const optionItem = options.find(({ option, shorthand }) => input === option || input === shorthand)

		if (!optionItem) return false

		const passedOption = passedFlags.find(argument =>
			argument === `--${optionItem.option}` ||
			argument === `-${optionItem.shorthand}`
		)

		const nextArgument = passedOption	&& passedFlags[passedFlags.indexOf(passedOption) + 1]
		const argumentInput = (passedOption && is.string(nextArgument) && !options.find(optionItem =>
			nextArgument === `--${optionItem.option}` ||
			nextArgument === `-${optionItem.shorthand}`
		) && nextArgument) || null

		return passedOption ? {
			passed: true,
			input: argumentInput
		} : notPassed
	}

	return getOption
}

module.exports = createOptionGetter
