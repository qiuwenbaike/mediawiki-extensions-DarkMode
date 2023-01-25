/* Dark Mode
 * Author(s):
 * - AnYiEE
 * Rewrite in ES5 by WaitSpring
 */

( function ( $, mw ) {
	var extensionName = 'ext.DarkMode';
	var isDarkMode = matchMedia( '( prefers-color-scheme: dark )' ).matches;
	var modeSwitcher = function () {
		if ( localStorage[ extensionName ] === '0' ) {
			document.documentElement.classList.remove( 'client-lightmode' );
			document.documentElement.classList.add( 'client-darkmode' );
			localStorage.setItem( extensionName, '1' );
			new mw.Api().saveOption( 'darkmode', '1' );
		} else {
			document.documentElement.classList.remove( 'client-darkmode' );
			document.documentElement.classList.add( 'client-lightmode' );
			localStorage.setItem( extensionName, '0' );
			new mw.Api().saveOption( 'darkmode', '0' );
		}
	};
	var modeObserver = {
		dark: function ( mediaQueryList ) {
			if ( mediaQueryList.matches && localStorage[ extensionName ] === '0' ) {
				modeSwitcher();
			}
		},
		light: function ( mediaQueryList ) {
			if ( mediaQueryList.matches && localStorage[ extensionName ] === '1' ) {
				modeSwitcher();
			}
		}
	};
	var checkDarkMode = function () {
		if ( !localStorage[ extensionName ] ) {
			if ( isDarkMode ) {
				localStorage.setItem( extensionName, '1' );
			} else {
				localStorage.setItem( extensionName, '0' );
			}
		}
		if ( localStorage[ extensionName ] === '1' ) {
			return true;
		}
	};
	var darkModeButtonIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 13.229 13.229'%3E%3Ccircle cx='6.614' cy='6.614' fill='%23fff' stroke='%2336c' stroke-width='1.322' r='5.953'/%3E%3Cpath d='M6.88 11.377a4.762 4.762 0 0 1-4.125-7.144 4.762 4.762 0 0 1 4.124-2.38v4.762z' fill='%2336c' paint-order='markers stroke fill'/%3E%3C/svg%3E";

	var $darkModeButton = $( '<img>' ).attr( {
		src: darkModeButtonIcon,
		id: 'darkModeButton',
		alt: '切换深色、浅色模式',
		title: '切换深色、浅色模式'
	} ).css( {
		cursor: 'pointer',
		opacity: 0.7,
		position: 'fixed',
		right: '8px',
		'user-select': 'none',
		width: '32px',
		height: '32px'
	} ).on( 'mouseenter mouseleave', function ( e ) {
		this.style.opacity = e.type === 'mouseenter' ? 1 : 0.7;
	} ).attr( 'draggable', 'false' ).on( 'click', function () {
		modeSwitcher();
	} ).appendTo( 'body' );

	window.addEventListener( 'scroll', function () {
		if ( document.getElementById( 'cat_a_lot' ) || document.getElementById( 'proveit' ) || document.getElementsByClassName( 'wordcount' ) ) {
            if ( document.getElementById( 'cat_a_lot' ).length > 0 || document.getElementById( 'proveit' ).length > 0 || document.getElementsByClassName( 'wordcount' ).length > 0 ) {
                $darkModeButton.css( 'bottom', '162px' );
            }
        } else {
            $darkModeButton.css( 'bottom', '120px' );
        }
	} );

	matchMedia( '(prefers-color-scheme:dark)' ).addEventListener( 'change', function ( event ) {
		modeObserver.dark( event.target );
	} );
	matchMedia( '(prefers-color-scheme:light)' ).addEventListener( 'change', function ( event ) {
		modeObserver.light( event.target );
	} );
	window.addEventListener( 'storage', function ( event ) {
		if ( event.key === extensionName ) {
			modeSwitcher();
		}
	} );

	checkDarkMode();

}( jQuery, mediaWiki ) );
