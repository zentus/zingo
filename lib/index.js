const chalk = require('chalk')
const deepMerge = require('deepmerge')
const defaults = require('./components/defaults')
const createOptionGetter = require('./components/create-option-getter')
const createConfig = require('./components/create-config')
const createOptionsTable = require('./components/create-options-table')
const createHelpMessage = require('./components/create-help-message')
const findInReservedOptions = require('./components/find-in-reserved-options')
const { is, assert } = require('./utils')

const passedFlags = process.argv.slice(2)

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

		const programOptionsRaw = is.undefined(creationConfig.options) ? [] : creationConfig.options
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

		const helpMessage = createHelpMessage(creationConfig, language, config.get('languageCode'), mergedOptions)
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
  }
}

module.exports = Zingo
