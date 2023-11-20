/**
 * @name DarkMode.js
 * @description add dark mode to MediaWiki sites
 * @author 安忆 <i@anyi.in>, WaitSpring
 * @license GPL-3.0
 */
(() => {
	const COOKIE_NAME = 'usedarkmode';
	const DARK_MODE_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 13.229 13.229'%3E%3Ccircle cx='6.614' cy='6.614' fill='%23fff' stroke='%2336c' stroke-width='1.322' r='5.953'/%3E%3Cpath d='M6.88 11.377a4.762 4.762 0 0 1-4.125-7.144 4.762 4.762 0 0 1 4.124-2.38v4.762z' fill='%2336c' paint-order='markers stroke fill'/%3E%3C/svg%3E";
	const getMessage = (key) => mw.message('darkmode-' + key).plain();

	const button = document.createElement('img');
	button.id = 'darkmode-button';
	button.src = DARK_MODE_ICON;
	button.draggable = false;
	button.alt = (document.documentElement.classList.contains('client-darkmode')) ? getMessage('default-link') : getMessage('link');
	button.title = (document.documentElement.classList.contains('client-darkmode')) ? getMessage('default-link-tooltip') : getMessage('link-tooltip');
	button.style.opacity = '0.7';
	button.style.bottom = '120px';

	const hoverListener = ({ type }) => {
		button.style.opacity = type === 'mouseenter' ? '1' : '0.7';
	};
	button.addEventListener('mouseenter', hoverListener);
	button.addEventListener('mouseleave', hoverListener);

	document.body.appendChild(button);

	const windowEventFunction = () => {
		button.style.bottom = (document.querySelector('#cat_a_lot') ||
			document.querySelector('#proveit') ||
			document.querySelectorAll('.wordcount')[ 0 ]) ? '162px' : '120px';
	};
	window.addEventListener('scroll', windowEventFunction);
	window.addEventListener('selectionchange', windowEventFunction);

	const getCookie = (name) => ('; '
		.concat(decodeURIComponent(document.cookie))
		.split('; '.concat(name, '='))
		.pop()
		.split(';')
		.shift());

	const setCookie = ({
		name,
		value,
		hour = 0,
		path = '/',
		isSecure = true
	}) => {
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
			document.cookie = ''.concat(base, ';expires=').concat(date.toGMTString());
		}
	};

	const setMetaContent = (metaContent) => {
		if (document.querySelectorAll('[name=color-scheme]').length > 0) {
			document.querySelectorAll('[name=color-scheme]')[ 0 ].setAttribute('content', metaContent);
		} else {
			const meta = document.createElement('meta');
			meta.name = 'color-scheme';
			meta.content = metaContent;
			document.head.appendChild(meta);
		}
	};

	const switchMode = {
		dark: () => {
			document.documentElement.classList.remove('client-lightmode');
			document.documentElement.classList.add('client-darkmode');
			setMetaContent('dark');
			setCookie({ name: COOKIE_NAME, value: '0', hour: -1 });
			setCookie({ name: COOKIE_NAME, value: '1', hour: 24 * 365 * 1000 });
			button.alt = getMessage('default-link');
			button.title = getMessage('default-link-tooltip');
		},
		light: () => {
			document.documentElement.classList.remove('client-darkmode');
			document.documentElement.classList.add('client-lightmode');
			setMetaContent('light');
			setCookie({ name: COOKIE_NAME, value: '1', hour: -1 });
			setCookie({ name: COOKIE_NAME, value: '0', hour: 24 * 365 * 1000 });
			button.alt = getMessage('link');
			button.title = getMessage('link-tooltip');
		}
	};

	const checkDarkMode = () => {
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
			button.alt = getMessage('default-link');
			button.title = getMessage('default-link-tooltip');
		} else {
			button.alt = getMessage('link');
			button.title = getMessage('link-tooltip');
		}
	};

	const toggleMode = () => {
		if (getCookie(COOKIE_NAME) === '') {
			checkDarkMode();
		}
		let metaContent;
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

	const mediaQueryListeners = {
		dark: ({ matches }) => {
			if (matches && getCookie(COOKIE_NAME) === '0') {
				toggleMode();
			}
		},
		light: ({ matches }) => {
			if (matches && getCookie(COOKIE_NAME) === '1') {
				toggleMode();
			}
		}
	};

	matchMedia('( prefers-color-scheme: dark )').addEventListener(
		'change',
		({ target }) => {
			mediaQueryListeners.dark(target);
		}
	);
	matchMedia('( prefers-color-scheme: light )').addEventListener(
		'change',
		({ target }) => {
			mediaQueryListeners.light(target);
		}
	);

	checkDarkMode();
})();
