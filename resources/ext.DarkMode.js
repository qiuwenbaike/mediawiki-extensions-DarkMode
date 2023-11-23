/**
 * @name DarkMode.js
 * @description add dark mode to MediaWiki sites
 * @author 安忆 <i@anyi.in>, WaitSpring
 * @license GPL-3.0
 */
(function () {
	var COOKIE_NAME = 'usedarkmode',
		ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 13.229 13.229'%3E%3Ccircle cx='6.614' cy='6.614' fill='%23fff' stroke='%2336c' stroke-width='1.322' r='5.953'/%3E%3Cpath d='M6.88 11.377a4.762 4.762 0 0 1-4.125-7.144 4.762 4.762 0 0 1 4.124-2.38v4.762z' fill='%2336c' paint-order='markers stroke fill'/%3E%3C/svg%3E",
		message = function (key) {
			return mw.message('darkmode-' + key).plain();
		};

	var button = document.createElement('img');
	button.id = 'darkmode-button';
	button.src = ICON;
	button.draggable = false;
	button.alt = (document.documentElement.classList.contains('client-darkmode')) ? message('default-link') : message('link');
	button.title = (document.documentElement.classList.contains('client-darkmode')) ? message('default-link-tooltip') : message('link-tooltip');
	button.style.opacity = '0.7';
	button.style.bottom = '120px';

	var hoverListener = function (event) {
		button.style.opacity = event.type === 'mouseenter' ? '1' : '0.7';
	};
	button.addEventListener('mouseenter', hoverListener);
	button.addEventListener('mouseleave', hoverListener);

	document.body.appendChild(button);

	function windowEventFunction() {
		button.style.bottom = (document.getElementById('cat_a_lot') ||
			document.getElementById('proveit') ||
			document.getElementsByClassName('wordcount')[ 0 ]) ? '162px' : '120px';
	}
	window.addEventListener('scroll', windowEventFunction);
	window.addEventListener('selectionchange', windowEventFunction);

	var getCookie = function (name) {
		return ('; '
			.concat(decodeURIComponent(document.cookie))
			.split('; '.concat(name, '='))
			.pop()
			.split(';')
			.shift());
	};

	var setCookie = function (object) {
		var name = object.name,
			value = object.value,
			hour = object.hour || 0,
			path = object.path || '/',
			isSecure = object.isSecure || true;

		if (!name || !value || !path) {
			return;
		}

		var base = ''
			.concat(name, '=')
			.concat(encodeURIComponent(value), ';path=')
			.concat(path)
			.concat(isSecure ? ';Secure' : '');

		var date = new Date();

		if (hour === 0) {
			document.cookie = base;
		} else {
			date.setTime(date.getTime() + hour * 60 * 60 * 1000);
			document.cookie = ''.concat(base, ';expires=').concat(date.toGMTString());
		}
	};

	var setMetaContent = function (metaContent) {
		if (document.getElementsByTagName('meta')[ 'color-scheme' ]) {
			document.getElementsByTagName('meta')[ 'color-scheme' ].setAttribute('content', metaContent);
		} else {
			var meta = document.createElement('meta');
			meta.name = 'color-scheme';
			meta.content = metaContent;
			document.head.appendChild(meta);
		}
	};

	var switchMode = {
		dark: function () {
			document.documentElement.classList.remove('client-lightmode');
			document.documentElement.classList.add('client-darkmode');
			setMetaContent('dark');
			setCookie({ name: COOKIE_NAME, value: '0', hour: -1 });
			setCookie({ name: COOKIE_NAME, value: '1', hour: 24 * 365 * 1000 });
			button.alt = message('default-link');
			button.title = message('default-link-tooltip');
		},
		light: function () {
			document.documentElement.classList.remove('client-darkmode');
			document.documentElement.classList.add('client-lightmode');
			setMetaContent('light');
			setCookie({ name: COOKIE_NAME, value: '1', hour: -1 });
			setCookie({ name: COOKIE_NAME, value: '0', hour: 24 * 365 * 1000 });
			button.alt = message('link');
			button.title = message('link-tooltip');
		}
	};

	var checkDarkMode = function () {
		if (getCookie(COOKIE_NAME) === '') {
			if (matchMedia('( prefers-color-scheme: dark )').matches) {
				setCookie({ name: COOKIE_NAME, value: '1', hour: 24 * 365 * 1000 });
				document.documentElement.classList.remove('client-lightmode');
				document.documentElement.classList.add('client-darkmode');
			} else {
				setCookie({ name: COOKIE_NAME, value: '0', hour: 24 * 365 * 1000 });
				document.documentElement.classList.remove('client-darkmode');
				document.documentElement.classList.add('client-lightmode');
			}
		}
		if (getCookie(COOKIE_NAME) === '1') {
			button.alt = message('default-link');
			button.title = message('default-link-tooltip');
		} else {
			button.alt = message('link');
			button.title = message('link-tooltip');
		}
	};

	var toggleMode = function () {
		if (getCookie(COOKIE_NAME) === '') {
			checkDarkMode();
		}
		var metaContent;
		if (getCookie(COOKIE_NAME) === '0') {
			switchMode.dark();
			metaContent = 'dark';
		} else {
			switchMode.light();
			metaContent = 'light';
		}
		setMetaContent(metaContent);
	};
	button.addEventListener('click', toggleMode);

	var mediaQueryListeners = {
		dark: function (event) {
			if (event.matches && getCookie(COOKIE_NAME) === '0') {
				toggleMode();
			}
		},
		light: function (event) {
			if (event.matches && getCookie(COOKIE_NAME) === '1') {
				toggleMode();
			}
		}
	};

	matchMedia('( prefers-color-scheme: dark )').addEventListener(
		'change',
		function (match) {
			mediaQueryListeners.dark(match.target);
		}
	);
	matchMedia('( prefers-color-scheme: light )').addEventListener(
		'change',
		function (match) {
			mediaQueryListeners.light(match.target);
		}
	);

	checkDarkMode();
}());
