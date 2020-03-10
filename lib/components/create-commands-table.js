const table = require('table')
const chalk = require('chalk')
const maybe = require('maybe-include')
const { is, capitalize } = require('../utils')

const createCommandsTable = (command, language) => {
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

	if (command.programCommandsRaw.length === 0) return ''

	const programCommands = Object.entries(command.programCommandsRaw)
		.map(([commandName, cmd]) => {
			return {
				name: commandName,
				description: cmd.description,
				arguments: cmd.arguments.map(arg => {
					return {
						name: arg.name,
						description: arg.description,
						...(arg.type === 'subcommand' && is.plainObject(arg.options) && {
							options: Object.entries(arg.options).map(([key, value]) => ({
								value: key,
								...value
							}))
						})
					}
				})
			}
		})

	const headerRow = [
		chalk.bold.blue(capitalize(language.internal.command)),
		chalk.bold.blue(capitalize(language.internal.description)),
		chalk.bold.blue(`${capitalize(language.internal.command)} ${capitalize(language.internal.arguments)}`),
	]

	const commandRows = programCommands.map(({ name, description, arguments }) => [
		name,
		description,
		`${arguments.map(obj => obj.options ? obj.options.map(opt => opt.value).join('|') : obj.name).join(' ')}`,
	])

	const commandsTable = [
		headerRow,
		...commandRows
	]

	return table.table(commandsTable, settings).trim()
}

module.exports = createCommandsTable
