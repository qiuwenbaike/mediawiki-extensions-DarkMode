/**
 * @name AddBackground.js
 * @description add dark mode to MediaWiki sites
 * @author 安忆 <i@anyi.in>, WaitSpring
 * @license GPL-3.0
 */
'use strict';
(function () {
	const figures = document.querySelectorAll('[typeof="mw:File"]');
	if (!figures.length) {
		return;
	}

	for (const figure of figures) {
		const images = figure.querySelectorAll('img');
		if (!images.length) {
			continue;
		}

		for (const image of images) {
			const background = document.createElement('div');
			background.classList.add('darkmode-figure-background');
			image.before(background);
			background.style.position = 'absolute';
			background.style.width = (image.width || 0).toString() + 'px';
			background.style.height = (image.height || 0).toString() + 'px';
		}
	}
}());
