/*
	Treeonic 0.2: General purpose expanding tree plugin (see examples).
	By nodethirtythree design | http://nodethirtythree.com/
	Dual licensed under the MIT or GPL license.
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	MIT LICENSE:
	Copyright (c) 2010 nodethirtythree design, http://nodethirtythree.com/
	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
	files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use,
	copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	GPL LICENSE:
	Copyright (c) 2010 nodethirtythree design, http://nodethirtythree.com/
	This program is free software: you can redistribute it and/or modify it	under the terms of the GNU General Public License as
	published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is
	distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
	or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of
	the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>. 
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/
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