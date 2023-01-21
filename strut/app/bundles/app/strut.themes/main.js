define(['./BackgroundProvider',
		'./AvailableBackgrounds',
		'./AvailableSurfaces',
		'./StylesheetProvider',
		'./ClassEditor'],
function(BackgroundProvider, Backgrounds, Surfaces, StylesheetProvider, ClassEditor) {
	'use strict';

	var surfaceBgProviderFactory = {
		create: function(editorModel) {
			return new BackgroundProvider({
				backgrounds: Surfaces,
				editorModel: editorModel,
				selector: '.strut-surface',
				attr: 'surface',
				template: JST['strut.themes/SurfaceChooserDropdown']
			});
		}
	};

	var slideBgProviderFactory = {
		create: function(editorModel) {
			return new BackgroundProvider({
				backgrounds: Backgrounds,
				editorModel: editorModel,
				selector: '.operatingTable .slideContainer',
				attr: 'background',
				template: JST['strut.themes/BackgroundChooserDropdown']
			});
		}
	};

	var stylesheetProviderFactory = {
		create: function(editorModel) {
			return new StylesheetProvider(editorModel);
		}
	};

	var classEditorFactory = {
		create: function(editorModel) {
			return new ClassEditor(editorModel);
		}
	};

	return {
		initialize: function(registry) {
			registry.register({
				interfaces: 'strut.ThemeProvider',
				meta: {
					modes: {
						'slide-editor': true,
						'overview': true
					},
					overflow: false
				}
			}, surfaceBgProviderFactory);

			registry.register({
				interfaces: 'strut.ThemeProvider',
				meta: {
					modes: {
						'slide-editor': true,
						'overview': true,
					},
					overflow: false
				}
			}, slideBgProviderFactory);

			registry.register({
				interfaces: 'strut.ThemeProvider',
				meta: {
					modes: {
						'overview': true,
						'slide-editor': true
					},
					overflow: true
				}
			}, stylesheetProviderFactory);

			registry.register({
				interfaces: 'strut.ThemeProvider',
				meta: {
					modes: {
						'overview': true,
						'slide-editor': true
					},
					overflow: true
				}
			}, classEditorFactory);

			/*
			registry.register({
				interfaces: 'strut.ThemeProvider',
				meta: {
					modes: {
						slideEditor: true
					},
					engines: {
						bespoke: true
					}
				}
			}, bespokeThemes)
			*/
		}
	}
});