<?php
use function Podcastify\Utils\{wpp_get_podcast_categories, wpp_get_podcast_sub_categories, wpp_podcast_langs};
$feed_title = wpp_get_setting( 'wpp_feed', 'title', get_bloginfo( 'name' ) );

?>
<?php echo '<?xml version="1.0" encoding="' . get_option( 'blog_charset' ) . '"?>' . "\n"; ?>
<rss version="2.0"
xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:atom="http://www.w3.org/2005/Atom"
	xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
	xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
	xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
xmlns:rawvoice="http://www.rawvoice.com/rawvoiceRssModule/"
xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0"
<?php do_action( ' wpp_rss2_ns' ); ?>>
	<channel>
	<title><?php esc_html_e( $title ); ?></title>
	</channel>
</rss>
