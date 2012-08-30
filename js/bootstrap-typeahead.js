//  ----------------------------------------------------------------------------
//
//  bootstrap-typeahead.js
//
//  Twitter Bootstrap Typeahead Plugin
//  v1.2.2
//  https://github.com/tcrosen/twitter-bootstrap-typeahead
//
//
//  Author
//  ----------
//  Terry Rosen
//  tcrosen@gmail.com | @rerrify | github.com/tcrosen/
//
//
//  Description
//  ----------
//  Custom implementation of Twitter's Bootstrap Typeahead Plugin
//  http://twitter.github.com/bootstrap/javascript.html#typeahead
//
//
//  Requirements
//  ----------
//  jQuery 1.7+
//  Twitter Bootstrap 2.0+
//
//  ----------------------------------------------------------------------------

!
function ($) {

    "use strict";


    var Typeahead = function (element, options) {
        this.$element = $(element);
        this.options = $.extend(true, {}, $.fn.typeahead.defaults, options);
        this.$menu = $(this.options.menu).appendTo('body');
        this.shown = false;

        this.keyCodes = {
					DOWN: 40,
          ENTER: 13 || 108,
          ESCAPE: 27,
          TAB: 9,
          UP: 38
        }

        this.initSource();
        this.listen();
    }

    Typeahead.prototype = {

        constructor: Typeahead,

        initSource: function() {
        	if (this.options.source) {
        		if (typeof this.options.source === 'string') {
        			this.source = $.extend({}, $.ajaxSettings, { url: this.options.source })
        		}
        		else if (typeof this.options.source === 'object') {
		            if (this.options.source instanceof Array) {
		          		this.source = this.options.source;
			          } else {
			          	this.source = $.extend({}, $.ajaxSettings, this.options.source);
			          }
        		}
        	}
        },

        //  Included to handle the "exhaustive deprecation" of jQuery.browser in jQuery 1.8
        eventSupported: function(eventName) {
            var isSupported = (eventName in this.$element);

            if (!isSupported) {
              this.$element.setAttribute(eventName, 'return;');
              isSupported = typeof this.$element[eventName] === 'function';
            }

            return isSupported;
        },

        ajaxer: function () {
            var that = this,
                query = that.$element.val();

            if (query === that.query) {
                return that;
            }

            // Query changed
            that.query = query;

            // Cancel last timer if set
            if (that.ajax.timerId) {
                clearTimeout(that.ajax.timerId);
                that.ajax.timerId = null;
            }

            if (!query || query.length < that.ajax.triggerLength) {
                // Cancel the ajax callback if in progress
                if (that.ajax.xhr) {
                    that.ajax.xhr.abort();
                    that.ajax.xhr = null;
                    that.ajaxToggleLoadClass(false);
                }

                return that.shown ? that.hide() : that;
            }

            // Query is good to send, set a timer
            that.ajax.timerId = setTimeout(function() {
                $.proxy(that.ajaxExecute(query), that)
            }, that.ajax.timeout);

            return that;
        },

        ajaxExecute: function(query) {
            this.ajaxToggleLoadClass(true);

            // Cancel last call if already in progress
            if (this.ajax.xhr) this.ajax.xhr.abort();

            var params = this.ajax.preDispatch ? this.ajax.preDispatch(query) : { query : query };

            this.ajax.xhr = $.ajax({
            	url: this.ajax.url,
            	data: params,
            	success: $.proxy(this.ajaxLookup, this)
            });

            this.ajax.timerId = null;
        },

        ajaxLookup: function (data) {
            var items;

            this.ajaxToggleLoadClass(false);

            if (!this.ajax.xhr) return;

            if (this.ajax.preProcess) {
                data = this.ajax.preProcess(data);
            }

            // Save for selection retreival
            this.ajax.data = data;

            items = this.grepper(this.ajax.data);

            if (!items || !items.length) {
                return this.shown ? this.hide() : this;
            }

            this.ajax.xhr = null;

            return this.render(items.slice(0, this.options.items)).show();
        },

        ajaxToggleLoadClass: function (enable) {
            if (!this.ajax.loadingClass) return;
            this.$element.toggleClass(this.ajax.loadingClass, enable);
        },

        lookup: function (event) {
            var that = this,
                items;

            if (this.source.url) {

            } else {

            }
            if (that.ajax) {
                that.ajaxer();
            }
            else {
                that.query = that.$element.val();

                if (!that.query) {
                    return that.shown ? that.hide() : that;
                }

                items = that.grepper(that.source);

                if (!items || !items.length) {
                    return that.shown ? that.hide() : that;
                }

                return that.render(items.slice(0, that.options.items)).show();
            }
        },

        grepper: function(data) {
            var that = this,
                items;

            if (data && data.length && !data[0].hasOwnProperty(that.options.display)) {
                return null;
            }

            items = $.grep(data, function (item) {
                return that.matcher(item[that.options.display], item);
            });

            return this.sorter(items);
        },

        matcher: function (item) {
            return ~item.toLowerCase().indexOf(this.query.toLowerCase());
        },

        sorter: function (items) {
            var that = this,
                beginswith = [],
                caseSensitive = [],
                caseInsensitive = [],
                item;

            while (item = items.shift()) {
                if (!item[that.options.display].toLowerCase().indexOf(this.query.toLowerCase())) {
                    beginswith.push(item);
                } else if (~item[that.options.display].indexOf(this.query)) {
                    caseSensitive.push(item);
                } else {
                    caseInsensitive.push(item);
                }
            }

            return beginswith.concat(caseSensitive, caseInsensitive);
        },

        show: function () {
            var pos = $.extend({}, this.$element.offset(), {
                height: this.$element[0].offsetHeight
            });

            this.$menu.css({
                top: pos.top + pos.height,
                left: pos.left
            });

            this.$menu.show();
            this.shown = true;
            return this;
        },

        hide: function () {
            this.$menu.hide();
            this.shown = false;
            return this;
        },

        highlighter: function (item) {
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
            return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>';
            });
        },

        render: function (items) {
            var that = this;

            items = $(items).map(function (i, item) {
                i = $(that.options.item).attr('data-value', item[that.options.val]);
                i.find('a').html(that.highlighter(item[that.options.display], item));
                return i[0];
            });

            items.first().addClass('active');
            this.$menu.html(items);
            return this;
        },

        select: function () {
            var $selectedItem = this.$menu.find('.active');
            this.$element.val($selectedItem.text()).change();
            this.options.itemSelected($selectedItem, $selectedItem.attr('data-value'), $selectedItem.text());
            return this.hide();
        },

        next: function (event) {
            var active = this.$menu.find('.active').removeClass('active');
            var next = active.next();

            if (!next.length) {
                next = $(this.$menu.find('li')[0]);
            }

            next.addClass('active');
        },

        prev: function (event) {
            var active = this.$menu.find('.active').removeClass('active');
            var prev = active.prev();

            if (!prev.length) {
                prev = this.$menu.find('li').last();
            }

            prev.addClass('active');
        },

        listen: function () {
            this.$element.on('blur', $.proxy(this.blur, this))
                         .on('keypress', $.proxy(this.keypress, this))
                         .on('keyup', $.proxy(this.keyup, this));

            if (this.eventSupported('keydown')) {
               this.$element.on('keydown', $.proxy(this.keypress, this));
            }

            this.$menu.on('click', $.proxy(this.click, this))
                      .on('mouseenter', 'li', $.proxy(this.mouseenter, this));
        },

        keyup: function (e) {
            e.stopPropagation();
            e.preventDefault();

            switch (e.keyCode) {
                case this.keyCodes.DOWN:
                case this.keyCodes.UP:
                    break;
                case this.keyCodes.TAB:
                case this.keyCodes.ENTER:
                    if (!this.shown) {
                        return;
                    }
                    this.select();
                    break;
                case this.keyCodes.ESCAPE:
                    this.hide();
                    break;
                default:
                    this.lookup();
            }
        },

        keypress: function (e) {
            e.stopPropagation();

            if (!this.shown) {
                return;
            }

            switch (e.keyCode) {
                case this.keyCodes.TAB:
                case this.keyCodes.ESCAPE:
                case this.keyCodes.ENTER:
                    e.preventDefault();
                    break;
                case this.keyCodes.UP:
                    e.preventDefault();
                    this.prev();
                    break;
                case this.keyCodes.DOWN:
                    e.preventDefault();
                    this.next();
                    break;
            }
        },

        blur: function (e) {
            var that = this;
            e.stopPropagation();
            e.preventDefault();
            setTimeout(function () {
                if (!that.$menu.is(':focus')) {
                  that.hide();
                }
            }, 150)
        },

        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.select();
        },

        mouseenter: function (e) {
            this.$menu.find('.active').removeClass('active');
            $(e.currentTarget).addClass('active');
        }
    }

    //  Plugin definition
    $.fn.typeahead = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('typeahead'),
                options = typeof option === 'object' && option;

            if (!data) {
                $this.data('typeahead', (data = new Typeahead(this, options)));
            }

            if (typeof option === 'string') {
                data[option]();
            }
        });
    }

    //  Defaults
    $.fn.typeahead.defaults = {
        source: [],
        items: 8,
        menu: '<ul class="typeahead dropdown-menu"></ul>',
        item: '<li><a href="#"></a></li>',
        display: 'name',
        val: 'id',
        itemSelected: function () { }
    }

    $.fn.typeahead.Constructor = Typeahead;


    //  Data API (no-JS implementation)
    $(function () {
        $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
            var $this = $(this);

            if ($this.data('typeahead')) {
                return;
            }

            e.preventDefault();
            $this.typeahead($this.data());
        })
    });

} (window.jQuery);
