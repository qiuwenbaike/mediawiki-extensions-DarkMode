/**
 * @name DarkMode.js
 * @description add dark mode to MediaWiki sites
 * @author 安忆 <i@anyi.in>, WaitSpring
 * @license GPL-3.0
 */
(() => {
	const skin = mw.config.get('skin');
	if (skin === 'vector-2022') {
		return;
	}
	const bodyElement = document.body || document.documentElement;
	const COOKIE_NAME = 'usedarkmode',
		ICON =
			"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 13.229 13.229'%3E%3Ccircle cx='6.614' cy='6.614' fill='%23fff' stroke='%2336c' stroke-width='1.322' r='5.953'/%3E%3Cpath d='M6.88 11.377a4.762 4.762 0 0 1-4.125-7.144 4.762 4.762 0 0 1 4.124-2.38v4.762z' fill='%2336c' paint-order='markers stroke fill'/%3E%3C/svg%3E",
		message = function (key) {
			return mw.message('darkmode-' + key).plain();
		};

	const checkSystemDarkModeIsOn = function () {
		return matchMedia('( prefers-color-scheme: dark )').matches;
	};
	const checkThemeDarkModeIsOn = function () {
		return document.documentElement.classList.contains('client-darkmode');
	};

	const button = document.createElement('img');
	button.id = 'darkmode-button';
	button.src = ICON;
	button.draggable = false;
	button.alt = checkThemeDarkModeIsOn()
		? message('default-link')
		: message('link');
	button.title = checkThemeDarkModeIsOn()
		? message('default-link-tooltip')
		: message('link-tooltip');
	button.style.opacity = '0.7';
	button.style.bottom = '127px';

	const hoverListener = function (event) {
		button.style.opacity = event.type === 'mouseenter' ? '1' : '0.7';
	};
	button.addEventListener('mouseenter', hoverListener);
	button.addEventListener('mouseleave', hoverListener);

	bodyElement.appendChild(button);

	const scrollListener = () => {
		let buttonBottom;

		if (
			document.querySelector('#proveit') ||
			document.querySelector('.gadget-cat_a_lot-container') ||
			document.querySelector('#gadget-word_count-tip')
		) {
			buttonBottom = '169px';
		} else {
			buttonBottom = '127px';
		}

		button.style.bottom = buttonBottom;
	};
	const scrollListenerWithThrottle = mw.util.throttle(scrollListener, 200);
	document.addEventListener('DOMContentLoaded', () => {
		document.addEventListener('scroll', scrollListenerWithThrottle);
		document.addEventListener(
			'selectionchange',
			scrollListenerWithThrottle,
		);
	});

	const getCookie = function (name) {
		return '; '
			.concat(decodeURIComponent(document.cookie))
			.split('; '.concat(name, '='))
			.pop()
			.split(';')
			.shift();
	};

	const setCookie = function (object) {
		const name = object.name,
			value = object.value,
			hour = object.hour || 0,
			path = object.path || '/',
			isSecure = object.isSecure || true;

		if (!name || !value || !path) {
			return;
		}

		const base = ''
			.concat(name, '=')
			.concat(encodeURIComponent(value), ';path=')
			.concat(path)
			.concat(isSecure ? ';Secure' : '');

		const date = new Date();

		if (hour === 0) {
			document.cookie = base;
		} else {
			date.setTime(date.getTime() + hour * 60 * 60 * 1000);
			document.cookie = ''
				.concat(base, ';expires=')
				.concat(date.toGMTString());
		}
	};

	const setMetaContent = function (metaContent) {
		const colorSchemeMeta =
			document.getElementsByTagName('meta')['color-scheme'];
		if (colorSchemeMeta) {
			colorSchemeMeta.setAttribute('content', metaContent);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'color-scheme';
			meta.content = metaContent;
			document.head.appendChild(meta);
		}
	};

	const switchMode = {
		dark: function () {
			document.documentElement.classList.add('client-darkmode');
			document.documentElement.classList.remove('client-lightmode');
			setMetaContent('dark');
			setCookie({ name: COOKIE_NAME, value: '0', hour: -1 });
			setCookie({ name: COOKIE_NAME, value: '1', hour: 24 * 365 * 1000 });
			button.alt = message('default-link');
			button.title = message('default-link-tooltip');
		},
		light: function () {
			document.documentElement.classList.add('client-lightmode');
			document.documentElement.classList.remove('client-darkmode');
			setMetaContent('light');
			setCookie({ name: COOKIE_NAME, value: '1', hour: -1 });
			setCookie({ name: COOKIE_NAME, value: '0', hour: 24 * 365 * 1000 });
			button.alt = message('link');
			button.title = message('link-tooltip');
		},
	};

	const checkDarkMode = function () {
		if (getCookie(COOKIE_NAME) === '') {
			if (checkSystemDarkModeIsOn()) {
				switchMode.dark();
			} else {
				switchMode.light();
			}
		}
	};

	const modeSwitcher = function () {
		if (getCookie(COOKIE_NAME) === '') {
			checkDarkMode();
			return;
		}

		// Avoid Cookie reading bug
		if (checkThemeDarkModeIsOn()) {
			switchMode.light();
		} else {
			switchMode.dark();
		}
	};
	button.addEventListener('click', modeSwitcher);

	const mediaQueryListeners = {
		dark: function (event) {
			if (event.matches && getCookie(COOKIE_NAME) === '0') {
				switchMode.dark();
			}
		},
		light: function (event) {
			if (event.matches && getCookie(COOKIE_NAME) === '1') {
				switchMode.light();
			}
		},
	};

	matchMedia('( prefers-color-scheme: dark )').addEventListener(
		'change',
		(match) => {
			mediaQueryListeners.dark(match.target);
		},
	);
	matchMedia('( prefers-color-scheme: light )').addEventListener(
		'change',
		(match) => {
			mediaQueryListeners.light(match.target);
		},
	);

	checkDarkMode(); // Entry function
})();
