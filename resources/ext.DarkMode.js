/* eslint-disable no-var */
'use strict';

$( function () {
	if ( window.matchMedia( '( prefers-color-scheme: dark )' ).matches ) {
		$( 'html' ).removeClass( 'client-lightmode' );
		$( 'html' ).addClass( 'client-darkmode' );
	} else if ( window.matchMedia( '( prefers-color-scheme: light)' ).matches ) {
		$( 'html' ).removeClass( 'client-darkmode' );
		$( 'html' ).addClass( 'client-lightmode' );
	}

	var darkMode = ( $( 'html' ).attr( 'class' ) ).indexOf( 'client-darkmode' ) > -1 ? 1 : 0;

	var darkModeButtonIcon = "data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 13.229 13.229' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='6.614' cy='6.614' fill='%23fff' stroke='%2336c' stroke-width='1.322' r='5.953'/%3E%3Cpath d='M6.88 11.377a4.762 4.762 0 0 1-4.125-2.381 4.762 4.762 0 0 1 0-4.763 4.762 4.762 0 0 1 4.124-2.38v4.762z' fill='%2336c' style='paint-order:markers stroke fill'/%3E%3C/svg%3E";

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
	} ).on( 'click', function () {
		if ( darkMode === 0 ) {
			$( 'html' ).removeClass( 'client-lightmode' );
			$( 'html' ).addClass( 'client-darkmode' );
			darkMode = 1;
		} else {
			$( 'html' ).removeClass( 'client-darkmode' );
			$( 'html' ).addClass( 'client-lightmode' );
			darkMode = 0;
		}
		new mw.Api().saveOption( 'darkmode', darkMode );
	} ).on( 'mouseenter mouseleave', function ( e ) {
		this.style.opacity = e.type === 'mouseenter' ? 1 : 0.7;
	} ).attr( 'draggable', 'false' ).appendTo( 'body' );
	$( window ).on( 'scroll', function () {
		if ( $( '#cat_a_lot' ).length > 0 || $( '#proveit' ).length > 0 || $( '.wordcount' ).length > 0 ) {
			$darkModeButton.css( 'bottom', '162px' );
		} else {
			$darkModeButton.css( 'bottom', '120px' );
		}
	} );
}() );
