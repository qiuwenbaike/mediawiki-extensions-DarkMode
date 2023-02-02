/* Dark Mode
 * Author(s):
 * - AnYiEE
 * Rewrite in ES5 by WaitSpring
 */

( function ( $, mw ) {
	/* Start cookies.js */
	/* \
	|*|
	|*|  :: cookies.js ::
	|*|
	|*|  A complete cookies reader/writer framework with full unicode support.
	|*|
	|*|  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
	|*|
	|*|  This framework is released under the GNU Public License, version 3 or later.
	|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
	|*|
	|*|  Syntaxes:
	|*|
	|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
	|*|  * docCookies.getItem(name)
	|*|  * docCookies.removeItem(name[, path], domain)
	|*|  * docCookies.hasItem(name)
	|*|
	\ */
	var docCookies = {
		getItem: function ( sKey ) {
			return (
				decodeURIComponent(
					document.cookie.replace(
						new RegExp(
							'(?:(?:^|.*;)\\s*' +
                encodeURIComponent( sKey ).replace( /[-.+*]/g, '\\$&' ) +
                '\\s*\\=\\s*([^;]*).*$)|^.*$'
						),
						'$1'
					)
				) || null
			);
		},
		setItem: function ( sKey, sValue, vEnd, sPath, sDomain, bSecure ) {
			if ( !sKey || /^(?:expires|max-age|path|domain|secure)$/i.test( sKey ) ) {
				return false;
			}
			var sExpires = '';
			if ( vEnd ) {
				switch ( vEnd.constructor ) {
					case Number:
						sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
						break;
					case String:
						sExpires = '; expires=' + vEnd;
						break;
					case Date:
						sExpires = '; expires=' + vEnd.toUTCString();
						break;
				}
			}
			document.cookie =
        encodeURIComponent( sKey ) +
        '=' +
        encodeURIComponent( sValue ) +
        sExpires +
        ( sDomain ? '; domain=' + sDomain : '' ) +
        ( sPath ? '; path=' + sPath : '' ) +
        ( bSecure ? '; secure' : '' );
			return true;
		},
		removeItem: function ( sKey, sPath, sDomain ) {
			if ( !sKey || !this.hasItem( sKey ) ) {
				return false;
			}
			document.cookie =
        encodeURIComponent( sKey ) +
        '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
        ( sDomain ? '; domain=' + sDomain : '' ) +
        ( sPath ? '; path=' + sPath : '' );
			return true;
		},
		hasItem: function ( sKey ) {
			return new RegExp(
				'(?:^|;\\s*)' +
          encodeURIComponent( sKey ).replace( /[-.+*]/g, '\\$&' ) +
          '\\s*\\='
			).test( document.cookie );
		}
	};
	/* End cookies.js */

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
			if ( docCookies.getItem( cookieName ) === '0' ) {
				document.documentElement.classList.remove( 'client-lightmode' );
				document.documentElement.classList.add( 'client-darkmode' );
				docCookies.removeItem( cookieName );
				docCookies.setItem( cookieName, '1', 31536e3, '/' );
				$darkModeButton.attr( {
					alt: mw.message( 'darkmode-default-link' ),
					title: mw.message( 'darkmode-default-link-tooltip' )
				} );
			} else {
				document.documentElement.classList.remove( 'client-darkmode' );
				document.documentElement.classList.add( 'client-lightmode' );
				docCookies.removeItem( cookieName );
				docCookies.setItem( cookieName, '0', 31536e3, '/' );
				$darkModeButton.attr( {
					alt: mw.message( 'darkmode-link' ),
					title: mw.message( 'darkmode-link-tooltip' )
				} );
			}
		},
		modeObserver = {
			dark: function ( mediaQueryList ) {
				if ( mediaQueryList.matches && docCookies.getItem( cookieName ) === '0' ) {
					modeSwitcher();
				}
			},
			light: function ( mediaQueryList ) {
				if ( mediaQueryList.matches && docCookies.getItem( cookieName ) === '1' ) {
					modeSwitcher();
				}
			}
		},
		checkDarkMode = function () {
			if ( !( docCookies.hasItem( cookieName ) ) ) {
				if ( isDarkMode ) {
					docCookies.setItem( cookieName, '1', 31536e3, '/' );
				} else {
					docCookies.setItem( cookieName, '0', 31536e3, '/' );
				}
			}
			if ( docCookies.getItem( cookieName ) === '1' ) {
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
