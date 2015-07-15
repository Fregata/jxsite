(function($){

	var doingAjax = false;

	var insertParam = function(key, value) {
	    key = encodeURI(key); value = encodeURI(value);

	    var kvp = document.location.search.substr(1).split('&');
	    var i = kvp.length;
	    var x;

	    while ( i-- ) {
	        x = kvp[i].split('=');

	        if (x[0]==key)
	        {
	            x[1] = value;
	            kvp[i] = x.join('=');
	            break;
	        }
	    }

	    if ( i<0 ) {
	    	kvp[kvp.length] = [key,value].join('=');
	    }

	    document.location.search = kvp.join('&');
	},

	trackSingleDownload = function( id, callback ){
		$.ajax({
			type: 'POST',
			dataType: "json",
			url: downloadManager.ajaxurl,
			data: {
				action: 'track_single_download',
				id: id,
				nonce: downloadManager.ajaxnonce
			},
			success: function( data ) {
				callback.call();
			},
			complete: function() {
				doingAjax = false;
			},
			error: function( jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}

	if( $('.download-waiting').is('*') ){
		setTimeout(function(){
			location.reload();
		}, 30000 );
	}

	$('.download-queue-add').one( 'click', function(e){
		if ( $(this).hasClass('not-logged-in') ) {
			return;
		}

		e.preventDefault();

		if ( doingAjax ) {
			return;
		}

		doingAjax = true;

		var $this = $(this),
		$icon = $this.find('span'),
		id = $(this).data('id'),
		$count = $('.media-folder-count'),
		count = parseInt( $count.text() );

		$this.html($icon);
		$this.append('Adding...');

		$.ajax({
			type: 'POST',
			dataType: "json",
			url: downloadManager.ajaxurl,
			data: {
				action: 'download_queue_add',
				id: id,
				nonce: downloadManager.ajaxnonce
			},
			success: function( data ) {
				$icon
					.removeClass('newsroomicons-plus')
					.addClass('newsroomicons-mediafolder');

				$this
					.attr('href', downloadManager.folderurl)
					.html($icon)
					.append('Added to Folder');

				count = parseInt( data );

				$count.text(count);
			},
			complete: function() {
				doingAjax = false;
			},
			error: function( jqXHR, textStatus, errorThrown) {
				$this.html($icon);
				$this.append('Error');
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	} );

	$('.download-queue-package').one( 'click', function(e){
		e.preventDefault();

		if (doingAjax) {
			return;
		}

		doingAjax = true;

		var $this = $(this);
		var $icon = $this.find('span');
		var id = $(this).data('id');

		$this.html($icon);
		$this.append('Starting...');

		$.ajax({
			type: 'POST',
			dataType: "json",
			url: downloadManager.ajaxurl,
			data: {
				action: 'download_queue_package',
				nonce: downloadManager.ajaxnonce,
				queue_id: id
			},
			success: function( data ) {
				if ( typeof data.filename != 'undefined' ) {
					insertParam('folder', data.filename);
				}
			},
			complete: function() {
				doingAjax = false;
			},
			error: function( jqXHR, textStatus, errorThrown) {
				$this.html($icon);
				$this.append('Error');
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	} );

	$('.download-queue-empty').on( 'click', function(e){
		e.preventDefault();

		if (doingAjax) {
			return;
		}

		doingAjax = true;

		var $this = $(this);
		var $icon = $this.find('span');
		var id = $(this).data('id');

		$this.html($icon);
		$this.append('Cleaning...');

		$.ajax({
			type: 'POST',
			dataType: "json",
			url: downloadManager.ajaxurl,
			data: {
				action: 'download_queue_empty',
				nonce: downloadManager.ajaxnonce
			},
			success: function( data ) {
				window.location.reload();
			},
			complete: function() {
				doingAjax = false;
			},
			error: function( jqXHR, textStatus, errorThrown) {
				$this.html($icon);
				$this.append('Error');
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	} );

	$('.download-queue-remove').on( 'click', function(e){
		e.preventDefault();

		if (doingAjax) {
			return;
		}

		doingAjax = true;

		var $this = $(this),
		id = $(this).data('id'),
		$count = $('.media-folder-count'),
		count = parseInt( $($count.get(0)).text() );

		$this.html('Removing...');

		$.ajax({
			type: 'POST',
			dataType: "json",
			url: downloadManager.ajaxurl,
			data: {
				action: 'download_queue_remove',
				id: id,
				nonce: downloadManager.ajaxnonce
			},
			success: function( data ) {
				$this.parents('li').fadeOut();
				$count.text(--count);
			},
			complete: function() {
				doingAjax = false;
			},
			error: function( jqXHR, textStatus, errorThrown) {
				$this.html($icon);
				$this.append('Error');
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	} );

	$('.single-download').on( 'click', function(e){
		if (doingAjax) {
			return;
		}
		e.preventDefault();

		doingAjax = true;

		var $this = $(this),
		id = $(this).data('id');

		trackSingleDownload( id, function(){
			window.location.replace($this.attr('href'));
		} );

	} );

	$('.print-release').click( function(e){
		if (doingAjax) {
			return;
		}
		e.preventDefault();

		doingAjax = true;

		var $this = $(this),
		id = $(this).data('id');

		trackSingleDownload( id, function(){
			window.print();
		} );
	} );

})( jQuery );
