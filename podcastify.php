<?php
/**
 * Plugin Name: Podcastify
 * Plugin URI: https://wppodcastify.com/
 * Description: Podcastify helps to host and display Series and Episode With elegant on WordPress. And further it generates the feed url to show Podcasts on Popular Podcasting platforms such as Apple Podcasts and Google Podcasts.
 * Version: 1.1.0
 * Author: Podcastify
 * Author URI: https://wppodcastify.com/
 * Text Domain: podcastify
 * Domain Path: /languages
 *
 * @package Podcastify
 */

// Useful global constants.
define( 'WP_PODCASTIFY_VERSION', '1.1.0' );
define( 'WP_PODCASTIFY_URL', plugin_dir_url( __FILE__ ) );
define( 'WP_PODCASTIFY_PATH', plugin_dir_path( __FILE__ ) );
define( 'WP_PODCASTIFY_INC', WP_PODCASTIFY_PATH . 'includes/' );

// Include files.
require_once WP_PODCASTIFY_INC . 'functions/core.php';

// Activation/Deactivation.
register_activation_hook( __FILE__, '\Podcastify\Core\activate' );
register_deactivation_hook( __FILE__, '\Podcastify\Core\deactivate' );

// Bootstrap.
Podcastify\Core\setup();

// Require Composer autoloader if it exists.
if ( file_exists( WP_PODCASTIFY_PATH . '/vendor/autoload.php' ) ) {
	require_once WP_PODCASTIFY_PATH . 'vendor/autoload.php';
}
