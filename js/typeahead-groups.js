//  ----------------------------------------------------------------------------
//
//  typeahead.js  
//
//  Customized Bootstrap Typeahead plugin with option groups.
//
//  Author: Terry Rosen
//  ----------------------------------------------------------------------------


!
function ($) {

    "use strict"

    var Typeahead = function (element, options) {
        this.$element = $(element);
        this.options = $.extend(true, {}, $.fn.typeahead.defaults, options);
        this.$menu = $(this.options.menu).appendTo('body');
        this.$form = this.$element.closest('form');
        this.field = this.options.field && this.options.field.length || this.$element.attr('name');
        this.$hidden = $('<input type="hidden" id="' + this.field + '" name="' + this.field + '" value="" />').appendTo(this.$form);
        this.shown = false;        
        this.source = this.options.source || this.source;    
        this.headerCss = { 'padding': '7px 0 3px 7px', 'text-transform': 'uppercase', 'font-weight': 'bold', 'border-bottom': '1px solid #ccc','color': '#5A5A5A' };    
        this.noresultsCss = { 'padding': '7px 0 3px 7px', 'color': '#5A5A5A' };            
        this.listen();
        this.$element.removeAttr('name');
    }

    Typeahead.prototype = {

        constructor: Typeahead,

        lookup: function (event) {
            var that = this, items, itemsPerGroup, itemCount, result = [];

            this.query = this.$element.val();
            if (!this.query) return this.shown ? this.hide() : this;                                 
            
            $(that.source).each(function (i, obj) {                
                items = $.grep(obj.items, $.proxy(that.matcher, that));                
                itemCount += items.length;
                if (items.length) result.push({ id: obj.id, name: obj.name, items: items });
            });
            
            itemsPerGroup = (itemCount > this.options.maxItems && result.length > this.options.maxItems) ? 1 : this.options.maxItems / result.length;                

            if (!result.length) {
                return that.renderNoResults().show();
            }

            for (var i = 0; i < result.length; i++) {
                result[i].items = result[i].items.slice(0, itemsPerGroup);
            }            

            return this.render(result).show();
        },

        matcher: function (item) {  
            return ~item[this.options.display].toLowerCase().indexOf(this.query.toLowerCase());
        },    

        show: function () {
            var pos = $.extend({}, this.$element.offset(), {
                height: this.$element[0].offsetHeight
            });

            this.$menu.css({ top: pos.top + pos.height, left: pos.left }).show();
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

        render: function (data) {
            var that = this, item;

            that.$menu.empty();

            $(data).each(function (i, obj) {                
                item = $(that.options.header).attr('data-id', obj[that.options.val]).html(obj[that.options.display]).css(that.headerCss);

                that.$menu.append(item[0]);

                $(obj.items).each(function () {
                    item = $(that.options.item).attr('data-parent-id', obj[that.options.val]).attr('data-id', this[that.options.val]);
                    item.find('a').html(that.highlighter(this[that.options.display]));
                    that.$menu.append(item[0]);
                });                
            });

            that.$menu.first('.group-item').addClass('active');
            return this;
        },

        renderNoResults: function () {
            var that = this, 
                item = $(that.options.noresult.replace(/@q/, that.query)).css(that.noresultsCss);
            
            that.$menu.empty().append(item[0]); 
            return this;
        },


        select: function () {
            var $selected = this.$menu.find('.active');

            if ($selected) {                
                this.$element.val($selected.text()).change();
                this.$hidden.val($selected.attr('data-id'));
                this.options.itemSelected($selected);
            }

            return this.hide();
        },

        next: function (event) {
            var active = this.$menu.find('.active').removeClass('active');
            var next = active.next();

            if (next.hasClass('group-header')){
                next = next.next();
            }

            if (!next.length) {
                next = $(this.$menu.find('li.group-item')[0]);
            }

            next.addClass('active');
        },

        prev: function (event) {
            var active = this.$menu.find('.active').removeClass('active');
            var prev = active.prev();

            if (prev.hasClass('group-header')){
                prev = prev.prev();
            }

            if (!prev.length) {
                prev = this.$menu.find('li.group-item').last();
            }

            prev.addClass('active');
        },

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

        keyup: function (e) {
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

        keypress: function (e) {
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

        blur: function (e) {
            var that = this;
            e.preventDefault();
            setTimeout(function () {
                if (!that.$menu.is(':hover')) {
                  that.hide();
                }
            }, 150)
        },

        click: function (e) {
            e.preventDefault();
            if ($(e.srcElement).parent().hasClass('group-item')) {
                this.select();
            }
        },

        mouseenter: function (e) {
            this.$menu.find('.active').removeClass('active');
            if ($(e.currentTarget).hasClass('group-item')) {            
                $(e.currentTarget).addClass('active');
            }
        }
    }

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

    $.fn.typeahead.defaults = {
        source: [],
        maxItems: 8,
        menu: '<ul class="typeahead dropdown-menu"></ul>',
        header: '<li class="group-header"></li>',
        item: '<li class="group-item"><a href="#"></a></li>',
        noresult: '<li class="no-results"><i>No match for <strong>@q</strong></i></li>',
        display: 'name',
        val: 'id',
        field: '',        
        itemSelected: function () { }
    }

    $.fn.typeahead.Constructor = Typeahead;
} (window.jQuery);