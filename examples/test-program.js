#!/usr/bin/env node
const Zingo = require('../lib')
const pkg = require('../package.json')

const sentenceCase = string => !string ? '' : string[0].toUpperCase() + string.slice(1).toLowerCase()

const cli = new Zingo({
	package: pkg,
	options: [{
		option: 'say-hello',
		shorthand: 'sh',
		description: 'Say hello'
	}, {
		option: 'is-good-food',
		shorthand: 'igf',
		description: 'Check if a food is good or not'
	}]
})

cli.start()

const sayHelloOption = cli.getOption('say-hello')
const isGoodFoodOption = cli.getOption('is-good-food')

if (sayHelloOption.passed) {
	return console.log('Hello buddy!')
}

if (isGoodFoodOption.passed) {
	if (!isGoodFoodOption.input) return console.log('Please tell me which food you would like to check the goodness of')

	const goodFood = [
		'pasta',
		'pizza',
		'pad thai'
	]

	const isGood = goodFood.includes(isGoodFoodOption.input.toLowerCase())

	const message = isGood
		? `${sentenceCase(isGoodFoodOption.input)} is good food!`
		: `${sentenceCase(isGoodFoodOption.input)} is definitely not good food..`

	return console.log(message)
}

// Usage:
// $ node test-program.js --say-hello
//=> Hello buddy!
// $ node test-program.js --is-good-food pizza
//=> Pizza is good food!
// $ node test-program.js --is-good-food surströmming
//=> Surströmming is definitely not good food..
