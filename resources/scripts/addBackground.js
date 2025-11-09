/**
 * @name AddBackground.js
 * @description add dark mode to MediaWiki sites
 * @author 安忆 <i@anyi.in>, WaitSpring
 * @license GPL-3.0
 */
'use strict';
(() => {
	const FILE_SELECTORS = [
		'[typeof~="mw:File"]',
		'[typeof~="mw:File/Thumb"]',
		'[typeof~="mw:File/Frame"]',
		'[typeof~="mw:File/Frameless"]',
		'.mw-halign-left',
		'.mw-halign-right',
		'.mw-halign-center'
	];
	const SPAN_SELECTORS = FILE_SELECTORS.map((element) => 'span' + element);
	const FIGURE_SELECTOR = FILE_SELECTORS.map((element) => 'figure' + element);
	const IMG_SELECTOR = 'img:not(.mw-invert)';
	const CLASS_WRAP = 'darkmode-image-wrap';
	const CLASS_BACKRGOUND = 'darkmode-image-background';

	const spans = [
		...new Set(document.querySelectorAll(SPAN_SELECTORS.join(',')))
	];
	const figures = [
		...new Set(document.querySelectorAll(FIGURE_SELECTOR.join(',')))
	];
	if (!spans.length && !figures.length) {
		return;
	}

	const imageDivPeers = [];

	for (const span of spans) {
		const images = span.querySelectorAll(IMG_SELECTOR);
		if (!images.length) {
			continue;
		}

		for (const image of images) {
			const parentElement = image.parentElement;
			parentElement.classList.add(CLASS_WRAP);
			const div = document.createElement('div');
			div.classList.add(CLASS_BACKRGOUND);
			image.before(div);
			div.style.width = (image.width || 0).toString() + 'px';
			div.style.height = (image.height || 0).toString() + 'px';
			imageDivPeers.push({ image, div });
		}
	}

	for (const figure of figures) {
		const images = figure.querySelectorAll(IMG_SELECTOR);
		if (!images.length) {
			continue;
		}

		for (const image of images) {
			const div = document.createElement('div');
			div.classList.add(CLASS_BACKRGOUND);
			image.before(div);
			div.style.width = (image.width || 0).toString() + 'px';
			div.style.height = (image.height || 0).toString() + 'px';
			imageDivPeers.push({ image, div });
		}
	}

	window.addEventListener('resize', () => {
		if (!imageDivPeers.length) {
			return;
		}

		for (const { image, div } of [ ...new Set(imageDivPeers) ]) {
			div.style.position = 'absolute';
			div.style.width = (image.width || 0).toString() + 'px';
			div.style.height = (image.height || 0).toString() + 'px';
		}
	});
})();
