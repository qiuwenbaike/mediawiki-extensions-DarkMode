/**
 * @name DarkMode.js
 * @description add dark mode to MediaWiki sites
 * @author AnYi, WaitSpring
 * @license GPL-3.0
 */
'use strict';
( () => {
	const COOKIE_NAME = 'usedarkmode';
	const DARK_MODE_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 13.229 13.229'%3E%3Ccircle cx='6.614' cy='6.614' fill='%23fff' stroke='%2336c' stroke-width='1.322' r='5.953'/%3E%3Cpath d='M6.88 11.377a4.762 4.762 0 0 1-4.125-7.144 4.762 4.762 0 0 1 4.124-2.38v4.762z' fill='%2336c' paint-order='markers stroke fill'/%3E%3C/svg%3E";

	const darkModeButton = document.createElement( 'img' );
	darkModeButton.id = 'darkmode-button';
	darkModeButton.src = DARK_MODE_ICON;
	darkModeButton.draggable = false;
	darkModeButton.alt = ( document.documentElement.classList.contains( 'client-darkmode' ) ) ? mw.message( 'darkmode-default-link' ) : mw.message( 'darkmode-link' );
	darkModeButton.title = ( document.documentElement.classList.contains( 'client-darkmode' ) ) ? mw.message( 'darkmode-default-link-tooltip' ) : mw.message( 'darkmode-link-tooltip' );
	darkModeButton.style.opacity = '0.7';
	darkModeButton.style.bottom = '120px';

	const hoverListener = ( event ) => {
		darkModeButton.style.opacity = event.type === 'mouseenter' ? '1' : '0.7';
	};
	darkModeButton.addEventListener( 'mouseenter', hoverListener );
	darkModeButton.addEventListener( 'mouseleave', hoverListener );

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

	const getCookie = ( name ) => ( '; '
		.concat( decodeURIComponent( document.cookie ) )
		.split( '; '.concat( name, '=' ) )
		.pop()
		.split( ';' )
		.shift() );
	const setCookie = ( {
		name,
		value,
		hour = 0,
		path = '/',
		isSecure = true
	} ) => {
		if ( !name || !value || !path ) {
			return;
		}
		const base = ''
			.concat( name, '=' )
			.concat( encodeURIComponent( value ), ';path=' )
			.concat( path )
			.concat( isSecure ? ';Secure' : '' );
		const date = new Date();
		if ( hour === 0 ) {
			document.cookie = base;
		} else {
			date.setTime( date.getTime() + hour * 3_600_000 );
			document.cookie = ''.concat( base, ';expires=' ).concat( date.toGMTString() );
		}
	};

	const setMetaContent = ( metaContent ) => {
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
			setMetaContent( 'dark' );
			setCookie( { name: COOKIE_NAME, value: '0', hour: -1 } );
			setCookie( { name: COOKIE_NAME, value: '1', hour: 1_000_000_000 } );
			darkModeButton.alt = mw.message( 'darkmode-default-link' );
			darkModeButton.title = mw.message( 'darkmode-default-link-tooltip' );
		},
		light: () => {
			document.documentElement.classList.remove( 'client-darkmode' );
			document.documentElement.classList.add( 'client-lightmode' );
			setMetaContent( 'light' );
			setCookie( { name: COOKIE_NAME, value: '1', hour: -1 } );
			setCookie( { name: COOKIE_NAME, value: '0', hour: 1_000_000_000 } );
			darkModeButton.alt = mw.message( 'darkmode-link' );
			darkModeButton.title = mw.message( 'darkmode-link-tooltip' );
		}
	};
	const checkDarkMode = () => {
		if ( getCookie( COOKIE_NAME ) === '' ) {
			if ( matchMedia( '( prefers-color-scheme: dark )' ).matches ) {
				setCookie( { name: COOKIE_NAME, value: '1', hour: 1_000_000_000 } );
				document.documentElement.classList.remove( 'client-lightmode' );
				document.documentElement.classList.add( 'client-darkmode' );
			} else {
				setCookie( { name: COOKIE_NAME, value: '0', hour: 1_000_000_000 } );
				document.documentElement.classList.remove( 'client-darkmode' );
				document.documentElement.classList.add( 'client-lightmode' );
			}
		}
		if ( getCookie( COOKIE_NAME ) === '1' ) {
			darkModeButton.alt = mw.message( 'darkmode-default-link' );
			darkModeButton.title = mw.message( 'darkmode-default-link-tooltip' );
		} else {
			darkModeButton.alt = mw.message( 'darkmode-link' );
			darkModeButton.title = mw.message( 'darkmode-link-tooltip' );
		}
	};
	const toggleMode = () => {
		if ( getCookie( COOKIE_NAME ) === '' ) {
			checkDarkMode();
		}
		let metaContent;
		if ( getCookie( COOKIE_NAME ) === '0' ) {
			switchMode.dark();
			metaContent = 'dark';
		} else {
			switchMode.light();
			metaContent = 'light';
		}
		setMetaContent( metaContent );
	};
	darkModeButton.addEventListener( 'click', toggleMode );

	const mediaQueryListeners = {
		dark: ( event ) => {
			if ( event.matches && getCookie( COOKIE_NAME ) === '0' ) {
				toggleMode();
			}
		},
		light: ( event ) => {
			if ( event.matches && getCookie( COOKIE_NAME ) === '1' ) {
				toggleMode();
			}
		}
	};
	matchMedia( '( prefers-color-scheme: dark )' ).addEventListener(
		'change',
		( event ) => {
			mediaQueryListeners.dark( event.target );
		}
	);
	matchMedia( '( prefers-color-scheme: light )' ).addEventListener(
		'change',
		( event ) => {
			mediaQueryListeners.light( event.target );
		}
	);
	checkDarkMode();
} )();
