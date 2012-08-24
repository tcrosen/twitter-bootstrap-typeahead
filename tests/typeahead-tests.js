$(function () {          
    module("bootstrap-typeahead", {
        setup: function () {
            this._data = parseFloat($.fn.jquery) === 1.8 ? $._data : $.data;                
            this._eventSupported = function(eventName) {     
                var $el = $('body').append('<div />'),
                    isSupported = (eventName in $el);
                if (!isSupported) {
                  $el.setAttribute(eventName, 'return;');
                  isSupported = typeof $el[eventName] === 'function';
                }
                return isSupported;
            }

            $.mockjax({
                url: '/test',
                responseText: [{ id: 1, name: 'aaa' }, { id: 2, name: 'aab' }, { id: 3, name: 'aac'}, { id: 4, name: 'abc'}, { id: 5, name: 'bbc'}]
            });                
        },
        teardown: function () {
            $.mockjaxClear();
        }
    });

    test("should be defined on jquery object", function () {
        ok($(document.body).typeahead, 'alert method is defined');
    });

    test("should return element", function () {
        ok($(document.body).typeahead()[0] == document.body, 'document.body returned');
    });

    test("should listen to an input", function () {
        var $input = $('<input />');
        $input.typeahead();

        ok(this._data($input[0], 'events').blur, 'has a blur event');
        ok(this._data($input[0], 'events').keypress, 'has a keypress event');
        ok(this._data($input[0], 'events').keyup, 'has a keyup event');

        if (this._eventSupported('keydown')) {
            ok(this._data($input[0], 'events').keydown, 'has a keydown event');
        } else {
            ok(this._data($input[0], 'events').keydown, 'does not have a keydown event');
        }
    });

    test("should create a menu", function () {
        var $input = $('<input />');
        ok($input.typeahead().data('typeahead').$menu, 'has a menu');
    });

    test("should listen to the menu", function () {
        var $input = $('<input />'),
            $menu = $input.typeahead().data('typeahead').$menu;

        ok($._data($menu[0], 'events').mouseover, 'has a mouseover(pseudo: mouseenter)');
        ok($._data($menu[0], 'events').click, 'has a click');
    });

    test("should show menu when query entered", function () {
        var $input = $('<input />').typeahead({
                source: [{ id: 1, name: 'aa' }, { id: 2, name: 'ab' }, { id: 3, name: 'ac'}]
            }),
            typeahead = $input.data('typeahead');

        $input.val('a');
        typeahead.lookup();

        ok(typeahead.$menu.is(":visible"), 'typeahead is visible');
        equal(typeahead.$menu.find('li').length, 3, 'has 3 items in menu');
        equal(typeahead.$menu.find('.active').length, 1, 'one item is active');

        typeahead.$menu.remove();
    });

    test("should not explode when invalid display property entered", function () {
        var $input = $('<input />').typeahead({
                source: [{ id: 1, invalidproperty: 'aa' }, { id: 2, invalidproperty: 'ab' }, { id: 3, invalidproperty: 'ac'}]
            }),
            typeahead = $input.data('typeahead');

        $input.val('a');
        typeahead.lookup();

        ok(typeahead.$menu.is(":visible"), 'typeahead is visible');
        equal(typeahead.$menu.find('li').length, 0, 'has no items in menu');
        equal(typeahead.$menu.find('.active').length, 0, 'no items are active');

        typeahead.$menu.remove();
    });

    test("should not explode when regex chars are entered", function () {
        var $input = $('<input />').typeahead({
                source: [{ id: 1, name: 'aa' }, { id: 2, name: 'ab' }, { id: 3, name: 'ac' }, { id: 4, name: 'mdo*' }, { id: 5, name: 'fat+'}]
            }),
            typeahead = $input.data('typeahead');

        $input.val('+');
        typeahead.lookup();

        ok(typeahead.$menu.is(":visible"), 'typeahead is visible');
        equal(typeahead.$menu.find('li').length, 1, 'has 1 item in menu');
        equal(typeahead.$menu.find('.active').length, 1, 'one item is active');

        typeahead.$menu.remove();
    });

    test("should hide menu when query entered", function () {
        stop();

        var $input = $('<input />').typeahead({
                source: [{ id: 1, name: 'aa' }, { id: 2, name: 'ab' }, { id: 3, name: 'ac'}]
            }),
            typeahead = $input.data('typeahead');

        $input.val('a');
        typeahead.lookup();

        ok(typeahead.$menu.is(":visible"), 'typeahead is visible');
        equal(typeahead.$menu.find('li').length, 3, 'has 3 items in menu');
        equal(typeahead.$menu.find('.active').length, 1, 'one item is active');

        $input.blur();

        setTimeout(function () {
            ok(!typeahead.$menu.is(":visible"), "typeahead is no longer visible");
            start();
        }, 200);

        typeahead.$menu.remove();
    });

    test("should set next item when down arrow is pressed", function () {
        var $input = $('<input />').typeahead({
                source: [{ id: 1, name: 'aa' }, { id: 2, name: 'ab' }, { id: 3, name: 'ac'}]
            }),
            typeahead = $input.data('typeahead');

        $input.val('a');
        typeahead.lookup();

        ok(typeahead.$menu.is(":visible"), 'typeahead is visible');
        equal(typeahead.$menu.find('li').length, 3, 'has 3 items in menu');
        equal(typeahead.$menu.find('.active').length, 1, 'one item is active');
        ok(typeahead.$menu.find('li').first().hasClass('active'), "first item is active");

        $input.trigger({
            type: 'keydown',
            keyCode: 40
        });

        ok(typeahead.$menu.find('li').first().next().hasClass('active'), "second item is active");

        $input.trigger({
            type: 'keydown',
            keyCode: 38
        });

        ok(typeahead.$menu.find('li').first().hasClass('active'), "first item is active");

        typeahead.$menu.remove();
    });


    test("should set input value to selected item", function () {
        var $input = $('<input />').typeahead({
                source: [{ id: 1, name: 'aa' }, { id: 2, name: 'ab' }, { id: 3, name: 'ac'}]
            }),
          typeahead = $input.data('typeahead'),
          changed = false;

        $input.val('a');
        typeahead.lookup();

        $input.change(function () { changed = true });

        $(typeahead.$menu.find('li')[2]).mouseover().click();

        equal($input.val(), 'ac', 'input value was correctly set');
        ok(!typeahead.$menu.is(':visible'), 'the menu was hidden');
        ok(changed, 'a change event was fired');

        typeahead.$menu.remove();
    });

    test('basic ajax url as source should work', function() {    
        var $input = $('<input />').typeahead({ ajax: '/test' }),
            typeahead = $input.data('typeahead');

        stop();  
  
        $input.val('aaa');
        typeahead.lookup();
    
        setTimeout(function() {  
            start();  

            ok(typeahead.$menu.is(":visible"), 'typeahead is visible');
            equal(typeahead.$menu.find('li').length, 1, 'has 1 items in menu');
            equal(typeahead.$menu.find('.active').length, 1, 'one item is active');
            typeahead.$menu.remove();
        }, 2000);  
    }); 

    test('ajax object as source should work', function() {    
        var $input = $('<input />').typeahead({ ajax: { url: '/test', triggerLength: 1 } }),
            typeahead = $input.data('typeahead');

        stop();  
  
        $input.val('a');
        typeahead.lookup();
    
        setTimeout(function() {  
            start();  
            ok(typeahead.$menu.is(":visible"), 'typeahead is visible');
            equal(typeahead.$menu.find('li').length, 4, 'has 4 items in menu');
            equal(typeahead.$menu.find('.active').length, 1, 'one item is active');
            typeahead.$menu.remove();
        }, 2000);  
    }); 
});