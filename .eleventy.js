const markdownIt = require('markdown-it');

module.exports = function (config) {
	// Asset Watch Targets
	config.addWatchTarget('./src/Content/');
	config.addWatchTarget('./src/Scripts/');

	// Markdown
	config.setLibrary(
		'md',
		markdownIt({
			html: true,
			breaks: true,
			linkify: true,
			typographer: true,
		})
	);

	// Layouts
	config.addLayoutAlias('home', 'layout-home.html');
	config.addLayoutAlias('choice', 'layout-choice.html');
	config.addLayoutAlias('game', 'layout-game.html');

	// Pass-through files
	config.addPassthroughCopy({ 'src/Content/css/_static': 'Content/css' }, { dot: false, junk: false });
	config.addPassthroughCopy('src/Content/img');
	config.addPassthroughCopy('src/Content/video');
	config.addPassthroughCopy('src/Content/webfonts');
	config.addPassthroughCopy({ 'src/Scripts/_static': 'Scripts' });

	// Deep-Merge
	config.setDataDeepMerge(true);

	// Base Config
	return {
		dir: {
			input: 'src',
			output: 'dist',
			includes: 'includes',
			layouts: 'layouts',
			data: 'data',
		},
		templateFormats: ['njk', 'md', 'html'],
		htmlTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk',
	};
};
