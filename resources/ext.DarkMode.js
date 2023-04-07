/**
 * Dark Mode
 * Author(s):
 * - AnYi
 * Rewrite in ES5 by WaitSpring
 */

( function ( $, mw ) {
	var getCookie = function getCookie( name ) {
		return '; '
			.concat( decodeURIComponent( document.cookie ) )
			.split( '; '.concat( name, '=' ) )
			.pop()
			.split( ';' )
			.shift();
	};
	var setCookie = function setCookie( name, value, time ) {
		var path = arguments.length > 3 && arguments[ 3 ] !== undefined ? arguments[ 3 ] : '/';
		var isSecure = arguments.length > 4 && arguments[ 4 ] !== undefined ? arguments[ 4 ] : true;
		if ( !name || !value || !time || !path ) {
			return;
		}
		var base = ''
				.concat( name, '=' )
				.concat( encodeURIComponent( value ), ';path=' )
				.concat( path )
				.concat( isSecure ? ';Secure' : '' ),
			date = new Date();
		if ( time === 'tmp' ) {
			document.cookie = base;
		} else {
			date.setTime( date.getTime() + time * 3600000 );
			document.cookie = ''.concat( base, ';expires=' ).concat( date.toGMTString() );
		}
	};
	var cookieName = 'usedarkmode',
		isDarkMode = matchMedia( '( prefers-color-scheme: dark )' ).matches,
		darkModeButtonIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 13.229 13.229'%3E%3Ccircle cx='6.614' cy='6.614' fill='%23fff' stroke='%2336c' stroke-width='1.322' r='5.953'/%3E%3Cpath d='M6.88 11.377a4.762 4.762 0 0 1-4.125-7.144 4.762 4.762 0 0 1 4.124-2.38v4.762z' fill='%2336c' paint-order='markers stroke fill'/%3E%3C/svg%3E",
		$darkModeButton = $( '<img>' )
			.attr( {
				src: darkModeButtonIcon,
				id: 'darkModeButton'
			} )
			.css( {
				cursor: 'pointer',
				opacity: 0.7,
				position: 'fixed',
				right: '8px',
				'-ms-user-select': 'none',
				'-moz-user-select': 'none',
				'-webkit-user-select': 'none',
				'user-select': 'none',
				width: '32px',
				height: '32px'
			} )
			.appendTo( 'body' ),
		modeSwitcher = function modeSwitcher() {
			if ( getCookie( cookieName ) === '0' ) {
				document.documentElement.classList.remove( 'client-lightmode' );
				document.documentElement.classList.add( 'client-darkmode' );
				setCookie( cookieName, '0', '-1' );
				setCookie( cookieName, '1', 1e9 );
				$darkModeButton.attr( {
					alt: mw.message( 'darkmode-default-link' ),
					title: mw.message( 'darkmode-default-link-tooltip' )
				} );
			} else {
				document.documentElement.classList.remove( 'client-darkmode' );
				document.documentElement.classList.add( 'client-lightmode' );
				setCookie( cookieName, '1', '-1' );
				setCookie( cookieName, '0', 1e9 );
				$darkModeButton.attr( {
					alt: mw.message( 'darkmode-link' ),
					title: mw.message( 'darkmode-link-tooltip' )
				} );
			}
		},
		modeObserver = {
			dark: function dark( mediaQueryList ) {
				if ( mediaQueryList.matches && getCookie( cookieName ) === '0' ) {
					modeSwitcher();
				}
			},
			light: function light( mediaQueryList ) {
				if ( mediaQueryList.matches && getCookie( cookieName ) === '1' ) {
					modeSwitcher();
				}
			}
		},
		checkDarkMode = function checkDarkMode() {
			if ( getCookie( cookieName ) === '' ) {
				if ( isDarkMode ) {
					setCookie( cookieName, '1', 1e9 );
				} else {
					setCookie( cookieName, '0', 1e9 );
				}
			}
			if ( getCookie( cookieName ) === '1' ) {
				$darkModeButton.attr( {
					alt: mw.message( 'darkmode-default-link' ),
					title: mw.message( 'darkmode-default-link-tooltip' )
				} );
			} else {
				$darkModeButton.attr( {
					alt: mw.message( 'darkmode-link' ),
					title: mw.message( 'darkmode-link-tooltip' )
				} );
			}
		};
	matchMedia( '( prefers-color-scheme: dark )' ).addEventListener(
		'change',
		function ( event ) {
			modeObserver.dark( event.target );
		}
	);
	matchMedia( '( prefers-color-scheme: light )' ).addEventListener(
		'change',
		function ( event ) {
			modeObserver.light( event.target );
		}
	);
	window.addEventListener( 'scroll', function () {
		if ( document.getElementById( 'cat_a_lot' ) ||
			document.getElementById( 'proveit' ) ||
			document.getElementsByClassName( 'wordcount' )[ 0 ]
		) {
			$darkModeButton.css( 'bottom', '162px' );
		} else {
			$darkModeButton.css( 'bottom', '120px' );
		}
	} );
	$darkModeButton
		.on( 'mouseenter mouseleave', function ( e ) {
			this.style.opacity = e.type === 'mouseenter' ? 1 : 0.7;
		} )
		.attr( 'draggable', 'false' )
		.on( 'click', function () {
			modeSwitcher();
		} );
	checkDarkMode();
}( jQuery, mediaWiki ) );
