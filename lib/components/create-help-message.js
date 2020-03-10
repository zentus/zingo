const chalk = require('chalk')
const createOptionsTable = require('./create-options-table')
const createCommandsTable = require('./create-commands-table')
const { is, assert, capitalize } = require('../utils')

const createHelpMessage = (creationConfig = {}, language, languageCode, mergedOptions, command) => {
	mergedOptions.forEach(option => assert.string(option.option))

	const projectName = creationConfig.name || creationConfig.package.name
	const header = `${chalk.bold(projectName)} ${chalk.bold('v' + creationConfig.package.version)}`
	const optionsTable = createOptionsTable(mergedOptions, language)
	const commandsTable = createCommandsTable(command, language)

	const finalCommands = commandsTable ? `${chalk.bold(capitalize(language.internal.commands))}:\n\n${commandsTable}\n` : ''
	const finalOptions = optionsTable ? `${chalk.bold(capitalize(language.internal.options))}:\n\n${optionsTable}\n` : ''
	const commandsAndOptions = `${finalCommands}${finalCommands ? '\n' : ''}${finalOptions}`

	const bin = creationConfig.package.bin ? Object.keys(creationConfig.package.bin)[0] : creationConfig.bin || projectName

	const usageCommand = commandsTable ? `[${language.internal.command}] [${language.internal.command} ${language.internal.arguments}] ` : ''
	const defaultUsage = `${usageCommand}[${language.internal.options}]`
	const usage = (
		is.function(creationConfig.usage)
			? creationConfig.usage(language, languageCode)
			: is.string(creationConfig.usage) && creationConfig.usage
	) || defaultUsage

	const template = `
${header}

${chalk.bold(language.internal.usage)}:

${chalk.bold(`$ ${bin} ${usage}`)}

${commandsAndOptions}
`.trim()

	return template
}

module.exports = createHelpMessage
