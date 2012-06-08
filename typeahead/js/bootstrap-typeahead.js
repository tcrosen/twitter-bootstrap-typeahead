//
//  bootstrap-typeahead.js
//
//  Terry Rosen
//  https://github.com/tcrosen/
//
//  Custom implementation of Twitter Bootstrap Typeahead plugin
//  http://twitter.github.com/bootstrap/javascript.html#typeahead
//
//  Requires jQuery 1.7+ and Twitter Bootstrap
//

!
function ($) {

    "use strict"

    //-------------------------------------------------------------------------------------------
    //
    //  Constructor
    //
    var Typeahead = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.typeahead.defaults, options);
        this.$menu = $(this.options.menu).appendTo('body');
        this.source = this.options.source || this.source;
        this.shown = false;
        this.sorter = this.options.sorter || this.sorter;
        this.highlighter = this.options.highlighter || this.highlighter;
        this.matcher = this.options.matcher || this.matcher;
        this.select = this.options.select || this.select;
        this.render = this.options.render || this.render;
        this.listen();
    }

    Typeahead.prototype = {

        constructor: Typeahead,

        //-------------------------------------------------------------------------------------------
        //
        //  Shows the results list
        //
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

        //-------------------------------------------------------------------------------------------
        //
        //  Hides the results list
        //
        hide: function () {
            this.$menu.hide();
            this.shown = false;
            return this;
        },

        //-------------------------------------------------------------------------------------------
        //
        //  Searches the source
        //
        lookup: function (event) {
            var that = this,
                items;

            that.query = that.$element.val();

            if (!that.query) {
                return that.shown ? that.hide() : that;
            }

            items = $.grep(that.source, function (item) {
                if (!item.hasOwnProperty(that.options.display)) {
                    // Helpful console log for developers who may accidentally type a property name incorrectly
                    console.log('typeahead.lookup(): source object has no property named "' + that.options.display + '"');
                    return false;
                } else {
                    return that.matcher(item[that.options.display]);
                }
            });

            items = this.sorter(items);

            if (!items.length) {
                return that.shown ? that.hide() : that;
            }

            return that.render(items.slice(0, that.options.items)).show();
        },

        //-------------------------------------------------------------------------------------------
        //
        //  Looks for a match in the source
        //
        matcher: function (item) {
            return ~item.toLowerCase().indexOf(this.query.toLowerCase());
        },

        //-------------------------------------------------------------------------------------------
        //
        //  Sorts the results
        //
        sorter: function (items) {
            var that = this,
                beginswith = [],
                caseSensitive = [],
                caseInsensitive = [],
                item;

            while (item = items.shift()) {
                if (!item[that.options.display].toLowerCase().indexOf(this.query.toLowerCase())) {
                    beginswith.push(item);
                }
                else if (~item[that.options.display].indexOf(this.query)) {
                    caseSensitive.push(item);
                }
                else {
                    caseInsensitive.push(item);
                }
            }

            return beginswith.concat(caseSensitive, caseInsensitive);
        },

        //-------------------------------------------------------------------------------------------
        //
        //  Highlights the match(es) within the results
        //
        highlighter: function (item) {
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
            return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>';
            });
        },

        //-------------------------------------------------------------------------------------------
        //
        //  Renders the results list
        //
        render: function (items) {
            var that = this;

            items = $(items).map(function (i, item) {
                i = $(that.options.item).attr('data-value', item[that.options.val]);
                i.find('a').html(that.highlighter(item[that.options.display]));
                return i[0];
            });

            items.first().addClass('active');
            this.$menu.html(items);
            return this;
        },

        //-------------------------------------------------------------------------------------------
        //
        //  Item is selected
        //
        select: function () {
            var $selectedItem = this.$menu.find('.active');
            this.$element.val($selectedItem.text()).change();
            this.options.itemSelected($selectedItem, $selectedItem.attr('data-value'), $selectedItem.text());
            return this.hide();
        },

        //-------------------------------------------------------------------------------------------
        //
        //  Selects the next result
        //
        next: function (event) {
            var active = this.$menu.find('.active').removeClass('active');
            var next = active.next();

            if (!next.length) {
                next = $(this.$menu.find('li')[0]);
            }

            next.addClass('active');
        },

        //-------------------------------------------------------------------------------------------
        //
        //  Selects the previous result
        //
        prev: function (event) {
            var active = this.$menu.find('.active').removeClass('active');
            var prev = active.prev();

            if (!prev.length) {
                prev = this.$menu.find('li').last();
            }

            prev.addClass('active');
        },

        //-------------------------------------------------------------------------------------------
        //
        //  Listens for user events
        //
        listen: function () {
            this.$element.on('blur', $.proxy(this.blur, this))
                         .on('keypress', $.proxy(this.keypress, this))
                         .on('keyup', $.proxy(this.keyup, this));

            if ($.browser.webkit || $.browser.msie) {
                this.$element.on('keydown', $.proxy(this.keypress, this));
            }

            this.$menu.on('click', $.proxy(this.click, this))
                      .on('mouseenter', 'li', $.proxy(this.mouseenter, this));
        },

        //-------------------------------------------------------------------------------------------
        //
        //  Handles a key being raised up
        //
        keyup: function (e) {
            e.stopPropagation();
            e.preventDefault();

            switch (e.keyCode) {
                case 40:
                    // down arrow
                case 38:
                    // up arrow
                    break;
                case 9:
                    // tab
                case 13:
                    // enter
                    if (!this.shown) {
                        return;
                    }
                    this.select();
                    break;
                case 27:
                    // escape
                    this.hide();
                    break;
                default:
                    this.lookup();
            }
        },

        //-------------------------------------------------------------------------------------------
        //
        //  Handles a key being pressed
        //
        keypress: function (e) {
            e.stopPropagation();
            if (!this.shown) {
                return;
            }

            switch (e.keyCode) {
                case 9:
                    // tab
                case 13:
                    // enter
                case 27:
                    // escape
                    e.preventDefault();
                    break;
                case 38:
                    // up arrow
                    e.preventDefault();
                    this.prev();
                    break;
                case 40:
                    // down arrow
                    e.preventDefault();
                    this.next();
                    break;
            }
        },

        //-------------------------------------------------------------------------------------------
        //
        //  Handles cursor exiting the textbox
        //
        blur: function (e) {
            var that = this;
            e.stopPropagation();
            e.preventDefault();
            setTimeout(function () {
                that.hide();
            }, 150);
        },

        //-------------------------------------------------------------------------------------------
        //
        //  Handles clicking on the results list
        //
        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.select();
        },

        //-------------------------------------------------------------------------------------------
        //
        //  Handles the mouse entering the results list
        //
        mouseenter: function (e) {
            this.$menu.find('.active').removeClass('active');
            $(e.currentTarget).addClass('active');
        }
    }


    //-------------------------------------------------------------------------------------------
    //
    //  Plugin definition
    //
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
        })
    }

    //-------------------------------------------------------------------------------------------
    //
    //  Set default options
    //
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


    //-------------------------------------------------------------------------------------------
    //
    //  DOM-ready call for the Data API (no-JS implementation)
    //    
    //  Note: As of Bootstrap v2.0 this feature may be disabled using $('body').off('.data-api')    
    //  More info here: https://github.com/twitter/bootstrap/tree/master/js
    //
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
