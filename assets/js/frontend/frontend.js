import PodcastifyRangeSlider from './components/prslider';
import {wppSetMeta} from './../shared/helper';
const { doAction } = wp.hooks;
const WPPFY = [];


/**
 * Format time string.
 * 
 * @since 1.0.0
 * @param {integer} time time is seconds.
 * @returns {string} format times string.
 */
function wppFormatTime( seconds ) {
	let h, m, s, result='';/* eslint-disable-line prefer-const */
	// HOURs
	h = Math.floor( seconds/3600 ); /* eslint-disable-line prefer-const */
	seconds -= h*3600;
	if( h ){
		result = 10>h ? `0${h}:` : `${h}:`;
	}
	// MINUTEs
	m = Math.floor( seconds/60 ); /* eslint-disable-line prefer-const */
	seconds -= m*60;
	result += 10>m ? `0${m}:` : `${m}:`;
	// SECONDs
	s=Math.floor( seconds%60 ); /* eslint-disable-line prefer-const */
	result += 10>s ? `0${s}` : s;
	return result;
}

/**
 * Get player element.
 * 
 * @since 1.0.01
 * @param {Object} HTMLElement
 * @returns {Object} HTMLMediaElement
 */
function wppGetPlayer( el ) {
	const player = el.closest( '.wppfy-player' );
	const { pid } = player.dataset;
	return WPPFY[`Podcastify_Player_${pid}`];
}

/**
 * Get episode ID.
 * 
 * @since 1.0.0
 * @param {HTML Element} el 
 */
function wppGetEpisodeID( el ) {
	const player = el.closest( '.wppfy-player' );
	const { episodeId } = player.dataset;
	return episodeId;
}


const singlePlayers = document.querySelectorAll( '.wppfy-single-player' );
if ( singlePlayers ) {
	singlePlayers.forEach( player => {
		const uid = player.dataset.pid;

		/**
		 * Fire before player initiating.
		 * 
		 * @since 1.0.0
		 */
		doAction( 'wppfy_before_player_initiate', uid );

		WPPFY[`Podcastify_Player_${uid}`] = new Audio( window[`podcastify_uid_${uid}`].url );

		WPPFY[`Podcastify_Player_${uid}`].addEventListener( 'loadeddata', function () {
			const totalDuration = wppFormatTime( WPPFY[`Podcastify_Player_${uid}`].duration );
			document.querySelector( `[data-pid="${uid}"] .wppfy-time .total-time` ).innerHTML = totalDuration;
		} );

		WPPFY[`Podcastify_Player_${uid}`].addEventListener( 'timeupdate', function () {
			const { currentTime, duration } = WPPFY[`Podcastify_Player_${uid}`];
			const completedPercentage = ( currentTime / duration ) * 100;
			const ProgressBar = document.querySelector( `[data-pid="${uid}"] .wppfy-progress` );

			// const {currentTime , duration } = WPPFY[`Podcastify_Player_${uid}`];
			//const completedTime = ( currentTime / duration ) * 100; 

			document.querySelector( `[data-pid="${uid}"] .wppfy-time .current-time` ).innerHTML = wppFormatTime( currentTime );

			if ( !ProgressBar.classList.contains( 'dragging' ) ) {
				ProgressBar.querySelector( '.dragger > span' ).innerHTML = wppFormatTime( currentTime );
				ProgressBar.querySelector( '.dragger' ).style.left = `${completedPercentage}%`;
				ProgressBar.querySelector( '.current-slide' ).style.width = `${completedPercentage}%`;
			}

			// document.querySelector( `[data-pid="${uid}"] .wppfy-range-time .wppfy-range:before` ).style.left = `${completedTime}%`;
			// document.querySelector( `[data-pid="${uid}"] .wppfy-range-time .wppfy-range:after` ).style.left = `${completedTime}%`;
		} );

	} );

	/**
	 * Play the player.
	 * 
	 * @since 1.0.0
	 */
	document.querySelectorAll( '.wppfy-play' ).forEach( ( el ) => {
		el.addEventListener( 'click', function () {
			const wpp = wppGetPlayer( this );
			this.style.display = 'none';
			this.nextElementSibling.style.display = 'block';
			wpp.play();
		} );
	} );

	/**
	 * Pause the player.
	 * 
	 * @since 1.0.0
	 */
	document.querySelectorAll( '.wppfy-pause' ).forEach( ( el ) => {
		el.addEventListener( 'click', function () {
			const wpp = wppGetPlayer( this );
			this.style.display = 'none';
			this.previousElementSibling.style.display = 'block';
			wpp.pause();
		} );
	} );

	/**
	 * Backward specific amount of time.
	 * 
	 * @since 1.0.0
	 */
	document.querySelectorAll( '.wppfy-backward' ).forEach( ( el ) => {

		el.addEventListener( 'click', function () {
			const wpp = wppGetPlayer( this );
			wpp.currentTime = wpp.currentTime - 15;
		} );

	} );

	/**
	 * Froward the specific amount of time.
	 * 
	 * @since 1.0.0
	 */
	document.querySelectorAll( '.wppfy-forward' ).forEach( ( el ) => {

		el.addEventListener( 'click', function () {
			const wpp = wppGetPlayer( this );
			wpp.currentTime = wpp.currentTime + 30;
		} );

	} );

	/**
	 * Volume mute functionally.
	 * 
	 * @since 1.0.0
	 */
	document.querySelectorAll( '.wppfy-volume-icon-wrap' ).forEach( ( el ) => {

		el.addEventListener( 'click', function( ) {
			const PPLayer = wppGetPlayer( this );
			if ( this.classList.contains( 'off' ) ) {
				this.classList.remove( 'off' );
				PPLayer.volume = 1;
			} else {
				this.classList.add( 'off' );
				PPLayer.volume = 0;
			}
		} );

	} );

	
}



if ( document.querySelector( '.wppfy-short-text' ) ) {

	/**
 * Show more text.
 */
	document.querySelector( '.wppfy-short-text .wppfy-text-more' ).addEventListener( 'click', ( e ) => {
		e.target.parentNode.classList.add( 'show-more' );
	} );

	/**
 * Hide more text.
 */
	document.querySelector( '.wppfy-text-less' ).addEventListener( 'click', ( e ) => {
		e.target.parentNode.parentNode.classList.remove( 'show-more' );
	} );
}

const wpProgress = document.querySelector( '.wppfy-progress' );
const tipH = document.createElement( 'span' );

PodcastifyRangeSlider( wpProgress, {
	/**
	 * On create intiate.
	 * @param {*} value 
	 * @param {*} target 
	 */
	create: function ( value, target ) {
		target.firstChild.firstChild.appendChild( tipH ); // append tooltip to the trigger element
	},
	/**
	 * On start dragging.
	 */
	start: function ( draggedPercentage, slider ) {
		slider.classList.add( 'dragging' );
	},
	/**
	 * On start drag.
	 */
	drag: function ( draggedPercentage, slider ) {

		const WPP = wppGetPlayer( slider );
		const { currentTime, duration } = WPP;

		if ( slider.classList.contains( 'dragging' ) ) {

			const MoveTime = ( draggedPercentage / 100 ) * duration;
			slider.querySelector( '.dragger > span' ).innerHTML = wppFormatTime( MoveTime );
		} else {
			slider.querySelector( '.dragger > span' ).innerHTML = wppFormatTime( currentTime );
		}


	},
	/**
	 * On stop drag.
	 */
	stop: function ( draggedPercentage, slider ) {
		if( ! slider.classList.contains( 'dragging' ) ){
			return;
		}
		slider.classList.remove( 'dragging' );
		const WPP = wppGetPlayer( slider );
		const { duration } = WPP;
		const MoveTime = ( draggedPercentage / 100 ) * duration;
		slider.querySelector( '.dragger > span' ).innerHTML = wppFormatTime( MoveTime );
		WPP.currentTime = MoveTime;

	}
} );

const PPVolumeControl = document.querySelector( '.wppfy-volume-control' );
PodcastifyRangeSlider( PPVolumeControl, {
	/**
	 * On create initiate.
	 * @param {*} value 
	 * @param {*} target 
	 */
	create: function (  ) {
		
	},
	/**
	 * On start dragging.
	 */
	start: function ( draggedPercentage, slider ) {
		slider.classList.add( 'dragging' );
	},
	/**
	 * On start drag.
	 */
	drag: function ( draggedPercentage, slider ) {
		if( ! slider.classList.contains( 'dragging' ) ){
			return;
		}
		const WPP = wppGetPlayer( slider );
		
		WPP.volume = 1 -  draggedPercentage / 100 ;
		
	},
	/**
	 * On stop drag.
	 */
	stop: function ( draggedPercentage, slider ) {
		slider.classList.remove( 'dragging' );
	
	},
	vertical: true
} );

if ( document.querySelector( '.wppfy-download' ) ) {
	document.querySelectorAll( '.wppfy-download' ).forEach( ( el ) => {

		el.addEventListener( 'click' , ( e ) =>{
			//e.preventDefault();
			const episodeID = wppGetEpisodeID( e.target );

			const args = {
				beforeCall: () => {
					e.target.closest( '.wppfy-download' ).classList.add( 'loading' );
				},
				onSuccess: ( result ) => { 
					
					if( result.success ) {
						const { downloads } = result.data;
						document.querySelector( `.wppfy-player[data-episode-id='${episodeID}'] .wppfy-download-count` ).innerHTML = downloads;
					}
				},
				requestData : {
					action: 'podcastify_episode_download',
					episodeID
				}
			};
			wppSetMeta( 'download_episode', episodeID, args );
		} );
	} );
}

if ( document.querySelector( '.wppfy-like' ) ) {
	document.querySelectorAll( '.wppfy-like' ).forEach( ( el ) => {

		el.addEventListener( 'click' , ( e ) =>{
			//e.preventDefault();
			const episodeID = wppGetEpisodeID( e.target );

			const args = {
				beforeCall: () => {
					e.target.closest( '.wppfy-like' ).classList.add( 'loading' );
				},
				onSuccess: ( result ) => { 
					
					if( result.success ) {
						const { likes } = result.data;
						document.querySelector( `.wppfy-player[data-episode-id='${episodeID}'] .wppfy-like-count` ).innerHTML = likes;
					}
				},
				requestData : {
					action: 'podcastify_episode_like',
					episodeID
				}
			};
			wppSetMeta( 'episode_like', episodeID, args );
		} );
	} );
}

if ( document.querySelector( '.wppfy-share-links.social' ) ) {
	document.querySelectorAll( '.wppfy-share-links.social a' ).forEach( ( el ) => {
		el.addEventListener( 'click' , function ( e ){
			e.preventDefault();
			window.open( this.getAttribute( 'href' ), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600' );
			return false;
		} );
	} );
}
