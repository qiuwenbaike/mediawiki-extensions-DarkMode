'use strict';

$( function ( mw ) {
	if ( window.matchMedia( '( prefers-color-scheme: dark )' ).matches && $.cookie( 'darkmode' ) !== 1 ) {
		$( 'html' ).removeClass( 'client-lightmode' );
		$( 'html' ).addClass( 'client-darkmode' );
		$.removeCookie( 'darkmode' );
		$.cookie( 'darkmode', 1, { path: '/' } );
		new mw.Api().saveOption( 'darkmode', 0 );
	}

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
	} ).on( 'click', function () {
		if ( ( $( 'html' ).attr( 'class' ) ).indexOf( 'client-darkmode' ) > -1 ) {
			$( 'html' ).removeClass( 'client-darkmode' );
			$( 'html' ).addClass( 'client-lightmode' );
			$.removeCookie( 'darkmode' );
			$.cookie( 'darkmode', 0, { path: '/' } );
			new mw.Api().saveOption( 'darkmode', 0 );
		} else {
			$( 'html' ).removeClass( 'client-lightmode' );
			$( 'html' ).addClass( 'client-darkmode' );
			$.removeCookie( 'darkmode' );
			$.cookie( 'darkmode', 1, { path: '/' } );
			new mw.Api().saveOption( 'darkmode', 1 );
		}
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
}( mediaWiki ) );
