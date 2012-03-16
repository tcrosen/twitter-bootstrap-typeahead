// ===============================================================================
//
//  Custom implementation of Twitter Bootstrap Typeahead plugin
//  http://twitter.github.com/bootstrap/javascript.html#typeahead
//
//  v1.0
//  Terry Rosen  -  @rerrify
//
//  Requires jQuery 1.7+ and Twitter Bootstrap
//
!
function($) {

  "use strict"

  // --------------------------------------------------------
  //
  //  Constructor
  //
  var Typeahead = function(element, options) {
      this.$element =     $(element);
      this.options =      $.extend({}, $.fn.typeahead.defaults, options);
      this.$menu =        $(this.options.menu).appendTo('body');      
      this.source =       this.options.source;
      this.shown =        false;

      // Overridable functions
      this.matcher =      this.options.matcher      || this.matcher;
      this.sorter =       this.options.sorter       || this.sorter;
      this.highlighter =  this.options.highlighter  || this.highlighter;
      this.select =       this.options.select       || this.select;
      this.render =       this.options.render       || this.render;

      // Run the listener    
      this.listen();
    }

  Typeahead.prototype = {

    constructor: Typeahead

    // --------------------------------------------------------
    //
    //  An item was selected from the list
    //
    ,
    select: function() {
      var $selectedItem = this.$menu.find('.active');
      this.$element.val($selectedItem.text());
      this.options.itemSelected($selectedItem.attr('data-value'));
      return this.hide();
    }

    // --------------------------------------------------------
    //
    //  Show the menu
    //
    ,
    show: function() {
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
    }

    // --------------------------------------------------------
    //
    //  Hide the menu
    //
    ,
    hide: function() {
      this.$menu.hide();
      this.shown = false;

      return this;
    }

    // --------------------------------------------------------
    //
    //  Search for an item in the source
    //
    ,
    lookup: function(event) {
      var _this = this;
      var items;
      var q;

      this.query = this.$element.val();

      if (!this.query) {
        return this.shown ? this.hide() : this;
      }

      items = $.grep(this.source, function(item) {
        var propVal = item[_this.options.matchProp];
        if (_this.matcher(propVal)) return item;
      });

      items = this.sorter(items);

      if (!items.length) {
        return this.shown ? this.hide() : this;
      }

      return this.render(items.slice(0, this.options.items)).show();
    }

    // --------------------------------------------------------
    //
    //  Looks for a match
    //
    ,
    matcher: function(val) {
      return ~val.toLowerCase().indexOf(this.query.toLowerCase());
    }

    // --------------------------------------------------------
    //
    //  Sort the results
    //
    ,
    sorter: function(items) {
      var _this = this;
      var beginswith = [];
      var caseSensitive = [];
      var caseInsensitive = [];
      var item;

      while (item = items.shift()) {
        var propVal = item[_this.options.matchProp];
        if (!propVal.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item);
        else if (~propVal.indexOf(this.query)) caseSensitive.push(item);
        else caseInsensitive.push(item);
      }

      return beginswith.concat(caseSensitive, caseInsensitive);
    }

    // --------------------------------------------------------
    //
    //  Highlight the characters found in the items
    //
    ,
    highlighter: function(item) {
      return item.replace(new RegExp('(' + this.query + ')', 'ig'), function($1, match) {
        return '<strong>' + match + '</strong>';
      })
    }

    // --------------------------------------------------------
    //
    //  Render the list
    //
    ,
    render: function(items) {
      var _this = this;

      items = $(items).map(function(i, item) {
        i = $(_this.options.item).attr('data-value', item[_this.options.valueProp]);
        if (i) {
          i.find('a').html(_this.highlighter(item[_this.options.matchProp]));
          return i[0];
        }
      })

      items.first().addClass('active');
      this.$menu.html(items);
      return this;
    }

    ,
    next: function(event) {
      var active = this.$menu.find('.active').removeClass('active');
      var next = active.next();

      if (!next.length) {
        next = $(this.$menu.find('li')[0]);
      }

      next.addClass('active');
    }

    ,
    prev: function(event) {
      var active = this.$menu.find('.active').removeClass('active');
      var prev = active.prev();

      if (!prev.length) {
        prev = this.$menu.find('li').last();
      }

      prev.addClass('active');
    }

    ,
    listen: function() {
      this.$element.on('blur', $.proxy(this.blur, this)).on('keypress', $.proxy(this.keypress, this)).on('keyup', $.proxy(this.keyup, this));

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keypress, this));
      }

      this.$menu.on('click', $.proxy(this.click, this)).on('mouseenter', 'li', $.proxy(this.mouseenter, this));
    }

    ,
    keyup: function(e) {
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
        if (!this.shown) return;
        this.select();
        break;

      case 27:
        // escape
        this.hide();
        break;

      default:
        this.lookup();
      }

    }

    ,
    keypress: function(e) {
      e.stopPropagation()
      if (!this.shown) return;

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
    }

    ,
    blur: function(e) {
      var _this = this;
      e.stopPropagation();
      e.preventDefault();
      setTimeout(function() {
        _this.hide()
      }, 150);
    }

    ,
    click: function(e) {
      e.stopPropagation();
      e.preventDefault();
      this.select();
    }

    ,
    mouseenter: function(e) {
      this.$menu.find('.active').removeClass('active');
      $(e.currentTarget).addClass('active');
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function(option) {
    return this.each(function() {
      var $this = $(this)
      var data = $this.data('typeahead');
      var options = typeof option == 'object' && option;
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: [],
    items: 8,
    menu: '<ul class="typeahead dropdown-menu"></ul>',
    item: '<li><a href="#"></a></li>',
    matchProp: 'name',
    sortProp: 'name',
    valueProp: 'id',
    itemSelected: function() {}
  }

  $.fn.typeahead.Constructor = Typeahead


  /* TYPEAHEAD DATA-API
   * ================== */

  $(function() {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function(e) {
      var $this = $(this);
      if ($this.data('typeahead')) return;
      e.preventDefault();
      $this.typeahead($this.data());
    })
  })

}(window.jQuery)
