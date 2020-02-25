const findInReservedOptions = (reservedOptions, optionItem) => reservedOptions.find(reservedOptionItem => (
	reservedOptionItem.option === optionItem.option ||
	reservedOptionItem.option === optionItem.shorthand ||
	reservedOptionItem.shorthand === optionItem.shorthand ||
	reservedOptionItem.shorthand === optionItem.option
))

module.exports = findInReservedOptions
