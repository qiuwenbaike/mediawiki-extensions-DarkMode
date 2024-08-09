/**
 * @name AddBackground.js
 * @description add dark mode to MediaWiki sites
 * @author 安忆 <i@anyi.in>, WaitSpring
 * @license GPL-3.0
 */
'use strict';
(function () {
	const uniqueArray = function uniqueArray(args) {
		/**
		 * @see {@link https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array/922982}
		 * @license CC-BY-SA-4.0
		 */
		const result = [];
		for (const item of args) {
			if (!result.includes(item)) {
				result.push(item);
			}
		}
		return result;
	};

	const spans = uniqueArray(
		document.querySelectorAll(
			[
				'span[typeof~="mw:File"]',
				'span[typeof~="mw:File/Thumb"]',
				'span[typeof~="mw:File/Frame"]',
				'span[typeof~="mw:File/Frameless"]',
				'span.mw-halign-left',
				'span.mw-halign-right',
				'span.mw-halign-center'
			].join(',')
		)
	);
	const figures = uniqueArray(
		document.querySelectorAll(
			[
				'figure[typeof~="mw:File"]',
				'figure[typeof~="mw:File/Thumb"]',
				'figure[typeof~="mw:File/Frame"]',
				'figure[typeof~="mw:File/Frameless"]',
				'figure.mw-halign-left',
				'figure.mw-halign-right',
				'figure.mw-halign-center'
			].join(',')
		)
	);
	if (!spans.length && !figures.length) {
		return;
	}

	const imageBackgroundPeers = [];

	for (const figure of figures) {
		const images = figure.querySelectorAll('img:not(.mw-invert)');
		if (!images.length) {
			continue;
		}

		for (const image of images) {
			const background = document.createElement('div');
			background.classList.add('darkmode-image-background');
			image.before(background);
			background.style.width = (image.width || 0).toString() + 'px';
			background.style.height = (image.height || 0).toString() + 'px';
			imageBackgroundPeers.push({
				image,
				background
			});
		}
	}

	for (const span of spans) {
		const images = span.querySelectorAll('img:not(.mw-invert)');
		if (!images.length) {
			continue;
		}

		for (const image of images) {
			const parentElement = image.parentElement();
			parentElement.classList.add('darkmode-image-wrap');
			const background = document.createElement('div');
			background.classList.add('darkmode-image-background');
			image.before(background);
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
