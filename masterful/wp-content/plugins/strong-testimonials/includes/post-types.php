<?php
/**
 * Register Post Type and Taxonomy
 *
 * @since 1.4.0
 * @since 1.8.0   $args['hierarchical'] => false
 * @since 1.15.10 $args['exclude_from_search'] => false
 * @since 2.4.0   Move 'custom-fields' to an option.
 *                Added 'wpmtst_testimonial_supports' filter.
 *                Added 'wpmtst_exclude_from_search' filter.
 */
function wpmtst_register_cpt() {

	if ( ! post_type_exists( 'wpm-testimonial' ) ) {
		$args = wpmtst_get_cpt_defaults();

		$args['labels']              = apply_filters( 'wpmtst_testimonial_labels', $args['labels'] );
		$args['supports']            = apply_filters( 'wpmtst_testimonial_supports', $args['supports'] );
		$args['exclude_from_search'] = apply_filters( 'wpmtst_exclude_from_search', $args['exclude_from_search'] );
		$args['taxonomies']          = apply_filters( 'wpmtst_testimonial_taxonomies', $args['taxonomies'] );

		//TODO error handling
		register_post_type( 'wpm-testimonial', apply_filters( 'wpmtst_post_type', $args ) );
	}

	/**
	 * Our taxonomy.
	 */
	if ( ! taxonomy_exists( 'wpm-testimonial-category' ) && apply_filters( 'wpmtst_register_taxonomy', true ) ) {
		$args = wpmtst_get_tax_defaults();

		$args['labels'] = apply_filters( 'wpmtst_taxonomy_labels', $args['labels'] );

		register_taxonomy( 'wpm-testimonial-category', array( 'wpm-testimonial' ), apply_filters( 'wpmtst_taxonomy', $args ) );
	}
}
// Less than 15 for WPML compatibility.
add_action( 'init', 'wpmtst_register_cpt', 12 );


/**
 * Return default values for our custom post type.
 *
 * ---------------------------------------------------------------
 * For the [restore default] button to work, every value needs
 * a default value even if we are not overriding WordPress default
 * because we can't fetch those defaults (yet).
 * ---------------------------------------------------------------
 *
 * @return array|string
 */
function wpmtst_get_cpt_defaults() {
	$labels = array(
		'name'                  => esc_html_x( 'Testimonials', 'post type general name', 'strong-testimonials' ),
		'singular_name'         => esc_html_x( 'Testimonial', 'post type singular name', 'strong-testimonials' ),
		'add_new'               => esc_html__( 'Add New', 'strong-testimonials' ),
		'add_new_item'          => esc_html__( 'Add New Testimonial', 'strong-testimonials' ),
		'edit_item'             => esc_html__( 'Edit Testimonial', 'strong-testimonials' ),
		'new_item'              => esc_html__( 'New Testimonial', 'strong-testimonials' ),
		'view_item'             => esc_html__( 'View Testimonial', 'strong-testimonials' ),
		'view_items'            => esc_html__( 'View Testimonials', 'strong-testimonials' ),
		'search_items'          => esc_html__( 'Search Testimonials', 'strong-testimonials' ),
		'not_found'             => esc_html__( 'Nothing Found', 'strong-testimonials' ),
		'not_found_in_trash'    => esc_html__( 'Nothing found in Trash', 'strong-testimonials' ),
		'all_items'             => esc_html__( 'All Testimonials', 'strong-testimonials' ),
		'archives'              => esc_html__( 'Testimonial Archives', 'strong-testimonials' ),
		'attributes'            => esc_html__( 'Attributes', 'strong-testimonials' ),
		'insert_into_item'      => esc_html__( 'Insert into testimonial', 'strong-testimonials' ),
		'uploaded_to_this_item' => esc_html__( 'Uploaded to this testimonial', 'strong-testimonials' ),
		'featured_image'        => esc_html__( 'Featured Image', 'strong-testimonials' ),
		'set_featured_image'    => esc_html__( 'Set featured image', 'strong-testimonials' ),
		'remove_featured_image' => esc_html__( 'Remove featured image', 'strong-testimonials' ),
		'use_featured_image'    => esc_html__( 'Use as featured image', 'strong-testimonials' ),
		'filter_items_list'     => esc_html__( 'Filter testimonials list', 'strong-testimonials' ),
		'items_list_navigation' => esc_html__( 'Testimonials list navigation', 'strong-testimonials' ),
		'items_list'            => esc_html__( 'Testimonials list', 'strong-testimonials' ),
		'menu_name'             => esc_html_x( 'Testimonials', 'admin menu name', 'strong-testimonials' ),
		'name_admin_bar'        => esc_html_x( 'Testimonial', 'admin bar menu name', 'strong-testimonials' ),
	);

	$supports = array(
		'title',
		'excerpt',
		'editor',
		'thumbnail',
		'page-attributes',
		'comments',
	);

	$args = array(
		'labels'              => $labels,
		'public'              => true,
		'hierarchical'        => false,
		'exclude_from_search' => false,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'show_in_nav_menus'   => true,
		'show_in_admin_bar'   => true,
		'menu_position'       => 20,
		'menu_icon'           => 'dashicons-editor-quote',
		'capability_type'     => 'post',
		'supports'            => $supports,
		'taxonomies'          => array( 'wpm-testimonial-category' ),
		'has_archive'         => false,
		'rewrite'             => array(
			'slug'       => esc_html_x( 'testimonial', 'slug', 'strong-testimonials' ),
			'with_front' => true,
			'feeds'      => false,
			'pages'      => true,
		),
		'can_export'          => true
	);

	return $args;
}


/**
 * Return our custom taxonomy default values.
 *
 * @since 2.30.0
 *
 * @return array
 */
function wpmtst_get_tax_defaults() {
	$labels = array(
		'name'          => esc_html__( 'Testimonial Categories', 'strong-testimonials' ),
		'singular_name' => esc_html__( 'Testimonial Category', 'strong-testimonials' ),
		'menu_name'     => esc_html__( 'Categories', 'strong-testimonials' ),
		'all_items'     => esc_html__( 'All categories', 'strong-testimonials' ),
	);

	$args = array(
		'labels'       => $labels,
		'hierarchical' => true,
		'rewrite'      => array( 'slug' => esc_html_x( 'testimonial-category', 'slug', 'strong-testimonials' ) ),
	);

	return $args;
}


/**
 * Modify testimonial features.
 *
 * @since 2.4.0
 * @param $supports
 *
 * @return array
 */
function wpmtst_testimonial_supports( $supports ) {
	$options = get_option( 'wpmtst_options' );

	if ( isset( $options['support_custom_fields'] ) && $options['support_custom_fields'] )
		$supports[] = 'custom-fields';

	if ( isset( $options['support_comments'] ) && $options['support_comments'] )
		$supports[] = 'comments';

	return $supports;
}
add_filter( 'wpmtst_testimonial_supports', 'wpmtst_testimonial_supports' );


/**
 * Filters the post updated messages.
 *
 * @param $messages
 * @since 2.12.0
 *
 * @return mixed
 */
function wpmtst_updated_messages( $messages ) {
	global $post;

	$preview_url = get_preview_post_link( $post );

	$permalink = get_permalink( $post->ID );
	if ( ! $permalink ) {
		$permalink = '';
	}

	// TODO Use WordPress translations as a basis for adding these to existing translation files.
	// Preview post link.
	$preview_post_link_html = sprintf( ' <a target="_blank" href="%1$s">%2$s</a>',
		esc_url( $preview_url ),
		esc_html__( 'Preview testimonial', 'strong-testimonials' )
	);

	// View post link.
	$view_post_link_html = sprintf( ' <a href="%1$s">%2$s</a>',
		esc_url( $permalink ),
		esc_html__( 'View testimonial', 'strong-testimonials' )
	);

	// Scheduled post preview link.
	$scheduled_post_link_html = sprintf( ' <a target="_blank" href="%1$s">%2$s</a>',
		esc_url( $permalink ),
		esc_html__( 'Preview testimonial', 'strong-testimonials' )
	);

	/* translators: Publish box date format, see https://secure.php.net/date */
	$scheduled_date = date_i18n( 'M j, Y @ H:i', strtotime( $post->post_date ) );

	$messages['wpm-testimonial'] = array(
		0  => '', // Unused. Messages start at index 1.
		1  => esc_html__( 'Testimonial updated.', 'strong-testimonials' ) . $view_post_link_html,
		2  => esc_html__( 'Custom field updated.', 'strong-testimonials' ),
		3  => esc_html__( 'Custom field deleted.', 'strong-testimonials' ),
		4  => esc_html__( 'Testimonial updated.', 'strong-testimonials' ),
		/* translators: %s: date and time of the revision */
		5 => isset($_GET['revision']) ? sprintf( esc_html__( 'Testimonial restored to revision from %s.', 'strong-testimonials' ), wp_post_revision_title( absint( $_GET['revision'] ), false ) ) : false,
		6 => esc_html__( 'Testimonial published.', 'strong-testimonials' ) . $view_post_link_html,
		7 => esc_html__( 'Testimonial saved.', 'strong-testimonials' ),
		8 => esc_html__( 'Testimonial submitted.', 'strong-testimonials' ) . $preview_post_link_html,
		9 => sprintf( esc_html__( 'Testimonial scheduled for: %s.', 'strong-testimonials' ), '<strong>' . $scheduled_date . '</strong>' ) . $scheduled_post_link_html,
		10 => esc_html__( 'Testimonial draft updated.', 'strong-testimonials' ) . $preview_post_link_html,
	);

	return $messages;
}
add_filter( 'post_updated_messages', 'wpmtst_updated_messages' );


/**
 * Filters the bulk action updated messages.
 *
 * By default, custom post types use the messages for the 'post' post type.
 *
 * @param $bulk_messages
 * @param $bulk_counts
 *
 * @since 2.18.0
 *
 * @return mixed
 */
function wpmtst_bulk_updated_messages( $bulk_messages, $bulk_counts ) {

	$bulk_messages['wpm-testimonial'] = array(
		'updated'   => _n( '%s testimonial updated.', '%s testimonials updated.', $bulk_counts['updated'], 'strong-testimonials' ),
		'locked'    => ( 1 == $bulk_counts['locked'] ) ? __( '1 testimonial not updated, somebody is editing it.', 'strong-testimonials' ) : _n( '%s testimonial not updated, somebody is editing it.', '%s testimonials not updated, somebody is editing them.', $bulk_counts['locked'], 'strong-testimonials' ),
		'deleted'   => _n( '%s testimonial permanently deleted.', '%s testimonials permanently deleted.', $bulk_counts['deleted'], 'strong-testimonials' ),
		'trashed'   => _n( '%s testimonial moved to the Trash.', '%s testimonials moved to the Trash.', $bulk_counts['trashed'], 'strong-testimonials' ),
		'untrashed' => _n( '%s testimonial restored from the Trash.', '%s testimonials restored from the Trash.', $bulk_counts['untrashed'], 'strong-testimonials' ),
	);

	return $bulk_messages;
}
add_filter( 'bulk_post_updated_messages', 'wpmtst_bulk_updated_messages', 10, 2 );
