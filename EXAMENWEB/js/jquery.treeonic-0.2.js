
(function($) {
	jQuery.fn.treeonic = function(options) {
		var settings = jQuery.extend({
			selectorParent:		jQuery(this)
		}, options);
		return jQuery.treeonic(settings);
	}
	jQuery.treeonic = function(options) {
		// Settings
			var settings = jQuery.extend({
				selectorParent:			null,			// If a jQuery object, all selectors will be restricted to its scope. Otherwise, all selectors will be global.
				initialSelector:		'li.initial',	// Initial list item selector
				exclusive:				false,			// If true, expanding one list collapses all others.
				expandOnHover:			false,			// If true, hovering an item will activate it (after <hoverDelay>ms)
				hoverDelay:				250,			// If expandOnHover is true, this determines how long to wait
				collapseOnBlur:			false,			// If true, clicking outside the list will collapse all open lists
				collapseOnLeave:		false			// If true, moving the cursor outside the list will immediately collapse all open lists
			}, options);
		// Variables
			var _top = settings.selectorParent, x = _top.find('> li > ul'), y = x, i, timeoutId;
		// Main
			jQuery().ready(function() {
				for(i=1;y.length > 0;i++) {
					y.addClass('level' + i).hide();
					y = y.find('> li > ul');
				}
				_top
					.bind('treeonic_collapseAll', function() {
						_top.find('ul').hide(); _top.find('ul:hidden').parent().removeClass('active');
					});
				_top.find('li').click(function(e, expandOnly) {
					e.preventDefault();
					var p = jQuery(this), q = p.find('> ul');
					if (q.length > 0) {
						if (expandOnly) {
							if (settings.exclusive)
								_top.trigger('treeonic_collapseAll');
							q.show().parents().show();
							p.addClass('active');
						}
						else
						{
							if (settings.exclusive) {
								_top.trigger('treeonic_collapseAll');
								q.show().parents().show();
								p.addClass('active');
							}
							else {
								q.toggle().parents().show();
								p.toggleClass('active');
							}
						}
					}
					return false;
				});
				if (settings.expandOnHover)
					_top.find('li').hover(
						function(e) {
							var t = $(this);
							timeoutID = window.setTimeout(function() {
								t.trigger('click', true);
							}, settings.hoverDelay);
						},
						function (e) {
							window.clearTimeout(timeoutID);
						}
					);
				if (settings.collapseOnBlur)
					$(window).click(function() {
						_top.trigger('treeonic_collapseAll'); 
					});
				if (settings.collapseOnLeave)
					_top.mouseleave(function() {
						_top.trigger('treeonic_collapseAll'); 
					});
				_top.find('a').click(function(e) {
					e.stopPropagation();
				});
				window.setTimeout(function() {
					_top.find(settings.initialSelector).trigger('click').addClass('active');
				}, 50);
			});
	}
})(jQuery);