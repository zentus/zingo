const chalk = require('chalk')
const createOptionsTable = require('./create-options-table')
const { is } = require('../utils')

const createHelpMessage = (creationConfig = {}, language, languageCode, mergedOptions) => {
	const projectName = creationConfig.name || creationConfig.package.name
	const header = `${chalk.bold(projectName)} ${chalk.bold('v' + creationConfig.package.version)}`
	const optionsTable = createOptionsTable(mergedOptions, language)
	const bin = creationConfig.package.bin ? Object.keys(creationConfig.package.bin)[0] : creationConfig.bin || projectName
	const defaultUsage = `[${language.internal.command}] [${language.internal.options}]`
	const usage = (
		is.function(creationConfig.usage)
			? creationConfig.usage(language, languageCode)
			: is.string(creationConfig.usage) && creationConfig.usage
	) || defaultUsage

	const template = `
${header}

${language.internal.usage}:

${chalk.bold(`$ ${bin} ${usage}`)}

${optionsTable}
`.trim()

	return template
}

module.exports = createHelpMessage
