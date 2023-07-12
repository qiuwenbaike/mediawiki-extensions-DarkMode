/**
 * Dark Mode
 * Author(s):
 * - AnYi
 * Rewrite in ES5 and ES6 by WaitSpring
 */
'use strict';
( () => {
	const getCookie = ( name ) => ( '; '
		.concat( decodeURIComponent( document.cookie ) )
		.split( '; '.concat( name, '=' ) )
		.pop()
		.split( ';' )
		.shift() );
	const setCookie = ( name, value, time, path = '/', isSecure = true ) => {
		if ( !name || !value || !time || !path ) {
			return;
		}
		const base = ''
			.concat( name, '=' )
			.concat( encodeURIComponent( value ), ';path=' )
			.concat( path )
			.concat( isSecure ? ';Secure' : '' );
		const date = new Date();
		if ( time === 'tmp' ) {
			document.cookie = base;
		} else {
			date.setTime( date.getTime() + time * 36e5 );
			document.cookie = ''.concat( base, ';expires=' ).concat( date.toGMTString() );
		}
	};
	const cookieName = 'usedarkmode';
	const isDarkMode = matchMedia( '( prefers-color-scheme: dark )' ).matches;
	const darkModeIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 13.229 13.229'%3E%3Ccircle cx='6.614' cy='6.614' fill='%23fff' stroke='%2336c' stroke-width='1.322' r='5.953'/%3E%3Cpath d='M6.88 11.377a4.762 4.762 0 0 1-4.125-7.144 4.762 4.762 0 0 1 4.124-2.38v4.762z' fill='%2336c' paint-order='markers stroke fill'/%3E%3C/svg%3E";
	const darkModeButton = document.createElement( 'img' );
	darkModeButton.id = 'darkmode-button';
	darkModeButton.src = darkModeIcon;
	darkModeButton.draggable = false;
	darkModeButton.alt = ( document.documentElement.classList.contains( 'client-darkmode' ) ) ? mw.message( 'darkmode-default-link' ) : mw.message( 'darkmode-link' );
	darkModeButton.title = ( document.documentElement.classList.contains( 'client-darkmode' ) ) ? mw.message( 'darkmode-default-link-tooltip' ) : mw.message( 'darkmode-link-tooltip' );
	darkModeButton.style.opacity = '0.7';
	darkModeButton.style.bottom = '120px';
	const eventTargetFunction = ( event ) => {
		darkModeButton.style.opacity = event.type === 'mouseenter' ? '1' : '0.7';
	};
	darkModeButton.addEventListener( 'mouseenter', eventTargetFunction );
	darkModeButton.addEventListener( 'mouseleave', eventTargetFunction );
	document.body.appendChild( darkModeButton );
	const windowEventFunction = () => {
		if ( document.getElementById( 'cat_a_lot' ) ||
            document.getElementById( 'proveit' ) ||
            document.getElementsByClassName( 'wordcount' )[ 0 ] ) {
			darkModeButton.style.bottom = '162px';
		} else {
			darkModeButton.style.bottom = '120px';
		}
	};
	window.addEventListener( 'scroll', windowEventFunction );
	window.addEventListener( 'selectionchange', windowEventFunction );
	const switchMetaContent = ( metaContent ) => {
		if ( document.getElementsByName( 'color-scheme' ).length > 0 ) {
			document.getElementsByName( 'color-scheme' )[ 0 ].setAttribute( 'content', metaContent );
		} else {
			const meta = document.createElement( 'meta' );
			meta.name = 'color-scheme';
			meta.content = metaContent;
			document.head.appendChild( meta );
		}
	};
	const switchMode = {
		dark: () => {
			document.documentElement.classList.remove( 'client-lightmode' );
			document.documentElement.classList.add( 'client-darkmode' );
			switchMetaContent( 'dark' );
			setCookie( cookieName, '0', '-1' );
			setCookie( cookieName, '1', 1e9 );
			darkModeButton.alt = mw.message( 'darkmode-default-link' );
			darkModeButton.title = mw.message( 'darkmode-default-link-tooltip' );
		},
		light: () => {
			document.documentElement.classList.remove( 'client-darkmode' );
			document.documentElement.classList.add( 'client-lightmode' );
			switchMetaContent( 'light' );
			setCookie( cookieName, '1', '-1' );
			setCookie( cookieName, '0', 1e9 );
			darkModeButton.alt = mw.message( 'darkmode-link' );
			darkModeButton.title = mw.message( 'darkmode-link-tooltip' );
		}
	};
	const checkDarkMode = () => {
		if ( getCookie( cookieName ) === '' ) {
			if ( isDarkMode ) {
				setCookie( cookieName, '1', 1e9 );
				document.documentElement.classList.remove( 'client-lightmode' );
				document.documentElement.classList.add( 'client-darkmode' );
			} else {
				setCookie( cookieName, '0', 1e9 );
				document.documentElement.classList.remove( 'client-darkmode' );
				document.documentElement.classList.add( 'client-lightmode' );
			}
		}
		if ( getCookie( cookieName ) === '1' ) {
			darkModeButton.alt = mw.message( 'darkmode-default-link' );
			darkModeButton.title = mw.message( 'darkmode-default-link-tooltip' );
		} else {
			darkModeButton.alt = mw.message( 'darkmode-link' );
			darkModeButton.title = mw.message( 'darkmode-link-tooltip' );
		}
	};
	const modeSwitcher = () => {
		if ( getCookie( cookieName ) === '' ) {
			checkDarkMode();
		}
		let metaContent;
		if ( getCookie( cookieName ) === '0' ) {
			switchMode.dark();
			metaContent = 'dark';
		} else {
			switchMode.light();
			metaContent = 'light';
		}
		switchMetaContent( metaContent );
	};
	darkModeButton.addEventListener( 'click', () => {
		modeSwitcher();
	} );
	const modeObserver = {
		dark: ( event ) => {
			if ( event.matches && getCookie( cookieName ) === '0' ) {
				modeSwitcher();
			}
		},
		light: ( event ) => {
			if ( event.matches && getCookie( cookieName ) === '1' ) {
				modeSwitcher();
			}
		}
	};
	matchMedia( '( prefers-color-scheme: dark )' ).addEventListener(
		'change',
		( event ) => {
			modeObserver.dark( event.target );
		}
	);
	matchMedia( '( prefers-color-scheme: light )' ).addEventListener(
		'change',
		( event ) => {
			modeObserver.light( event.target );
		}
	);
	checkDarkMode();
} )();
