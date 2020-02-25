const ConfigStore = require('configstore')
const deepMerge = require('deepmerge')
const defaults = require('./defaults')

const createConfig = (creationConfig = {}) => {
	if (!creationConfig.package || creationConfig.package.constructor !== Object) {
		return console.log('cli-shell expected creationConfig.package to be an object')
	}

	const config = new ConfigStore(creationConfig.package.name)

	const isInitialized = Object.keys(config.get()).length > 0

	if (!isInitialized) {
		const initialConfig = creationConfig.initialConfig ? deepMerge(defaults.initialConfig, creationConfig.initialConfig) : defaults.initialConfig
		config.set(initialConfig)
	}

	return config
}

module.exports = createConfig
