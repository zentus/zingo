const chalk = require('chalk')
const deepMerge = require('deepmerge')
const defaults = require('./components/defaults')
const createOptionGetter = require('./components/create-option-getter')
const createConfig = require('./components/create-config')
const createHelpMessage = require('./components/create-help-message')
const findInReservedOptions = require('./components/find-in-reserved-options')
const { is, assert } = require('./utils')

const slicedArgs = process.argv.slice(2)
const passedFlags = slicedArgs.filter((arg, i) => arg.startsWith('-') || (is.string(slicedArgs[i - 1]) && slicedArgs[i - 1].startsWith('-')))
const passedCommand = is.string(slicedArgs[0]) && !slicedArgs[0].startsWith('-') ? slicedArgs[0] : false
const firstPassedFlag = slicedArgs.find(arg => arg.startsWith('-')) || false
const firstPassedFlagIndex = firstPassedFlag ? slicedArgs.indexOf(firstPassedFlag) : slicedArgs.length
const passedCommandArguments = is.string(passedCommand) ? slicedArgs.slice(1, firstPassedFlagIndex) : []

const createLanguageGetter = (creationConfig = {}, config) => {
	const languages = creationConfig.languages ? deepMerge(defaults.languages, creationConfig.languages) : defaults.languages

	const getLanguage = () => {
		const languageCode = config.get('languageCode')
		const language = languages[languageCode]

		return language
	}

	return getLanguage
}

class Zingo {
  constructor(creationConfig) {
		assert.plainObject(creationConfig)
		assert.plainObject(creationConfig.package)
		assert.string(creationConfig.package.name)

		if (creationConfig.languages) assert.plainObject(creationConfig.languages)

		if (!is.undefined(creationConfig.options)) {
			assert.array(creationConfig.options)
		}

		const config = createConfig(creationConfig)
		const getLanguage = createLanguageGetter(creationConfig, config)
		const language = getLanguage()
		const reservedOptions = [{
			option: 'version',
			shorthand: 'v',
			description: language.internal.display_version
		}, {
			option: 'help',
			shorthand: 'h',
			description: language.internal.display_help_message
		}]

		const programOptionsRaw = !is.array(creationConfig.options) ? [] : creationConfig.options
		const programOptions = programOptionsRaw
			.map(optionItem => ({
				...optionItem,
				...(is.function(optionItem.description) && {
					description: optionItem.description(language, config.get('languageCode'))
				})
			}))
			.filter(optionItem => !findInReservedOptions(reservedOptions, optionItem))

		const mergedOptions = [
			...programOptions,
			...reservedOptions
		]

		const programCommandsRaw = !is.plainObject(creationConfig.commands) ? [] : creationConfig.commands

		const validateCommandArgument = (commandArgument, type, argValue, commandArguments) => {
			if (type === 'value') {
				const parsedConditions = is.function(commandArgument.conditions) ? commandArgument.conditions(argValue) : {}
				const validated = is.function(commandArgument.validate) ? commandArgument.validate(argValue, parsedConditions) : true

				const allowedSubcommandOptionPassed = Boolean(commandArgument.allowedWithSubcommands && commandArgument.allowedWithSubcommands.find(allowed => {
					const foundSubcommand = commandArguments.find(cmdArg => cmdArg.type === 'subcommand' && cmdArg.name === allowed.name)
					const allowedOption = foundSubcommand && allowed.options.includes(foundSubcommand.argValue)

					return allowedOption
				}))

				return {
					isValid: is.array(commandArgument.allowedWithSubcommands) && validated ? allowedSubcommandOptionPassed : validated,
					reason: (is.array(commandArgument.allowedWithSubcommands) && !allowedSubcommandOptionPassed) ? 'disallowedSubcommand' : ''
				}
			}

			if (type === 'subcommand') {
				assert.plainObject(commandArgument.options)
				const isValid = Boolean(Object.keys(commandArgument.options).find(key => key === argValue))

				return {
					isValid,
					reason: !isValid ? 'invalidOption' : '',
					info: !isValid && `You passed "${argValue}", valid options of subcommand "${commandArgument.name}" are: ${Object.keys(commandArgument.options).join(', ')}`
				}
			}

			return false
		}

		const commandArguments = passedCommandArguments.map((argValue, index) => {
			const command = programCommandsRaw[passedCommand]
			if (!command) return false

			const commandArgument = command.arguments[index]
			if (!commandArgument) return false

			const type = commandArgument.type || 'value'

			return {
				name: commandArgument.name,
				commandArgument,
				type,
				argValue,
				index
			}
		}).filter(Boolean)

		const validatedCommandArguments = commandArguments.map(({commandArgument, type, argValue, index}) => {
			const {isValid, reason, info} = validateCommandArgument(commandArgument, type, argValue, commandArguments)

			if (reason === 'disallowedSubcommand') {
				return false
			}

			return {
				name: commandArgument.name,
				type,
				value: argValue,
				isValid,
				...(reason && {reason}),
				...(info && {info}),
			}
		}).filter(Boolean)

		const firstInvalidCommandArgument = validatedCommandArguments.find(cmdArg => !cmdArg.isValid)
		const firstInvalidCommandArgumentIndex = firstInvalidCommandArgument && validatedCommandArguments.indexOf(firstInvalidCommandArgument)
		const finalCommandArguments = firstInvalidCommandArgument ? validatedCommandArguments.slice(0, firstInvalidCommandArgumentIndex + 1) : validatedCommandArguments
		const commandArgumentsObject = finalCommandArguments.reduce((acc, cmdArg) => {
			return {
				...acc,
				[cmdArg.name]: {
					type: cmdArg.type,
					value: cmdArg.value,
					isValid: cmdArg.isValid
				}
			}
		}, {})

		const command = {
			passed: passedCommand,
			isValid: Boolean(Object.keys(programCommandsRaw).find(key => key === passedCommand)),
			arguments: commandArgumentsObject
		}

		const helpMessage = createHelpMessage(creationConfig, language, config.get('languageCode'), mergedOptions, {...command, programCommandsRaw})
		const getOption = createOptionGetter(mergedOptions, passedFlags)

		const start = () => {
			const helpOption = getOption('help')
			const versionOption = getOption('version')

			if (helpOption.passed) {
				console.log(helpMessage)
				process.exit(0)
			} else if (versionOption.passed) {
				console.log(creationConfig.package.version)
				process.exit(0)
			}
		}

    this.language = getLanguage();
		this.languageCode = config.get('languageCode');
		this.getOption = getOption;
		this.config = config;
		this.start = start;
		this.command = command
  }
}

module.exports = Zingo
