

(function($) {

	jQuery.fn.slidertron = function(options) {
		
		var settings = jQuery.extend({
			selectorParent:		jQuery(this)
		}, options);
		
		return jQuery.slidertron(settings);
	}

	jQuery.slidertron = function(options) {

		// Settings
		
			var settings = jQuery.extend({
			
				selectorParent:						null,						// If a jQuery object, all selectors will be restricted to its scope. Otherwise, all selectors will be global.
				
				// Selectors
				
					viewerSelector:					null,						// Viewer selector
					reelSelector:					null,						// Reel selector
					slidesSelector:					null,						// Slides selector
					indicatorSelector:				null,						// Indicator selector
					navNextSelector:				null,						// 'Next' selector
					navPreviousSelector:			null,						// 'Previous' selector
					navFirstSelector:				null,						// 'First' selector
					navLastSelector:				null,						// 'Last' selector
					navStopAdvanceSelector:			null,						// 'Stop Advance' selector
					navPlayAdvanceSelector:			null,						// 'Play Advance' selector
					captionLineSelector:			null,						// 'Caption Line' selector
					slideLinkSelector:				null,						// 'Slide Link' selector
					slideCaptionSelector:			null,						// 'Slide Caption' selector

				// General settings

					speed:							'fast',						// Transition speed (0 for instant, 'slow', 'fast', or a custom duration in ms)
					navWrap:						true,						// Wrap navigation when we navigate past the first or last slide
					seamlessWrap:					true,						// Seamlessly wrap slides
					advanceDelay:					0,							// Time to wait (in ms) before automatically advancing to the next slide (0 disables advancement entirely)
					advanceNavActiveClass:			'active',					// Active advancement navigation class
					viewerOffset:					0,							// Viewer offset amount	(+ = shift right, - = shift left)	
					activeSlideClass:				null,						// Active slide class
					clickToNav:						true,						// Navigate to a slide when clicked (used in conjunction with viewerOffset)
					captionLines:					1							// Number of caption lines. If this is > 1, the plugin will look for additional caption elements using the captionSelector setting + a number (eg. '.caption2', '.caption3', etc.)

			}, options);
			
		// Variables

			// Operational stuff
		
				var isConfigured = true,
					isLocked = false,
					isAdvancing = false,
					isSeamless = false,
					list = new Array(),
					currentIndex = false,
					timeoutID,
					pFirst,
					pLast;

			// jQuery objects

				var __slides,
					__viewer,
					__indicator,
					__navFirst,
					__navLast,
					__navNext,
					__navPrevious,
					__navStopAdvance,
					__navPlayAdvance,
					__captionLines;

		// Functions
			
			function getElement(selector, required)
			{
				var x;
				
				try
				{
					if (selector == null)
						throw 'is undefined';
			
					if (settings.selectorParent)
						x = settings.selectorParent.find(selector);
					else
						x = jQuery(selector);
					
					if (x.length == 0)
						throw 'does not exist';
					
					return x;
				}
				catch (error)
				{
					if (required == true)
					{
						alert('Error: Required selector "' + selector + '" ' + error + '.');
						isConfigured = false;
					}
				}
				
				return null;
			}

			function advance()
			{
				if (settings.advanceDelay == 0)
					return;
			
				if (!isLocked)
					nextSlide();

				timeoutID = window.setTimeout(advance, settings.advanceDelay);
			}

			function initializeAdvance()
			{
				if (settings.advanceDelay == 0)
					return;

				if (__navPlayAdvance)
					__navPlayAdvance.addClass(settings.advanceNavActiveClass);
				
				if (__navStopAdvance)
					__navStopAdvance.removeClass(settings.advanceNavActiveClass);

				isAdvancing = true;
				timeoutID = window.setTimeout(advance, settings.advanceDelay);
			}
			
			function interruptAdvance()
			{
				stopAdvance();
			}
			
			function stopAdvance()
			{
				if (settings.advanceDelay == 0)
					return;

				if (!isAdvancing)
					return;
			
				isAdvancing = false;
				window.clearTimeout(timeoutID);
			}
			
			function playAdvance(skip)
			{
				if (settings.advanceDelay == 0)
					return;

				if (isAdvancing)
					return;
					
				isAdvancing = true;

				if (skip)
					timeoutID = window.setTimeout(advance, settings.advanceDelay);
				else
					advance();
			}
			
			function firstSlide()
			{
				switchSlide(pFirst);
			}
			
			function lastSlide()
			{
				switchSlide(pLast);
			}

			function nextSlide()
			{
				if ((isSeamless && currentIndex <= pLast)
				||	(!isSeamless && currentIndex < pLast))
					switchSlide(currentIndex + 1);
				else if (settings.navWrap || isAdvancing)
					switchSlide(pFirst);
			}
			
			function previousSlide()
			{
				if ((isSeamless && currentIndex >= pFirst)
				||	(!isSeamless && currentIndex > pFirst))
					switchSlide(currentIndex - 1);
				else if (settings.navWrap)
					switchSlide(pLast);
			}

			function switchSlide(index)
			{
				var x;
				// Check locking status (so another switch can't be initiated while another is in progress)

				if (isLocked)
					return false;
					
				isLocked = true;

				if (currentIndex === false)
				{
					currentIndex = index;
					__reel.css('left', -1 * list[currentIndex].x);
					isLocked = false;

					// Indicator
						if (__indicator)
						{
							__indicator.removeClass('active');
							$(__indicator.get(currentIndex - pFirst)).addClass('active');
						}

					// Active slide
						if (settings.activeSlideClass)
							list[currentIndex].object
								.addClass(settings.activeSlideClass)

					// Link
						if (settings.clickToNav && !list[currentIndex].link)
							list[currentIndex].object
								.css('cursor', 'default');
					
					// Captions
						if (__captionLines)
						{
							if (list[currentIndex].captions)
								for (x in __captionLines)
									__captionLines[x].html(list[currentIndex].captions[x]);
							else
								for (x in __captionLines)
									__captionLines[x].html('');
						}
				}
				else
				{
					var diff, currentX, newX, realIndex;
					
					if (settings.activeSlideClass)
						list[currentIndex].object
							.removeClass(settings.activeSlideClass);

					if (settings.clickToNav)
						list[currentIndex].object
							.css('cursor', 'pointer');
					
					currentX = list[currentIndex].x;
					newX = list[index].x;
					diff = currentX - newX;

					// Get real index
						if (list[index].realIndex !== false)
							realIndex = list[index].realIndex;
						else
							realIndex = index;

					// Indicator
						if (__indicator)
						{
							__indicator.removeClass('active');
							$(__indicator.get(realIndex - pFirst)).addClass('active');
						}

					// Captions
						if (__captionLines)
						{
							if (list[realIndex].captions)
								for (x in __captionLines)
									__captionLines[x].html(list[realIndex].captions[x]);
							else
								for (x in __captionLines)
									__captionLines[x].html('');
						}

					__reel.animate({ left: '+=' + diff }, settings.speed, 'swing', function() {
						currentIndex = index;

						// Get real index and adjust reel position
							if (list[currentIndex].realIndex !== false)
							{
								currentIndex = list[currentIndex].realIndex;
								__reel.css('left', -1 * list[currentIndex].x);
							}

						// Active slide
							if (settings.activeSlideClass)
								list[currentIndex].object
									.addClass(settings.activeSlideClass);

						// Link
							if (settings.clickToNav && !list[currentIndex].link)
								list[currentIndex].object
									.css('cursor', 'default');

						isLocked = false;
					});
				}
			}

			function initialize()
			{
				var tmp, a, s;

				// Slides, viewer, reel, indicator

					__viewer = getElement(settings.viewerSelector, true);
					__reel = getElement(settings.reelSelector, true);
					__slides = getElement(settings.slidesSelector, true);
					__indicator = getElement(settings.indicatorSelector, false);

				// Caption lines

					a = new Array();
				
					for (i = 1; i <= settings.captionLines; i++)
					{
						s = settings.captionLineSelector;

						if (settings.captionLines > 1)
							s = s + i;

						tmp = getElement(s, false);
						
						if (tmp == null)
						{
							a = null;
							break;
						}
						
						a.push(tmp);
					}
					
					__captionLines = a;

				// Navigation

					__navFirst = getElement(settings.navFirstSelector);
					__navLast = getElement(settings.navLastSelector);
					__navNext = getElement(settings.navNextSelector);
					__navPrevious = getElement(settings.navPreviousSelector);
					__navStopAdvance = getElement(settings.navStopAdvanceSelector);
					__navPlayAdvance = getElement(settings.navPlayAdvanceSelector);

				// Check configuration status
				
					if (__indicator)
					{
						if (__indicator.length != __slides.length)
						{
							alert('Error: Indicator needs to have as many items as there are slides.');
							return;
						}
					}
				
					if (isConfigured == false)
					{
						alert('Error: One or more configuration errors detected. Aborting.');
						return;
					}

				// Set up

					// Viewer
					
						__viewer.css('position', 'relative');
						__viewer.css('overflow', 'hidden');

					// Reel
					
						__reel.css('position', 'absolute');
						__reel.css('left', 0);
						__reel.css('top', 0);

					// Slides
				
						var cx = 0, length = __slides.length;
				
						if (settings.seamlessWrap)
						{
							isSeamless = true;

							var L1 = __slides.eq(0);
							var L2 = __slides.eq(Math.min(length - 1, 1));
							var R2 = __slides.eq(Math.max(length - 2, 0));
							var R1 = __slides.eq(Math.max(length - 1, 0));
							
							var realFirst = L1;
							var realLast = R1;

							R2.clone().insertBefore(realFirst);
							R1.clone().insertBefore(realFirst);
							L2.clone().insertAfter(realLast);
							L1.clone().insertAfter(realLast);

							__slides = getElement(settings.slidesSelector, true);
							
							pFirst = 2;
							pLast = __slides.length - 3;
						}
						else
						{
							pFirst = 0;
							pLast = length - 1;
						}
						
						__slides.each(function(index) {

							var y = jQuery(this), link = false, captions = new Array();
							var l, i, tmp, s;

							// click to nav?
								if (settings.clickToNav)
								{
									y
										.css('cursor', 'pointer')
										.click(function(e) {
											if (currentIndex != index)
											{
												e.stopPropagation();

												if (isAdvancing)
													interruptAdvance();

												switchSlide(index);
											}
										});
								}

							// Link?
								var l = y.find(settings.slideLinkSelector);
								
								if (l.length > 0)
								{
									link = l.attr('href');
									l.remove();
									y
										.css('cursor', 'pointer')
										.click(function(e) {
											if (currentIndex == index)
												window.location = link;
										});
								}

							// Caption(s)?
								
								for (i = 1; i <= settings.captionLines; i++)
								{
									s = settings.slideCaptionSelector;

									if (settings.captionLines > 1)
										s = s + i;

									tmp = y.find(s);

									if (tmp.length > 0)
									{
										captions.push(tmp.html());
										tmp.remove();
									}
								}
							
								if (captions.length != settings.captionLines)
									captions = false;
							
							list[index] = {
								object:		y,
								x:			cx - settings.viewerOffset,
								realIndex:	false,
								link:		link,
								captions:	captions
							};
							
							y.css('position', 'absolute');
							y.css('left', cx);
							y.css('top', 0);
							
							cx += y.width();
						});

						if (isSeamless)
						{
							list[pFirst - 1].realIndex = pLast;
							list[pLast + 1].realIndex = pFirst;
						}

					// Indicator
					
						if (__indicator)
						{
							__indicator.each(function() {
								var t = $(this);
								
								t
									.css('cursor', 'pointer')
									.click(function(event) {
										event.preventDefault();

										if (isLocked)
											return false;

										if (isAdvancing)
											interruptAdvance();

										switchSlide(t.index() + pFirst);
									});
							});
						}
					
					// Navigation

						if (__navFirst)
							__navFirst.click(function(event) {
								event.preventDefault();

								if (isLocked)
									return false;

								if (isAdvancing)
									interruptAdvance();
								
								firstSlide();
							});

						if (__navLast)
							__navLast.click(function(event) {
								event.preventDefault();

								if (isLocked)
									return false;

								if (isAdvancing)
									interruptAdvance();

								lastSlide();
							});

						if (__navNext)
							__navNext.click(function(event) {
								event.preventDefault();

								if (isLocked)
									return false;

								if (isAdvancing)
									interruptAdvance();

								nextSlide();
							});

						if (__navPrevious)
							__navPrevious.click(function(event) {
								event.preventDefault();

								if (isLocked)
									return false;
							
								if (isAdvancing)
									interruptAdvance();

								previousSlide();
							});

						if (__navStopAdvance)
							__navStopAdvance.click(function(event) {
								event.preventDefault();

								// Disruptive action, so no lock checking

								if (!isAdvancing)
									return false;

								__navStopAdvance.addClass(settings.advanceNavActiveClass);
								
								if (__navPlayAdvance)
									__navPlayAdvance.removeClass(settings.advanceNavActiveClass);

								stopAdvance();
							});

						if (__navPlayAdvance)
							__navPlayAdvance.click(function(event) {
								event.preventDefault();

								// Disruptive action, so no lock checking

								if (isAdvancing)
									return false;

								__navPlayAdvance.addClass(settings.advanceNavActiveClass);
								
								if (__navStopAdvance)
									__navStopAdvance.removeClass(settings.advanceNavActiveClass);

								playAdvance();
							});

			}

			// Ready

				jQuery().ready(function() {
					initialize();
					initializeAdvance();
					firstSlide();
				});
	};

})(jQuery);