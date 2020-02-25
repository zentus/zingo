const table = require('table')
const chalk = require('chalk')

const createOptionsTable = (options, language, creatorConfig) => {
	const settings = {
		border: table.getBorderCharacters(`void`),
		columnDefault: {
			paddingLeft: 0,
			paddingRight: 6
		},
		drawHorizontalLine: () => {
			return false
		}
	}

	const headerRow = [
		chalk.bold.green(language.internal.option),
		chalk.bold.green(language.internal.shorthand),
		chalk.bold.green(language.internal.description)
	]

	const optionRows = options.map(({ option, shorthand, description, linebreak }) => linebreak ? ['', '', ''] : [
		`--${option}`,
		`-${shorthand}`,
		description
	])

	const optionsTable = [
		headerRow,
		...optionRows
	]

	return table.table(optionsTable, settings)
}

module.exports = createOptionsTable
