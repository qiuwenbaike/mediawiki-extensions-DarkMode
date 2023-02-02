/* Dark Mode
 * Author(s):
 * - AnYiEE
 * Rewrite in ES5 by WaitSpring
 */

( function ( $, mw ) {
	var cookieName = 'darkmode',
		isDarkMode = matchMedia( '( prefers-color-scheme: dark )' ).matches,
		darkModeButtonIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 13.229 13.229'%3E%3Ccircle cx='6.614' cy='6.614' fill='%23fff' stroke='%2336c' stroke-width='1.322' r='5.953'/%3E%3Cpath d='M6.88 11.377a4.762 4.762 0 0 1-4.125-7.144 4.762 4.762 0 0 1 4.124-2.38v4.762z' fill='%2336c' paint-order='markers stroke fill'/%3E%3C/svg%3E",
		$darkModeButton = $( '<img>' ).attr( {
			src: darkModeButtonIcon,
			id: 'darkModeButton'
		} ).css( {
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
		} ).appendTo( 'body' ),
		modeSwitcher = function () {
			if ( $.cookie( cookieName ) === '0' ) {
				document.documentElement.classList.remove( 'client-lightmode' );
				document.documentElement.classList.add( 'client-darkmode' );
				$.removeCookie( cookieName );
				$.cookie( cookieName, '1', { expires: 180, path: '/' } );
				$darkModeButton.attr( {
					alt: mw.message( 'darkmode-default-link' ),
					title: mw.message( 'darkmode-default-link-tooltip' )
				} );
			} else {
				document.documentElement.classList.remove( 'client-darkmode' );
				document.documentElement.classList.add( 'client-lightmode' );
				$.removeCookie( cookieName );
				$.cookie( cookieName, '0', { expires: 180, path: '/' } );
				$darkModeButton.attr( {
					alt: mw.message( 'darkmode-link' ),
					title: mw.message( 'darkmode-link-tooltip' )
				} );
			}
		},
		modeObserver = {
			dark: function ( mediaQueryList ) {
				if ( mediaQueryList.matches && $.cookie( cookieName ) === '0' ) {
					modeSwitcher();
				}
			},
			light: function ( mediaQueryList ) {
				if ( mediaQueryList.matches && $.cookie( cookieName ) === '1' ) {
					modeSwitcher();
				}
			}
		},
		checkDarkMode = function () {
			if ( !( $.cookie( cookieName ) ) ) {
				if ( isDarkMode ) {
					$.cookie( cookieName, '1' );
				} else {
					$.cookie( cookieName, '0' );
				}
			}
			if ( $.cookie( cookieName ) === '1' ) {
				$darkModeButton.attr( {
					alt: mw.message( 'darkmode-default-link' ),
					title: mw.message( 'darkmode-default-link-tooltip' )
				} );
				return true;
			} else {
				$darkModeButton.attr( {
					alt: mw.message( 'darkmode-link' ),
					title: mw.message( 'darkmode-link-tooltip' )
				} );
			}
		};

	matchMedia( '( prefers-color-scheme: dark )' ).addEventListener( 'change', function ( event ) {
		modeObserver.dark( event.target );
	} );
	matchMedia( '( prefers-color-scheme: light )' ).addEventListener( 'change', function ( event ) {
		modeObserver.light( event.target );
	} );
	window.addEventListener( 'scroll', function () {
		if ( document.getElementById( 'cat_a_lot' ) || document.getElementById( 'proveit' ) || document.getElementsByClassName( 'wordcount' )[ 0 ] ) {
			$darkModeButton.css( 'bottom', '162px' );
		} else {
			$darkModeButton.css( 'bottom', '120px' );
		}
	} );

	$darkModeButton.on( 'mouseenter mouseleave', function ( e ) {
		this.style.opacity = e.type === 'mouseenter' ? 1 : 0.7;
	} ).attr( 'draggable', 'false' ).on( 'click', function () {
		modeSwitcher();
	} );

	checkDarkMode();

}( jQuery, mediaWiki ) );
