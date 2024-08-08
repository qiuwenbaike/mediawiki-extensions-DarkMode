/**
 * @name AddBackground.js
 * @description add dark mode to MediaWiki sites
 * @author 安忆 <i@anyi.in>, WaitSpring
 * @license GPL-3.0
 */
'use strict';
(function () {
	const figureImages = document.querySelectorAll('[typeof="mw:File"] img');
	if (!figureImages.length) {
		return;
	}
	for (const element of figureImages) {
		const background = document.createElement('div');
		background.classList.add('darkmode-figure-background');
		element.before(background);
		background.style.width = (element.width || 0).toString() + 'px';
		background.style.height = (element.height || 0).toString() + 'px';
	}
}());
