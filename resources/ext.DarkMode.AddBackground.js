/**
 * @name AddBackground.js
 * @description add dark mode to MediaWiki sites
 * @author 安忆 <i@anyi.in>, WaitSpring
 * @license GPL-3.0
 */
'use strict';
(function () {
	const figures = document.querySelectorAll(
		'[typeof="mw:File"], [typeof="mw:File/Thumb"], [typeof="mw:File/Frame"], [typeof="mw:File/Frameless"]'
	);
	if (!figures.length) {
		return;
	}

	const imageBackgroundPeers = [];

	for (const figure of figures) {
		const images = figure.querySelectorAll('img:not(.mw-invert)');
		if (!images.length) {
			continue;
		}

		for (const image of images) {
			const background = document.createElement('span');
			background.classList.add('darkmode-figure-background');
			image.before(background);
			background.style.position = 'absolute';
			background.style.width = (image.width || 0).toString() + 'px';
			background.style.height = (image.height || 0).toString() + 'px';
			imageBackgroundPeers.push({
				image,
				background
			});
		}
	}

	window.addEventListener('resize', () => {
		if (!imageBackgroundPeers) {
			return;
		}

		for (const { image, background } of imageBackgroundPeers) {
			background.style.position = 'absolute';
			background.style.width = (image.width || 0).toString() + 'px';
			background.style.height = (image.height || 0).toString() + 'px';
		}
	});
}());
