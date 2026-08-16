/*! fluxVid v1.0 */
/**
 * init flux
 * @param array args
 * args.posts_per_page
 * args.load_more_is_activated
 * args.hash random useful to have many flux in the same page - hash is a part of IDs in dom
 * args.query_args wp query args
 * @return void
 */
function init_flux_video(args) {
    print_first_row_video(args);

    if(args.load_more_is_activated) {
        load_more_video({
            posts_per_page: args.posts_per_page,
            hash: args.hash,
            query_args: args.query_args,
            type: args.type,
            total: args.total,
            load_more_is_activated: args.load_more_is_activated,
            prev: args.prev,
            next: args.next,
            show_total_page: args.show_total_page,
            number_page_to_show: args.number_page_to_show,
            //post_id: args.post_id
        });
    }
}

/**
 * Displays the first row
 * @param array args
 * args.posts_per_page
 * args.load_more_is_activated
 * args.hash
 * args.query_args
 * @return void
 */
function print_first_row_video(args) {
    jQuery.post(
        ajaxurlVid,
        {
            'action': 'mon_action_Vid', //action in lib/modules/flux_data/models/ft_VidAjax.php
            'query_args': args.query_args,
            'posts_per_page': args.posts_per_page,
            'type': args.type,
            'load_more_is_activated': args.load_more_is_activated,
            'hash': args.hash,
            'total': args.total,
            'prev': args.prev,
            'next': args.next,
            'show_total_page': args.show_total_page,
            'number_page_to_show': args.number_page_to_show,
            'security': ajaxurlVidNonce.nonce,
            //'post_id': args.post_id
        },
        function(response){
            if(response){
                jQuery('#row_video_' + args.hash).append( response );
            } else if(args.load_more_is_activated) {
                jQuery('#load_more_flux_' + args.hash).hide(); //if no response we hide load more button
            }

            if(args.load_more_is_activated) {
                jQuery('#loading_more_spin_' + args.hash).hide(); //We hide spin loader
            }
        }
    );
}

/**
 * Displays the second row after clicking on load more
 * @param array args
 * args.posts_per_page
 * args.hash
 * args.query_args
 * @return void
 */
function load_more_video(args) {
    var offset = 0;

    jQuery('body').on('change', '.select-number-element', function () {
        var self = jQuery(this);
        offset = 0;
        args.posts_per_page = parseInt(self.val(), 10);

        jQuery.post(
            ajaxurlPost,
            {
                'action': 'load_more_Vid', //action in lib/modules/flux_data/models/ft_postAjax.php
                'offset': offset, // 'offset' after clicking load more
                'query_args': args.query_args,
                'posts_per_page': args.posts_per_page,
                'type': args.type,
                'load_more_is_activated': args.load_more_is_activated,
                'hash': args.hash,
                'total': args.total,
                'prev': args.prev,
                'next': args.next,
                'show_total_page': args.show_total_page,
                'number_page_to_show': args.number_page_to_show,
                'security': ajaxurlPostNonce.nonce,
                //'post_id': args.post_id
            },
            function (response) {
                if (response) {
                    jQuery('.row_video').html(response);
                    jQuery('#load_more_flux_' + args.hash).show(); //if no response we hide "load-more" button
                    jQuery('#no_more_flux_' + args.hash).hide();
                } else {
                    if (args.type == 'loadmore') {
                        jQuery('#load_more_flux_' + args.hash).hide(); //We hide spin loader
                    } else {
                        jQuery('.paginate_div_' + args.hash).hide();
                    }
                }

                if (args.load_more_is_activated) {
                    if (args.type == 'loadmore') {
                        jQuery('#loading_more_spin_' + args.hash).hide(); //We hide spin loader
                    }
                }
            }
        );
    });

    jQuery('body').on('click', '#load_more_flux_' + args.hash, function() {
    	//console.log("ok");
        offset = offset + args.posts_per_page;

        jQuery('#loading_more_spin_' + args.hash).show(); //We show spin loader on click
        jQuery('#no_more_flux_' + args.hash).hide(); //and we hide 'no-more' all the time
        jQuery('#load_more_flux_' + args.hash).removeClass("load-more");//and we remove Class "load-more" to avoid clicking
        jQuery.post(
            ajaxurlVid,
            {
                'action': 'load_more_Vid', //action in lib/modules/flux_data/models/ft_VidAjax.php
                'offset': offset, // 'offset' after clicking load more
                'query_args': args.query_args,
                'posts_per_page': args.posts_per_page,
                'type': args.type,
                'load_more_is_activated': args.load_more_is_activated,
                'hash': args.hash,
                'total': args.total,
                'prev': args.prev,
                'next': args.next,
                'show_total_page': args.show_total_page,
                'number_page_to_show': args.number_page_to_show,
                'security': ajaxurlVidNonce.nonce,
                //'post_id': args.post_id
            },
            function(response){
                if(response){
                    jQuery('#row_video_' + args.hash).append( response );
                    jQuery('#load_more_flux_' + args.hash).addClass("load-more"); //we add Class "load-more" to activate clicking
                }else{
                    jQuery('#load_more_flux_' + args.hash).hide(); //if no response we hide "load-more" button
                    jQuery('#no_more_flux_' + args.hash).show(); //and we show "no-more" button
                }
                jQuery('#loading_more_spin_' + args.hash).hide(); //We hide spin loader
            }
        );
    });

    jQuery('body').on('click', '.page-link', function (e) {
        e.preventDefault();
        var self = jQuery(this);
        var page = parseInt(self.attr('data-page'));
        offset = (page - 1) * args.posts_per_page;

        if(!isNaN(page)) {
            jQuery.post(
                ajaxurlPost,
                {
                    'action': 'load_more_Vid', //action in lib/modules/flux_data/models/ft_postAjax.php
                    'offset': offset, // 'offset' after clicking load more
                    'query_args': args.query_args,
                    'posts_per_page': args.posts_per_page,
                    'type': args.type,
                    'load_more_is_activated': args.load_more_is_activated,
                    'hash': args.hash,
                    'total': args.total,
                    'prev': args.prev,
                    'next': args.next,
                    'show_total_page': args.show_total_page,
                    'number_page_to_show': args.number_page_to_show,
                    'security': ajaxurlPostNonce.nonce,
                    //'post_id': args.post_id
                },
                function (response) {
                    if (response) {
                        jQuery('.row_video').html(response);
                    }
                }
            );
        }
    });
}
