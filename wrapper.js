/**
 * author: Alexander Vavilov (asvavilov)
 * www: yasla.net
 * 
 * wrap blocks by rows, align in rows
 * jquery plugin
 * 
 * options:
 *  childrenSelector: '.item',
 *  stretch: true,
 *  align: 'center',
 *  separator: $('<li/>', {'class': 'separator'})
 * 
 * TODO timer
 * 
 * Changelog:
 * * 1.0 (20120810)
 * * * First version
 */

(function($){  
	$.fn.wrapper = function(options){  
		var defaults = {
			childrenSelector: '.item',
			stretch: true,
			align: 'center',
			separator: $('<li/>', {'class': 'separator'})
		};
		var align2margin = {'left': 'right', 'right': 'left'};
		var options = $.extend(defaults, options);
		return this.each(function(){
			var parent = $(this);
			var children = parent.find(options.childrenSelector);
			// предположим, что у всех блоков статичные одинаковые margin
			var margins = {
				left: children.length > 0 ? parseInt($(children[0]).css('margin-left')) : 0,
				right: children.length > 0 ? parseInt($(children[0]).css('margin-right')) : 0
			}
			var recalc = function(){
				parent.find('li.separator').remove();
				// ширина может быть динамической (поэтому не кешируем)
				var eax = 0, parent_width = parent.innerWidth(), blocks_count = children.length;
				var blocks_per_row = 0, is_first_row = true;
				var b_width = 0, i = 0, rows_counter = 1;
				for (i = 0; i < blocks_count; i++) {
					var block = $(children[i]);
					// ширина может быть динамической (поэтому не кешируем)
					b_width = block.width() + margins['left'] + margins['right'];
					eax += b_width;
					if (eax > parent_width) {
						is_first_row = false;
						rows_counter++;
						block.before(options.separator.clone());
						eax = b_width;
					}
					if (options.rows_class) {
						block[0].className = $.trim(block[0].className.replace(
						new RegExp("(\\b|\\s+)" + options.rows_class + '[\\w\\d]+' + "(\\s+|\\b)", 'gi'),
						' '
						));
						block.addClass(options.rows_class + rows_counter);
					}
					if (is_first_row) {
						blocks_per_row++;
					}
				}

				if (options.rows_class) {
					children.each(function(){
						var el = $(this);
						if (el.hasClass(options.rows_class + '1')) el.addClass(options.rows_class + 'first')
						if (el.hasClass(options.rows_class + rows_counter)) el.addClass(options.rows_class + 'last')
					});
				}

				if (options['stretch'] && blocks_per_row > 0) {
					var width_per_block = Math.floor(parent_width / blocks_per_row);
					//console.log(width_per_block, parent_width, blocks_per_row)
					for (i = 0; i < blocks_count; i++) {
						var block = $(children[i]);
						// ширина может быть динамической (поэтому не кешируем)
						b_width = block.width() + margins['left'] + margins['right'];
						var wb = Math.floor((width_per_block - b_width)/2);
						// на всякий случай защита
						if (wb < 0) wb = 0;
						// если ширины блоков отличаются, то может неправильно выровняться, как вариант задавать ширину и margin auto
						// методом тыка
						if (options['align']) {
							var st = {};
							if (options['align'] == 'center') {
								st['margin-left'] = wb + margins['left'] + 'px';
								st['margin-right'] = wb + margins['right'] + 'px';
							} else {
								var margin_dir = align2margin[options['align']];
								// FIXME что-то с уже сущ. отступом не влазит, пожалуй, пока не будем его учитывать
								// this.margins[margin_dir]+
								st['margin-' + margin_dir] = (wb*2) + 'px';
							}
							block.css(st);
						}
					}
				}
			};
			$(window).on('load', recalc);
			$(window).on('resize', recalc);
		});
	};
})(jQuery);
