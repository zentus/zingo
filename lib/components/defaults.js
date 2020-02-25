const defaults = {
	initialConfig: {
		languageCode: 'en'
	},
	style: {
		optionsTable: {
			paddingLeft: 0,
			paddingRight: 6
		}
	},
	languages: {
		sv: {
			internal: {
				option: 'Flagga',
				shorthand: 'Kort flagga',
				description: 'Beskrivning',
				usage: 'Användning',
				language_was_set_to: 'Språket har ändrats till',
				set_language: 'Välj språk',
				display_version: 'Visa programversion',
				display_help_message: 'Visa hjälpmeddelande',
				command: 'kommando',
				options: 'flaggor'
			}
		},
		en: {
			internal: {
				option: 'Option',
				shorthand: 'Shorthand',
				description: 'Description',
				usage: 'Usage',
				language_was_set_to: 'Language was set to',
				set_language: 'Set language',
				display_version: 'Display program version',
				display_help_message: 'Display help message',
				command: 'command',
				options: 'options'
			}
		}
	}
}

module.exports = defaults
