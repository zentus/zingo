#!/usr/bin/env node
const createCLI = require('../lib')
const pkg = require('../package.json')

// creation config requires package property containing package.json object

const CLI = createCLI({
	package: pkg,
	usage: language => language.program_usage,
	initialConfig: {
		languageCode: 'sv'
	},
	options: [{
		option: 'say-hello',
		shorthand: 'sh',
		// Description can be either a string or a function
		// The function gets the current language as its first argument and current languageCode as its second argument
		description: language => language.description.say_hello
	}, {
		option: 'is-good-food',
		shorthand: 'igf',
		// Description can be either a string or a function
		// The function gets the current language as its first argument and current languageCode as its second argument
		description: language => language.description.is_good_food
	}],
	languages: {
		en: {
			// These are your custom language variables
			program_usage: '[options]',
			hello_buddy: 'Hello buddy!',
			description: {
				say_hello: 'Say hello',
				is_good_food: 'Check if a food is good or not',
			},
			// These are internal language variables
			// They can be overridden
			internal: {
				display_help_message: 'can i haz override?',
			}
		},
		sv: {
			hello_buddy: 'Hallå kompis!',
			program_usage: '[flaggor]',
			description: {
				say_hello: 'Säg hallå'
			}
		}
	}
})

// CLI.start() is required to get help and version message to work
// It will check if one of those flags were passed
// If it was, it will run and then exit the process with exit code 0
// If not, the rest of the code will run
CLI.start()

const sayHelloOption = CLI.getOption('say-hello')
const isGoodFoodOption = CLI.getOption('is-good-food')

if (sayHelloOption.passed) {
	return console.log(CLI.language.hello_buddy)
}

if (sayHelloOption.passed) {
	return console.log(CLI.language.hello_my_friend)
}

if (isGoodFoodOption.passed) {
	const goodFood = [
		'pasta',
		'pizza',
		'pad thai'
	]

	const isGood = goodFood.includes(isGoodFoodOption.input)

	const message = isGood
		? `${isGoodFoodOption.input} ${CLI.language.is_good_food}`
		: `${isGoodFoodOption.input} ${CLI.language.is_not_good_food}`

	return console.log(message)
}
