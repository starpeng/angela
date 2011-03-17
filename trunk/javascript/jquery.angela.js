;
(function($)
{

    var types = ['DOMMouseScroll', 'mousewheel'];
    $.event.special.mousewheel = {
        setup: function()
        {
            if ( this.addEventListener )
                for ( var i=types.length; i; )
                    this.addEventListener( types[--i], mousewheelHandler, false );
            else
                this.onmousewheel = mousewheelHandler;
        },
        teardown: function()
        {
            if ( this.removeEventListener )
                for ( var i=types.length; i; )
                    this.removeEventListener( types[--i], mousewheelHandler, false );
            else
                this.onmousewheel = null;
        }
    };

    $.event.special.input = {
        setup: function()
        {
            if ( this.addEventListener )
                this.addEventListener( "input", inputHandler, false );
            else
                this.onpropertychange = inputHandler;
        },
        teardown: function()
        {
            if ( this.removeEventListener )
                this.removeEventListener( "input", inputHandler, false );
            else
                this.onpropertychange = null;
        }
    };

    $.fn.extend({
        mousewheel: function(fn)
        {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },
        unmousewheel: function(fn)
        {
            return this.unbind("mousewheel", fn);
        },
        input: function(fn)
        {
            return fn ? this.bind("input", fn) : this.trigger("input");
        },
        unInput: function(fn)
        {
            return this.unbind("input", fn);
        }
    });

    function inputHandler(event)
    {
        var args = [].slice.call( arguments, 1 );
        event = $.event.fix(event || window.event);
        event.type = "input";
        args.unshift(event);
        return $.event.handle.apply(this, args);
    }

    function mousewheelHandler(event)
    {
        var args = [].slice.call( arguments, 1 ), delta = 0;

        event = $.event.fix(event || window.event);
        event.type = "mousewheel";

        if ( event.wheelDelta )
            delta = event.wheelDelta/120;
        if ( event.detail     )
            delta = -event.detail/3;

        // Add events and delta to the front of the arguments
        args.unshift(event, delta);

        return $.event.handle.apply(this, args);
    }

})(jQuery);
// JavaScript Document
;
(function($)
{
    
    function RandomString(legalCharList)
    {
        var defaultLegalChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        if(legalCharList === undefined)
        {
            this._legalCharList = defaultLegalChar.split("");
        }
        else
        {
            this._legalCharList = legalCharList.split("");
        }
    }

    RandomString.prototype = {
        
        getRandomStr : function(length)
        {
            if(length === undefined)
            {
                length = 10;
            }
            var str = "";
            for(var i = 0; i < length; i++)
            {
                str += this._getRandomChar();
            }
            return str;
        },
        _getRandomChar : function()
        {
            var index = Math.floor(Math.random() * this._legalCharList.length);
            return this._legalCharList[index];
        }
    };

    $.angela = $.angela || {};
    $.extend( $.angela, {
        version : "0.6.3",
        defaultGradientBG : {
            "10" : "ui10GrayGradientBG",
            "20" : "ui20GrayGradientBG",
            "30" : "ui30GrayGradientBG",
            "40" : "ui40GrayGradientBG"
        },
        hoverGradientBG : {
            "10" : "ui10RoyalBlueGradientBG",
            "20" : "ui20RoyalBlueGradientBG",
            "30" : "ui30RoyalBlueGradientBG",
            "40" : "ui40RoyalBlueGradientBG"
        },
        selectedGradientBG : {
            "10" : "ui10BlueGradientBG",
            "20" : "ui20BlueGradientBG",
            "30" : "ui30BlueGradientBG",
            "40" : "ui40BlueGradientBG"
        },
        cssShow : { 
            position: "absolute", 
            visibility: "hidden",
            display: "block"
        },
        widgetOptionsDictionary : {},
        randomKey : new RandomString(),
        
        getWidgetOptions : function(key)
        {
            if(this.widgetOptionsDictionary[key] !== undefined)
            {
                return this.widgetOptionsDictionary[key];
            }
            return null;
        },
        
        addWidgetOptions : function(key, value)
        {
            this.widgetOptionsDictionary[key] =  value;
            return value;
        },
        
        removeWidgetOptions : function(key)
        {
            if(this.widgetOptionsDictionary[key] !== undefined)
            {
                var setting = this.widgetOptionsDictionary[key];
                this.widgetOptionsDictionary[key] = null;
                delete this.widgetOptionsDictionary[key];
                return setting;
            }
        },
        
        getRandomKey : function()
        {
            return  this.randomKey.getRandomStr();
        }
    });
})(jQuery);


;
(function($)
{
    $.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor',	 'borderRightColor', 'borderTopColor', 'borderColor', 'color', 'outlineColor'], function(i, attr)
    {
        $.fx.step[attr] = function(fx)
        {
            if (!fx.colorInit)
            {
                fx.start = getColor(fx.elem, attr);
                fx.end = getRGB(fx.end);
                fx.colorInit = true;
            }

            fx.elem.style[attr] = 'rgb(' +
            Math.max(Math.min(parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0], 10), 255), 0) + ',' +
            Math.max(Math.min(parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1], 10), 255), 0) + ',' +
            Math.max(Math.min(parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2], 10), 255), 0) + ')';
        };
    });
    function getRGB(color)
    {
        var result;

        // Check if we're already dealing with an array of colors
        if ( color && color.constructor == Array && color.length == 3 )
            return color;

        // Look for rgb(num,num,num)
        if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
            return [parseInt(result[1],10), parseInt(result[2],10), parseInt(result[3],10)];

        // Look for rgb(num%,num%,num%)
        if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
            return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

        // Look for #a0b1c2
        if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
            return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

        // Look for #fff
        if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
            return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

        // Look for rgba(0, 0, 0, 0) == transparent in Safari 3
        if (result = /rgba\(0, 0, 0, 0\)/.exec(color))
            return colors['transparent'];

        // Otherwise, we're most likely dealing with a named color
        return colors[$.trim(color).toLowerCase()];
    }

    function getColor(elem, attr)
    {
        var color;

        do
        {
            color = $.curCSS(elem, attr);

            // Keep going until we find an element that has color, or we hit the body
            if ( color != '' && color != 'transparent' || $.nodeName(elem, "body") )
                break;

            attr = "backgroundColor";
        } while ( elem = elem.parentNode );

        return getRGB(color);
    }
    

    $.extend($.fx.step,{
        backgroundPosition: function(fx)
        {
            if (fx.state === 0 && typeof fx.end == 'string')
            {
                if($.browser.msie)
                {
                    var start = $.curCSS(fx.elem,'backgroundPositionX') + " " + $.curCSS(fx.elem,'backgroundPositionY');
                }
                else
                {                
                    var start = $.curCSS(fx.elem,'backgroundPosition');
                }
                start = toArray(start);
                fx.start = [start[0],start[2]];
                var end = toArray(fx.end);
                fx.end = [end[0],end[2]];
                fx.unit = [end[1],end[3]];
            }
            var nowPosX = [];
            nowPosX[0] = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit[0];
            nowPosX[1] = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit[1];
            fx.elem.style.backgroundPosition = nowPosX[0]+' '+nowPosX[1];

            function toArray(strg)
            {
                strg = strg.replace(/left|top/g,'0px');
                strg = strg.replace(/right|bottom/g,'100%');
                strg = strg.replace(/([0-9\.]+)(\s|\)|$)/g,"$1px$2");
                var res = strg.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
                return [parseFloat(res[1],10),res[2],parseFloat(res[3],10),res[4]];
            }

        }
    });
    
    
    $.extend($.fn, {
        popShow : function(speed, easing, callback)
        {
            var self = this;
            if(self.is(":hidden"))
            {
                popFunc.call(this, "show", speed, easing, callback);
            }
            return self;
        },
        popHide : function(speed, easing, callback)
        {
            var self = this;
            if(self.is(":hidden"))
            {
                return self;
            }
            popFunc.call(this, "hide", speed, easing, callback);
            return self;
        },
        popToggle : function(speed, easing, callback)
        {
            var self = this;
            if(self.is(":hidden"))
            {
                popFunc.call(this, "show", speed, easing, callback);
            }
            else
            {
                popFunc.call(this, "hide", speed, easing, callback);
            }
            return self;
        }
    });
    

    function popFunc(func, speed, easing, callback)
    {
        var self = this;
        var fxAttrs = [ "height", "width", "marginLeft", "marginRight", "marginTop", "marginBottom", "opacity"];
        var orig = {}, props = {};
        $.each(fxAttrs, function(i, key)
        {
            orig[key] = $.style(self[0], key);
            props[key] = parseInt(self.css(key));
        });
        var oldProps = $.extend({}, props);

        props["marginLeft"] += (props["width"] / 2);
        props["marginRight"] += (props["width"] / 2);
        props["marginTop"] += (props["height"] / 2);
        props["marginBottom"] += (props["height"] / 2);
        props["opacity"] = props["width"] = props["height"] = 0;
        if(func == "show")
        {
            self.css(props).show();
            props = oldProps;
        }
        var complete = callback || !callback && easing || jQuery.isFunction( speed ) && speed;
        var easingFunc = callback && easing || easing && !jQuery.isFunction(easing) && easing || "linear";
        var speedValue = jQuery.isFunction( speed ) && 600 || speed || 600;
        self.animate( props, speedValue, easingFunc, function()
        {
            var tmpObj = this;
            if(func != "show")
            {
                $(tmpObj).hide();
            }
            $.each(fxAttrs, function(i, key)
            {
                jQuery.style(tmpObj, key, orig[key]);
            });
            if($.isFunction(complete))
            {
                complete.call(this);
            }
        });
    }
})(jQuery);// JavaScript Document
;
(function($)
{
    $.angela.widget = $.angela.widget || {};
    var $$ = $.extend($.angela.widget, {
        
        initWidget : function()
        {
            var self = this, args = Array.prototype.slice.call(arguments), widgetSetting = args.pop(), options, opts, key;
            
            if(typeof args[0] == "string")
            {
                key = self.attr("widget"), widgetOptions = $$.widgetOptions(key);
                if(widgetOptions != null)
                {
                    if(self.length != 0)
                    {
                        self = $(self[0]);
                    }
                    self.opts = widgetOptions;
                    return $$.funcHandle.apply(self, args);
                }
            }
            
            else
            {
                if(self.attr("widget") !== undefined)
                {
                    return self;
                }
                if(args.length == 0)
                {
                    options = {};
                }
                else
                {
                    options = args[0];
                }
                self.each(function()
                {
                    var obj = $(this);                    
                    opts =  $.extend({}, widgetSetting.defaults, options);
                    opts.clone = obj.clone();
                    obj.opts = opts;
                    opts.widgetKey = $.angela.getRandomKey();
                    obj.attr("widget",opts.widgetKey);
                    $$.widgetOptions(opts.widgetKey, opts);
                    var visibilityValue = $.style(obj[0], "visibility");
                    obj.css("visibility", "hidden");
                    widgetSetting.init.call(obj, opts);
                    $.style(obj[0], "visibility", visibilityValue);
                    
                });
            }
            return self;
        },
        
        option : function()
        {
            var self = this, opts = self.opts;
            if(opts[arguments[0]] === undefined)
            {
                return null;
            }
            if(arguments.length == 1)
            {
                return opts[arguments[0]];
            }
            else if(arguments.length > 1)
            {
                if(isNaN(arguments[1]))
                {
                    opts[arguments[0]] = arguments[1];
                }
                else
                {
                    opts[arguments[0]] = parseInt(arguments[1]);
                }
            }
            return self;
        },
        
        funcHandle : function()
        {
            var self = this, result = null, widget = $$.widget.call(self), param;
            if(!$.isFunction($.angela[widget][arguments[0]]))
            {
                return result;
            }
            param = Array.prototype.slice.call(arguments,1);
            result = $.angela[widget][arguments[0]].apply(self, param);
            return result;
        },
        
        widget : function()
        {
            var self = this;
            if(self.hasClass("uiDialog"))
            {
                return "dialog";
            }
            else if(self.hasClass("uiTabs"))
            {
                return "tabs";
            }
            else if(self.hasClass("uiSlide"))
            {
                return "slide";
            }
            else if(self.hasClass("uiAccordion"))
            {
                return "accordion";
            }
            else if(self.hasClass("uiButtonSet"))
            {
                return "buttonSet";
            }
            else if(self.hasClass("uiDorpDownList"))
            {
                return "dropDownList";
            }
            else if(self.hasClass("uiProgressBar"))
            {
                return "progressBar";
            }
            else if(self.hasClass("uiTip"))
            {
                return "tip";
            }
            else if(self.hasClass("uiList"))
            {
                return "list";
            }
            else if(self.hasClass("uiDatePicker"))
            {
                return "datePicker";
            }
            else
            {
                return "dialog";
            }
        },
        
        widgetOptions : function()
        {
            if(arguments.length == 2)
            {
                return $.angela.addWidgetOptions(arguments[0], arguments[1]);
            }
            else if(arguments.length == 1)
            {
                return $.angela.getWidgetOptions(arguments[0]);
            }
            return null;
        },
        
        removeWidgetOptions : function(key)
        {
            if( key !== undefined)
            {
                return $.angela.removeWidgetOptions(key);
            }
            return null;
        },
        
        destroy : function(revert)
        {
            var self = this, opts = self.opts, widgetKey;
            if(!self.hasClass("uiWidget"))
            {
                self = opts.targetWidget;
            }
            if(self.hasClass("uiDraggalbe") || self.find(".uiDraggalbe").length != 0)
            {
                self.draggable("destroy");
            }
            if(self.find(".uiResizable").length != 0)
            {
                self.resizable("destroy");
            }
            $$.funcHandle.call(self, "beforeDestroy");
            self.removeClass("uiWidget").find(".uiWidget").each( function()
            {
                $$.removeWidgetOptions($(this).removeClass("uiWidget").attr("widget"));
            });
            widgetKey = self.attr("widget");
            $$.removeWidgetOptions(widgetKey);
            if(revert)
            {
                opts.clone.insertAfter(self);
            }
            opts.clone = null;
            opts = null;
            return self.remove();
        },
        
        disable : function()
        {
            var self = this, opts = self.opts;
            opts.disabled = true;
            return self.addClass("uiWidgetDisalbed");
        },
        
        enable : function()
        {
            var self = this, opts = self.opts;
            opts.disabled = false;
            return self.removeClass("uiWidgetDisalbed");
        }
    });
})(jQuery);

// JavaScript Document
;
(function($)
{
    $.angela.position = $.angela.position || {};
    var defaults = {
        position : "center",
        oldPos : null,
        returnOldPos : false
    };
    
    $.fn.moveToPos = function(options)
    {
        var self = this, opts = options || {};
        opts =  $.extend({}, defaults, options);
        return $$.moveToPos.call(self, opts);
    };
    var $$ = $.extend($.angela.position, {
        
        moveToPos : function(opts)
        {
            var self = this;
            var oldPos = {position : null, left : null, top : null, right : null, bottom : null};
            var returnValue;
            self.css("margin", 0);
            if(opts.returnOldPos)
            {
                $.each(oldPos, function(key)
                {
                    oldPos[key] = self.css(key);
                });
                returnValue = oldPos;
            }
            else
            {
                returnValue = self;
            }
            if(typeof opts.position == "string")
            {
                $$.setPosByStr.call(self, opts);
            }
            else if($.isArray(opts.position))
            {
                $$.setPosByArray.call(self, opts);
            }
            return returnValue;
        },
        
        setPosByStr : function(opts)
        {
            var self = this;
            var windowObj = $(window);
            var parentObj = self.parent();
            if(parentObj.attr("tagName").toUpperCase() == "BODY")
            {
                parentObj = windowObj;
            }
            var windowWidth = windowObj.width(), windowHeight = windowObj.height();
            var parentWidth = parentObj.width(), parentHeight = parentObj.height();
            var targetWidth = self.outerWidth(), targetHeight = self.outerHeight();
            var posSetting = {position: "absolute", left : null, top : null, right : null, bottom : null};
            var parentOffset = self.parent().offset();
            if(self.css("position") == "fixed")
            {
                posSetting.position = "fixed";
            }
            switch(opts.position)
            {
                case "center":
                    parentWidth = Math.max(Math.min(parentWidth, windowWidth), targetWidth);
                    parentHeight = Math.max(Math.min(parentHeight, windowHeight), targetHeight);
                    posSetting["left"] = parentOffset.left + (parentWidth - targetWidth) / 2;
                    posSetting["top"] = parentOffset.top + (parentHeight - targetHeight) / 2 + $(document).scrollTop();
                    break;
                case "leftBottom":
                    posSetting["left"] = posSetting["bottom"] = 0;
                    break;
                case "leftTop":
                    posSetting["left"] = posSetting["top"] = 0;
                    break;
                case "rightTop":
                    posSetting["right"] = posSetting["top"] = 0;
                    break;
                case "rightBottom":
                    posSetting["right"] = posSetting["bottom"] = 0;
                    break;
                default:
                    posSetting[opts.position] = 0;
                    break;
            }
            self.css(posSetting);
            return self;
        },
        
        setPosByArray : function(opts)
        {
            var self = this;
            var posSetting = {position: "absolute", left : opts.position[0], top : opts.position[1], right : null, bottom : null};
            if(self.css("position") == "fixed")
            {
                posSetting.position = "fixed";
            }
            self.css(posSetting);
            return self;
        }
    });
})(jQuery);

// JavaScript Document
;
(function($)
{
    $.angela.interaction = $.angela.interaction || {};
    var $$ = $.extend($.angela.interaction,  {
        
        initInteraction : function(options)
        {
            var self = this;
            var opts = options;
            if(opts.type == "resize")
            {
                var obj = self.find(".uiResizable");
                if(obj.length == 0)
                {
                    if(self.css("position") == "static")
                    {
                        self.css("position", "relative");
                    }
                    obj = $('<div class="uiResizable"></div>').appendTo(self);
                }
                obj.mousedown( function(e)
                {
                    $$.setInteractionMask(self, opts, e);
                });
            }
            else
            if(opts.type == "drag")
            {
                var obj = self.find(".uiDraggalbe");
                if(obj.length == 0)
                {
                    obj = self.addClass("uiDraggalbe");
                }
                obj.mousedown( function(e)
                {
                    $$.setInteractionMask(self, opts, e);
                });
            }
            var mouseMoveEvent = "mousemove." + opts.widget;
            var mouseUpEvent = "mouseup." + opts.widget;

            $(document).bind(mouseMoveEvent, function(e)
            {
                if(opts.start)
                {
                    opts.doing = true;
                    var offsetX = e.clientX - opts.clientX, offsetY = e.clientY - opts.clientY;
                    if(Math.abs(offsetX) < opts.step && Math.abs(offsetY) < opts.step)
                    {
                        return false;
                    }
                    var maskItem = opts.mask.show();
                    if(opts.type == "resize")
                    {
                        var newWidth = maskItem.width() + offsetX;
                        var newHeight = maskItem.height() + offsetY;
                        if(opts.maxWidth != null)
                        {
                            newWidth = Math.min(newWidth, opts.maxWidth);
                        }
                        else
                        if(opts.minWidth != null)
                        {
                            newWidth = Math.max(newWidth, opts.minWidth);
                        }
                        opts.clientX = e.clientX;

                        if(opts.maxHeight != null)
                        {
                            newHeight = Math.min(newHeight, opts.maxHeight);
                        }
                        else
                        if(opts.minHeight != null)
                        {
                            newHeight = Math.max(newHeight, opts.minHeight);
                        }
                        opts.clientY = e.clientY;
                        if($.isFunction(opts.event.doing))
                        {
                            if(opts.event.doing.call(self, newWidth, newHeight) == false)
                            {
                                return ;
                            }
                        }
                        maskItem.width(newWidth).height(newHeight);
                    }
                    else
                    if(opts.type = "drag")
                    {
                        opts.clientX = e.clientX;
                        opts.clientY = e.clientY;
                        var originOffset = maskItem.offset();
                        if($.isFunction(opts.event.doing))
                        {
                            if(opts.event.doing.call(self, {left : originOffset.left + offsetX, top : originOffset.top + offsetY}) == false)
                            {
                                return ;
                            }
                        }
                        maskItem.moveToPos({position : [originOffset.left + offsetX, originOffset.top + offsetY]});
                        if(opts.dest != null)
                        {
                            if($$.checkArea(maskItem, opts.destPosition) === true)
                            {
                                if(!opts.firstCross)
                                {
                                    opts.cross.call(self, true);
                                    opts.firstCross = true;
                                }
                            }
                            else
                            {
                                if(opts.firstCross)
                                {
                                    opts.cross.call(self, false);
                                    opts.firstCross = false;
                                }
                            }
                        }
                    }
                    return false;
                }
            })
            .bind(mouseUpEvent, function()
            {
                if(opts.mask === null)
                {
                    return ;
                }
                var maskItem = opts.mask;
                if(opts.doing)
                {
                    maskItem.show();
                    if($.isFunction(opts.event.stop))
                    {
                        if(opts.type == "resize")
                        {
                            opts.event.stop.call(self, maskItem.width(), maskItem.height());
                        }
                        else
                        if(opts.type == "drag")
                        {
                            var originOffset = maskItem.offset();
                            opts.event.stop.call(self, originOffset);
                        }
                    }
                }
                opts.start = false;
                opts.doing = false;
                maskItem.remove();
                opts.mask = null;
            });
            return self;
        },
        
        setInteractionMask : function(self, opts, e)
        {
            if(opts.disable)
            {
                return ;
            }
            if($.isFunction(opts.event.start))
            {
                if(opts.event.start.call(self) === false)
                {
                    return false;
                }
            }
            if($(e.target).hasClass("uiUserBtn"))
            {
                return true;
            }
            opts.start = true;
            opts.clientX = e.clientX;
            opts.clientY = e.clientY;
            var maskHeight = self.outerHeight(), maskWidth = self.outerWidth(), maskPosition = self.offset();
            opts.mask = $(opts.HTML).width(maskWidth).height(maskHeight).css({left : maskPosition.left, top : maskPosition.top}).hide().addClass("uiBlackBigBorder uiCornerAll").appendTo("body");
            if(opts.type == "drag" && opts.dest != null)
            {
                var dest = $(opts.dest);
                var pos = dest.offset();
                var destWidth = dest.width();
                var destHeight = dest.height();
                opts.destPosition = { leftTop : [pos.left, pos.top], rightBottom : [pos.left + destWidth, pos.top + destHeight]};
            }
            return self;
        },
        checkArea : function(obj, destPosition)
        {
            var left = obj.offset().left;
            var top = obj.offset().top;
            var right = left + obj.outerWidth();
            var bottom = top + obj.outerHeight();
            if((left > destPosition.rightBottom[0] | right < destPosition.leftTop[0]) | (bottom < destPosition.leftTop[1] | top > destPosition.rightBottom[1]))
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    });
})(jQuery);
;
(function($)
{
    $.angela.draggable = $.angela.draggable || {};
    var defaults = {
        dest : null,
        disable : false,
        
        start : false,
        clientX : 0,
        clientY : 0,
        doing : false,
        step : 2,
        type : "drag",
        mask : null,
        destPosition : null,
        HTML : '<div class="uiInteractionMask uiInactive uiCornerAll uiBlackBigBorder"></div>',
        firstCross : false,
        widget : null,
        
        event : {start : null, doing : null, stop : null},
        cross : null
    };
    $.fn.draggable = function(options)
    {
        var self = this;
        //if(typeof options == "string")
        if(options == "destroy")
        {
            var key = self.attr("widget");
            $(document).unbind("." + key);
            self.removeAttr("widget").find(".uiDraggalbe").unbind("mousedown");
            return self;
        }
        self.each( function()
        {
            var widgetKey = $(this).attr("widget");
            if(!widgetKey)
            {
                widgetKey = $.angela.getRandomKey();
                $(this).attr("widget", widgetKey);
            }
            var opts =  $.extend({}, defaults, options);
            opts.widget = widgetKey;
            $.angela.interaction.initInteraction.call($(this), opts);
        });
        return self;
    };
})(jQuery);
;
(function($)
{
    $.angela.resizable = $.angela.resizable || {};
    var defaults = {
        minWidth : null,
        minHeight : null,
        maxWidth : null,
        maxHeight : null,

        
        start : false,
        clientX : 0,
        clientY : 0,
        doing : false,
        step : 2,
        type : "resize",
        mask : null,
        disable : false,
        HTML : '<div class="uiInteractionMask uiInactive uiCornerAll uiBlackBigBorder"></div>',
        
        event : {start : null, doing : null, stop : null}
    };
    $.fn.resizable = function(options)
    {
        var self = this;
        //if(typeof options == "string")
        if(options == "destroy")
        {
            var key = self.attr("widget");
            $(document).unbind("." + key);
            self.removeAttr("widget").find(".uiResizable").unbind("mousedown").remove();
            return self;
        }
        self.each( function()
        {
            var widgetKey = $(this).attr("widget");
            if(!widgetKey)
            {
                widgetKey = $.angela.getRandomKey();
                $(this).attr("widget", widgetKey);
            }
            var opts =  $.extend({}, defaults, options);
            opts.widget = widgetKey;
            $.angela.interaction.initInteraction.call($(this), opts);
        });
        return self;
    };
})(jQuery);

// JavaScript Document
;
(function($)
{
    $.angela.buttonSet = $.angela.buttonSet || {};
    $.angela.buttonSet.defaults = {
        
        btnSetClass: "uiCornerAll uiGrayBoxShadow",
        btnClass : $.angela.defaultGradientBG["40"],
        btnSetBorderClass : "uiGrayBorder",
        btnHoverClass : "ui40LightBlueGradientBG",
        btnSelectedClass : $.angela.selectedGradientBG["40"],
        btnPressClass : "ui40CadetBlueGradientBG",
        btnWidth : null,
        btnMargin : null,
        
        iconArray : null,
        iconFloatArray : null,
        disabled : false,
        defaultSelectedItem : null,
        
        vertical : false,
        
        
        widgetKey : null,
        statusClass : null,
        imgIconHTML : '<div class="uiIcon"></div>',
        
        
        click : null
    };

    
    $.fn.buttonSet = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.buttonSet.defaults, init : $$.init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.extend($.angela.buttonSet, $.angela.widget, {
        
        init : function(opts)
        {
            var self = this;
            
            //self.addClass("uiButtonSet uiWidget uiNoSelectText " + opts.btnSetClass + " " + opts.btnSetBorderClass).children().each(function(n)
            opts.btnSelectedClass += " uiActive";
            opts.statusClass = {};
            self.addClass("uiButtonSet uiWidget uiNoSelectText").children().each( function(n)
            {
                var obj = $(this), btnClass;
                if(opts.btnMargin)
                {
                    btnClass = "uiButton uiCornerAll " + opts.btnClass + " " + opts.btnSetBorderClass;
                }
                else
                {
                    btnClass = "uiButton " + opts.btnClass;
                }
                
                if(obj.hasClass("uiImgRadio") || obj.hasClass("uiImgCheckBox"))
                {
                    obj.prepend(opts.imgIconHTML);
                }
                if(n != 0)
                {
                    if(opts.btnMargin)
                    {
                        if(opts.vertical)
                        {
                            obj.css("margin-top", opts.btnMargin);
                        }
                        else
                        {
                            obj.css("margin-left", opts.btnMargin);
                        }
                    }
                    else
                    {
                        if(opts.vertical)
                        {
                            btnClass += (" uiBorderTop " + opts.btnSetBorderClass);
                        }
                        else
                        {
                            btnClass += (" uiBorderLeft " + opts.btnSetBorderClass);
                        }
                    }
                }
                obj.addClass(btnClass);
                if($.isArray(opts.iconArray))
                {
                    var index = n;
                    var floatClass = "";
                    if(index >= opts.iconArray.length)
                    {
                        index =  opts.iconArray.length - 1;
                    }
                    if($.isArray(opts.iconFloatArray))
                    {
                        if(n >= opts.iconFloatArray.length)
                        {
                            floatClass = opts.iconFloatArray[opts.iconFloatArray.length - 1];
                        }
                        else
                        {
                            floatClass = opts.iconFloatArray[n];
                        }
                        if(floatClass == "right")
                        {
                            floatClass = "uiIconFloatRight";
                        }
                    }
                    obj.prepend('<span class="uiIcon ' + opts.iconArray[index] +  " " + floatClass + '"></span>');
                }
                if(opts.btnWidth)
                {
                    obj.width(opts.btnWidth);
                }
            });
            if(opts.btnMargin == null)
            {
                self.addClass(opts.btnSetClass + " " + opts.btnSetBorderClass);
            }
            if(opts.vertical)
            {
                self.width(self.children().outerWidth(true));
            }
            
            $$.initEvent.call(self);
            if(opts.disabled)
            {
                $$.disable.call(self);
            }
            if(opts.defaultSelectedItem != null)
            {
                $$.changeButtonStatus.call(self.children().eq(opts.defaultSelectedItem), opts);
            }
            return self;
        },
        
        initEvent : function()
        {
            var self = this, opts = self.opts, mouseDownFlag = false;
            self.children(".uiButton, .uiImgButton").bind("mouseenter.uiButtonSet mouseleave.uiButtonSet mousedown.uiButtonSet mouseup.uiButtonSet click.uiButtonSet", function(e)
            {
                if(opts.disabled)
                {
                    return false;
                }
                if(e.type === "click")
                {
                    if($.isFunction(opts.click))
                    {
                        if(opts.click.call(this, e) === false)
                        {
                            return false;
                        }
                    }
                    $$.changeButtonStatus.call(this, opts);
                    return ;
                }
                var classValue;
                var funcValue ;
                switch(e.type)
                {
                    case "mouseenter":
                        classValue = opts.btnHoverClass;
                        funcValue = "setStatusClass";
                        break;
                    case "mouseleave":
                        classValue = opts.btnHoverClass;
                        funcValue = "removeStatusClass";
                        break;
                    case "mousedown":
                        classValue = opts.btnPressClass;
                        funcValue = "setStatusClass";
                        break;
                    case "mouseup":
                        classValue = opts.btnPressClass;
                        funcValue = "removeStatusClass";
                        break;
                }
                $$[funcValue].call(this, opts, classValue);
            });
            return self;
        },
        changeButtonStatus : function(opts)
        {
            var obj = $(this), group;
            if(obj.hasClass("uiRadio") || obj.hasClass("uiImgRadio"))
            {
                group = obj.attr("group");
                var siblingsObj = obj.siblings('[group="' +group + '"]');
                obj.removeClass(opts.btnHoverClass + " " + opts.btnClass).addClass(opts.btnSelectedClass);
                siblingsObj.removeClass(opts.btnSelectedClass).addClass(opts.btnClass);
                if(obj.hasClass("uiImgRadio"))
                {
                    obj.addClass("uiImgRadioChecked");
                    siblingsObj.removeClass("uiImgRadioChecked");
                }
            }
            else if(obj.hasClass("uiCheckBox") || obj.hasClass("uiImgCheckBox"))
            {
                if(opts.statusClass[opts.btnHoverClass] == null)
                {
                    obj.toggleClass(opts.btnSelectedClass).toggleClass(opts.btnClass);
                }
                else if(opts.statusClass[opts.btnHoverClass] != opts.btnSelectedClass)
                {
                    obj.removeClass(opts.btnHoverClass).addClass(opts.btnSelectedClass);
                }
                else
                {
                    obj.removeClass(opts.btnHoverClass).addClass(opts.btnClass);
                }
                if(obj.hasClass("uiImgCheckBox"))
                {
                    obj.toggleClass("uiImgCheckBoxChecked");
                }
            }
            else
            {
                obj.removeClass(opts.btnHoverClass).addClass(opts.btnClass);
            }
            $.each(opts.statusClass, function(key, value)
            {
                opts.statusClass[key] = null;
            });
        },
        setOriginClass : function(opts, statusClass)
        {
            var obj = $(this);
            $.each([opts.btnClass, opts.btnSelectedClass, opts.btnHoverClass, opts.btnPressClass], function(n, value)
            {
                if(obj.hasClass(value))
                {
                    opts.statusClass[statusClass] = value;
                }
                obj.removeClass(value);
            });
        },
        getOriginClass : function(opts, statusClass)
        {
            if(opts.statusClass[statusClass] == null)
            {
                return ;
            }
            var obj = $(this);
            $.each([opts.btnClass, opts.btnSelectedClass, opts.btnHoverClass, opts.btnPressClass], function(n, value)
            {
                obj.removeClass(value);
            });
            obj.addClass(opts.statusClass[statusClass]);
        },
        setStatusClass : function(opts, statusClass)
        {
            $$.setOriginClass.call(this, opts, statusClass);
            $(this).addClass(statusClass);
        },
        removeStatusClass : function(opts, statusClass)
        {
            $$.getOriginClass.call(this, opts, statusClass);
        },     
        clickButton : function(index)
        {
            var self = this, opts = self.opts;
            if(index === undefined)
            {
                return $();
            }
            var obj = self.children().eq(index).trigger("click.uiButtonSet");
            return self;
        },
        button : function(index)
        {
            var self = this, opts = self.opts;
            if(index === undefined)
            {
                return $();
            }
            return self.children().eq(index);
        },
        buttonText : function(index, text)
        {
            var self = this, opts = self.opts;
            if(index === undefined)
            {
                return $();
            }
            var obj = self.children().eq(index);
            if(typeof text == "undefined")
            {
                return obj.text();
            }
            obj.html(obj.html().replace(obj.text(), text));
            return self;
        },
        buttonIcon : function(index, icon)
        {
            var self = this, opts = self.opts;
            if(index === undefined || !$.isArray(opts.iconArray))
            {
                return $();
            }
            var obj = self.children().eq(index);
            var arrayIndex = opts.iconArray.length - 1;            
            var iconClass;
            if(index > arrayIndex)
            {
                index = arrayIndex;
            }
            iconClass = opts.iconArray[index];
            if(typeof icon == "undefined")
            {
                return iconClass;
            }
            obj.children("span").removeClass(iconClass).addClass(icon);
            opts.iconArray[index] = icon;
            return self;
        },
        val : function(index, checked)
        {
            var self = this, opts = self.opts;
            if(index === undefined)
            {
                return ;
            }
            var obj = self.children().eq(index);
            var hasStatus = false;
            $.each("uiCheckBox uiRadio uiImgRadio uiImgCheckBox".split(" "), function(n, value)
            {
               if(obj.hasClass(value))
               {
                   hasStatus = true;
                   return false;
               } 
            });
            if(!hasStatus)
            {
                return ;
            }
            if(checked === undefined)
            {
                if(obj.hasClass(opts.btnSelectedClass))
                {
                    return true;
                }
                return false;
            }
            if(checked)
            {
                if(!obj.hasClass(opts.btnSelectedClass))
                {
                    obj.trigger("click.uiButtonSet");
                }
            }
            else
            {
                if(obj.hasClass(opts.btnSelectedClass))
                {
                    obj.removeClass(opts.btnSelectedClass).addClass(opts.btnClass);
                }                
            }
            return self;
        },
        removeButton : function(index)
        {
            var self = this, opts = self.opts;
            if(index === undefined)
            {
                return self;
            }
            return self.children(".uiButton").eq(index).remove();
        }
    });
})(jQuery);

// JavaScript Document
;
(function($)
{
    $.angela.tabs = $.angela.tabs || {};
    $.angela.tabs.defaults = {
        
        tabsClass : "uiBlueBigBorder uiCornerAll uiBlueBoxShadow",
        titleBarClass : $.angela.selectedGradientBG["40"],
        tabsItemWidth : null,
        tabsItemMargin : null,
        disabled : false,
        closableArray : "all",
        activateIndex : 0,
        tabsItemHoverClass : "ui30LightBlueGradientBG",

        
        widgetKey : null,
        tabsItemTotal : 0,
        tabsItemOuterWidth : 0,
        tabsItemViewTotal : 0,
        tabsItemViewIndex : 0,
        titleBarHTML : '<div class="uiTitleBar uiTabsList uiNoSelectText"><div class="uiListContent"><div></div></div></div>',
        tabsItemClass : '<div class="uiTabsItem uiCornerTop"></div>',
        contentHTML : '<div class="uiContent"></div>',
        controlHTML : '<div class="uiLeftArrow"></div><div class="uiRightArrow"></div>',
        closeHTML : '<div class="uiCloseItemBtn"></div>',
        itemContent : '<div class="uiHidden"><p></p></div>',

        
        change : null,
        close : null,
        leftClick : null,
        rightClick : null
    };

    
    $.fn.tabs = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.tabs.defaults, init : $$.init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.extend($.angela.tabs, $.angela.widget, {
        init : function(opts)
        {
            var self = this;
            
            var titleBarObj = $(opts.titleBarHTML).addClass(opts.titleBarClass).append(opts.controlHTML);
            self.addClass("uiTabs uiWidget " + opts.tabsClass).children().each( function(n)
            {
                var closeHTML = "";
                if(opts.closableArray == "all" || ($.isArray(opts.closableArray) && $.inArray(n, opts.closableArray) != -1))
                {
                    closeHTML = opts.closeHTML;
                }
                $(opts.tabsItemClass).html($(this).addClass("uiTabsContent uiHidden").attr("title") + closeHTML).appendTo(titleBarObj.find("> .uiListContent > div"));
                opts.tabsItemTotal++;
            });
            self.prepend(titleBarObj);
            var tabsItemList = $("> .uiTabsList > .uiListContent > div > .uiTabsItem", self);
            if(opts.tabsItemWidth != null)
            {
                tabsItemList.width(opts.tabsItemWidth);
            }
            if(opts.tabsItemMargin != null)
            {
                tabsItemList.css("margin-left", opts.tabsItemMargin);
            }
            opts.tabsItemOuterWidth = tabsItemList.outerWidth(true);
            opts.tabsItemViewTotal =  Math.floor($("> .uiTabsList", self).width() / opts.tabsItemOuterWidth);
            if(opts.tabsItemTotal > opts.tabsItemViewTotal)
            {
                $("> .uiTitleBar > .uiRightArrow", self).show();
            }
            if(self.height() > titleBarObj.height())
            {
                var contentObj = self.children(".uiTabsContent");
                contentObj.height(self.height() - titleBarObj.height() - parseInt(contentObj.css("margin-top")) - parseInt(contentObj.css("margin-bottom")));
            }
            //contentObj.height(self.height() - titleBarObj.height() - 10);
            
            $$.initEvent.call(self);
            var disableValue = opts.disabled;
            opts.disabled = false;
            $("> .uiTabsList > .uiListContent > div >.uiTabsItem", self).eq(opts.activateIndex).click();
            opts.disabled = disableValue;
            if(opts.disabled)
            {
                $$.disable.call(self);
            }
            return self;
        },
        initEvent : function()
        {
            var self = this, opts = self.opts;

            $("> .uiTabsList > .uiListContent > div", self).bind("click.uiTabs", function(e)
            {
                if(opts.disabled)
                {
                    return false;
                }
                var target = $(e.target), index;
                if(target.hasClass("uiCloseItemBtn"))
                {
                    if($.isFunction(opts.close))
                    {
                        if(opts.close.call(target[0], e) === false)
                        {
                            return false;
                        }
                    }
                    var obj = target.parent(".uiTabsItem");
                    if(obj.next().length != 0)
                    {
                        obj.next().click();
                    }
                    else
                    {
                        obj.prev().click();
                    }
                    index = obj.index();
                    self.children(".uiTabsContent:eq(" + index + ")").remove();
                    obj.remove();
                    opts.tabsItemTotal--;
                    $$.checkItemViewStatus.call(self);
                    return false;
                }
                else if(target.hasClass("uiTabsItem"))
                {
                    index = target.addClass("selected").siblings(".selected").removeClass("selected").end().index();
                    var content = self.children(".uiTabsContent:eq(" + index + ")");
                    if($.isFunction(opts.change))
                    {
                        if(opts.change.call(content[0], target[0], e) === false)
                        {
                            return false;
                        }
                    }
                    content.removeClass("uiHidden").siblings(".uiTabsContent").addClass("uiHidden");
                    opts.activateIndex = index;
                    return ;
                }
            });
            $("> .uiTitleBar", self).bind("click.uiTabs", function(e)
            {
                if(opts.disabled)
                {
                    return false;
                }
                var target = $(e.target), clickFunc = "";
                if(target.hasClass("uiRightArrow"))
                {
                    clickFunc = "rightClick";
                    opts.tabsItemViewIndex++;
                }
                else if(target.hasClass("uiLeftArrow"))
                {
                    clickFunc = "leftClick";
                    opts.tabsItemViewIndex--;
                }
                if(opts.tabsItemViewIndex < 0)
                {
                    opts.tabsItemViewIndex = 0;
                    return ;
                }
                else if(opts.tabsItemTotal - opts.tabsItemViewTotal  < opts.tabsItemViewIndex)
                {
                    opts.tabsItemViewIndex = opts.tabsItemTotal - opts.tabsItemViewTotal;
                    return ;
                }
                if(clickFunc != "")
                {
                    if($.isFunction(opts[clickFunc]))
                    {
                        if(opts[clickFunc].call(target[0], e) === false)
                        {
                            return false;
                        }
                    }
                    var scrollLeftValue = opts.tabsItemOuterWidth * opts.tabsItemViewIndex;
                    target.siblings(".uiListContent").stop().animate({left : -scrollLeftValue});
                    $$.checkItemViewStatus.call(self);
                }
            });
            $("> .uiTabsList", self).bind("mousewheel.uiTabs", function(e, delta)
            {
                if(opts.disabled)
                {
                    return false;
                }
                if(delta > 0)
                {
                    $("> .uiLeftArrow", this).click();
                }
                else
                {
                    $("> .uiRightArrow", this).click();
                }
                return false;
            });
            $("> .uiTabsList > .uiListContent > div > .uiTabsItem", self).hover(function()
            {
                if(opts.disabled)
                {
                    return false;
                }
                $(this).addClass(opts.tabsItemHoverClass);
            },
            function()
            {
                if(opts.disabled)
                {
                    return false;
                }
                $(this).removeClass(opts.tabsItemHoverClass);
            });
            return self;
        },
        checkItemViewStatus : function()
        {
            var self = this, opts = self.opts;
            
            if(opts.tabsItemTotal - opts.tabsItemViewTotal  <= opts.tabsItemViewIndex)
            {
                if($.browser.opera)	//opera调用hide()的时候，会导致往前移
                {
                    $("> .uiTitleBar > .uiRightArrow", self).css("opacity", 0);
                }
                else
                {
                    $("> .uiTitleBar > .uiRightArrow", self).hide();
                }
            }
            else
            {
                if($.browser.opera)
                {
                    $("> .uiTitleBar > .uiRightArrow", self).css("opacity", 1);
                }
                else
                {
                    $("> .uiTitleBar > .uiRightArrow", self).show();
                }
            }
            if(opts.tabsItemViewIndex <= 0)
            {
                $("> .uiTitleBar > .uiLeftArrow", self).hide();
            }
            else
            {
                $("> .uiTitleBar > .uiLeftArrow", self).show();
            }
            return self;
        },
        addItem : function(title, content)
        {
            var self = this, opts = self.opts;
            $(opts.tabsItemClass).html(title + opts.closeHTML).appendTo($("> .uiTabsList > .uiListContent > div", self));
            $(opts.itemContent).addClass("uiTabsContent uiHidden").attr("title", title).children("p").html(content).end().appendTo(self);
            opts.tabsItemTotal++;
            return self;
        },
        active : function(index)
        {
            var self = this, opts = self.opts;
            if(index === undefined)
            {
                return opts.activateIndex;
            }
            $(">.uiTitleBar >.uiListContent .uiTabsItem:eq(" + index + ")", self).trigger("click.uiTabs");
            return self;
        },
        item : function(index, content, title)
        {
            var self = this, opts = self.opts;
            if(index === undefined)
            {
                return self;
            }
            var item = $(">.uiTabsContent", self).eq(index);
            var titleBar = $("> .uiTabsList > .uiListContent > div >.uiTabsItem", self).eq(index);            
            if(content === undefined)
            {
                return item;
            }
            item.html(content);
            if(title === undefined)
            {
                return item;
            }
            titleBar.html(title);
            return self;
        }
    });
})(jQuery);

// JavaScript Document
;
(function($)
{
    $.angela.slide = $.angela.slide || {};
    $.angela.slide.defaults = {
        
        mode : "horizontal",
        slideClass : $.angela.selectedGradientBG["10"] + " uiBlueBorder uiCornerAll",
        sliderClass : "uiBlackBorder uiDefaultSliderBG uiCornerAll",        
        sliderLength : 8,
        sliderTop : -5,
        sliderLeft : -5,
        noUserEvent : false,
        disabled : false,
        min : 0,
        max : 100,
        step : 0.2,
        
        
        animation : true,
        widgetKey : null,
        slideLength : 0,
        slideValue : 0,
        slideMax : 0,
        slideBegin : 0,
        panelHTML : '<div class="uiPanel"></div>',
        sliderHTML : '<div class="uiSlider"></div>',
        slideDrag : false,

        
        click : null,
        slide : null
    };

    
    $.fn.slide = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.slide.defaults, init : $$.init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.extend($.angela.slide, $.angela.widget, {
        init : function(opts)
        {
            var self = this;

            
            if(opts.mode == "vertical")
            {
                opts.slideClass = opts.slideClass.replace($.angela.selectedGradientBG["10"], "ui10BlueGradientBGVertical");
            }
            self.addClass("uiSlide uiWidget uiNoSelectText " + opts.slideClass).append($(opts.panelHTML).append($(opts.sliderHTML).addClass(opts.sliderClass)));
            var slider = $("> .uiPanel > .uiSlider", self);
            
            if(opts.mode == "vertical")
            {
                opts.slideBegin = opts.sliderTop = self.offset().top;
                slider.width(self.width() - 2 * opts.sliderLeft).css("left", opts.sliderLeft - 1).height(opts.sliderLength);
                opts.slideLength = self.height();
                opts.slideMax = opts.slideLength - opts.sliderLength - 2; 
            }
            else
            {               
                opts.slideBegin = opts.sliderLeft = self.offset().left;
                slider.height(self.height() - 2 * opts.sliderTop).css("top", opts.sliderTop - 1).width(opts.sliderLength);
                opts.slideLength = self.width();
                opts.slideMax = opts.slideLength - opts.sliderLength - 2; 
            }

            
            if(opts.noUserEvent)
            {
                return self;
            }
            $$.initEvent.call(self);
            if(opts.slideValue !== 0)
            {
                $$.setSlide.call(self, opts.slideValue);
            }
            if(opts.disabled)
            {
                $$.disable.call(self);
            }
            return self;
        },
        initEvent : function()
        {
            var self = this, opts = self.opts;
            
            $("> .uiPanel", self).bind("click.uiSlide", function(e)
            {
                if(opts.disabled || $(e.target).hasClass("uiSlider"))
                {
                    return false;
                }
                if($.isFunction(opts.click))
                {
                    if(opts.click.call(this, e) === false)
                    {
                        return false;
                    }
                }
                var beginValue;
                if(opts.mode == "vertical")
                {
                    beginValue = e.clientY + self.parent().scrollTop();
                }
                else
                {                    
                    beginValue = e.clientX + self.parent().scrollLeft();
                }
                var percent = (beginValue - opts.slideBegin - (opts.sliderLength >> 1)) / opts.slideMax;
                $$.setSlide.call(self, Math.floor(percent * (opts.max - opts.min) + opts.min), opts.animation);
            })
            .bind("mousewheel.uiSlide", function(e, delta)
            {
                if(opts.disabled)
                {
                    return false;
                }
                var positionStr = "left";
                if(opts.mode == "vertical")
                {
                    positionStr = "top";
                }
                var percent = parseInt($("> .uiSlider", this).css(positionStr)) / opts.slideMax + opts.step * (-delta/2);
                $$.setSlide.call(self, Math.floor(percent * (opts.max - opts.min) + opts.min), false);
                return false;
            });
            var mouseMoveEvent = "mousemove." + opts.widgetKey;
            var mouseUpEvent = "mouseup." + opts.widgetKey;
            $("> .uiPanel > .uiSlider", self).bind("mousedown.uiSlide", function(e)
            {
                if(opts.disabled)
                {
                    return false;
                }
                opts.slideDrag = true;
            });
            $(document).bind(mouseMoveEvent, function(e)
            {
                if(opts.slideDrag)
                {
                    var beginValue;
                    if(opts.mode == "vertical")
                    {
                        beginValue = e.clientY + self.parent().scrollTop();
                    }
                    else
                    {
                        beginValue = e.clientX + self.parent().scrollLeft();
                    }
                    var percent = (beginValue - opts.slideBegin - (opts.sliderLength >> 1)) / opts.slideMax;
                    $$.setSlide.call(self, Math.floor(percent * (opts.max - opts.min) + opts.min), false);
                }
            })
            .bind(mouseUpEvent, function()
            {
                opts.slideDrag = false;
            });
            return self;
        },
        
        setSlide : function(value, animate, jumpToEnd)
        {
            var self = this, opts = self.opts, obj = $("> .uiPanel > .uiSlider", self);
            if(value === undefined)
            {
                return self;
            }
            value = value > opts.max? opts.max : (value < 0? 0 : value);            
            opts.slideValue = value;
            var percent = (value - opts.min) / (opts.max - opts.min);
            value = opts.slideMax * percent;
            value = value > 0 ? (value < opts.slideMax? value : opts.slideMax) : 0;
            var props;
            if(opts.mode == "vertical")
            {
                props = {"top" : value};
            }
            else
            {   
                props = {"left" : value};
            }             
            if(animate)
            {
                obj.stop(true, jumpToEnd).animate(props, 800, function()
                {
                    if($.isFunction(opts.slide))
                    {
                        opts.slide.call(this, percent * 100);
                    }
                });
            }
            else
            {
                obj.css(props);
                if($.isFunction(opts.slide))
                {
                    opts.slide.call(this, percent * 100);
                }
            }
            return self;
        },
        val : function(value)
        {
            var self = this, opts = self.opts;
            if(value === undefined)
            {
                return opts.slideValue;
            }
            $$.setSlide.call(self, value, true, true);
            return self;
        },
        sliderLength : function(value)
        {
            var self = this, opts = self.opts;
            var slider = $("> .uiPanel > .uiSlider", self);
            if(value === undefined)
            {
               return opts.sliderLength;
            }
            if(value > opts.slideLength)
            {
                value = opts.slideLength;
            }
            opts.slideMax -= (value - opts.sliderLength);
            opts.sliderLength = value;
            if(opts.mode == "vertical")
            {
                slider.height(opts.sliderLength);
                opts.sliderLength = slider.height();
            }
            else
            {
                slider.width(opts.sliderLength);
                opts.sliderLength = slider.width();
            }
            return self;
        },
        beforeDestroy : function()
        {
            var self = this, opts = self.opts;
            $(document).unbind("." + opts.widgetKey);
        }
    });
})(jQuery);

// JavaScript Document
;
(function($)
{
    $.angela.accordion = $.angela.accordion || {};
    $.angela.accordion.defaults = {
        accordionClass : "uiBlueBigBorder uiCornerAll uiBlueBoxShadow",
        titleBarClass : $.angela.selectedGradientBG["30"],
        
        activeClass : $.angela.selectedGradientBG["40"],
        
        itemTitleBarClass : $.angela.defaultGradientBG["40"],
        
        active : [0],
        
        height : "auto",
        
        event : "click",
        
        toggle : false,
        
        hideOthers : true,
        
        titleIcon : null,
        
        animation : "toggle",
        disabled : false,
        
        
        widgetKey : null,
        animating : false,
        titleBarHTML : '<div class="uiAccordionTitleBar uiNoSelectText"><span></span></div>',
        itemHTML : '<div class="uiTitleBar uiNoSelectText"><div class="uiUserBtn uiArrowDown"></div><span class="uiTitle"></span></div>',
        
        
        changeStart : null,
        change : null
    };

    
    $.fn.accordion = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.accordion.defaults, init : $$.init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.extend($.angela.accordion, $.angela.widget, {
        
        init : function(opts)
        {
            var self = this, titleBar = null, title = self.attr("title");
            
            if(title)
            {
                titleBar = $(opts.titleBarHTML).addClass(opts.titleBarClass).children("span").html(title).end();
                if(opts.titleIcon)
                {
                    titleBar.prepend($('<span class="uiTitleIcon" />').addClass(opts.titleIcon));
                }
            }

            
            self.addClass("uiAccordion uiWidget " + opts.accordionClass).find("> div").each( function(n)
            {
                var contentClass = "uiHidden", titleBarClass = opts.itemTitleBarClass, buttonClass = "";
                
                if(opts.active == "all" || $.inArray(n, opts.active) != -1)
                {
                    contentClass = "";
                    titleBarClass = opts.activeClass + " uiActive";
                    buttonClass = "uiArrowUp";
                }
                
                $(opts.itemHTML).addClass(titleBarClass)
                .children(".uiUserBtn").addClass(buttonClass)
                .siblings(".uiTitle").html($(this).attr("title")).end().end()
                .insertBefore($(this).addClass("uiContent " + contentClass).height(opts.height));
            }).end()
            .prepend(titleBar);

            
            $$.initEvent.call(self);
            if(opts.disabled)
            {
                $$.disable.call(self);
            }
            return self;
        },
        
        initEvent : function()
        {
            var self = this, opts = self.opts;
            
            self.bind(opts.event + ".uiAccordion", function(e)
            {
                if(opts.disabled || opts.animating)
                {
                    return false;
                }
                var target = $(e.target);
                if(!target.hasClass("uiTitleBar"))
                {
                    target = target.parent(".uiTitleBar");
                    if(target.length == 0)
                    {
                        return ;
                    }
                }
                if(!opts.toggle)
                {
                    if(target.hasClass(opts.activeClass))
                    {
                        return ;
                    }
                }
                if($.isFunction(opts.changeStart))
                {
                    if(opts.changeStart.call(self[0], e) === false)
                    {
                        return false;
                    }
                }
                opts.animating = true;
                var selectedList = opts.hideOthers == true? $("> ." + opts.activeClass, self).not(target).removeClass(opts.activeClass + " uiActive").addClass(opts.itemTitleBarClass) : null;
                target.toggleClass(opts.itemTitleBarClass).toggleClass(opts.activeClass + " uiActive").add(selectedList)
                .children(".uiUserBtn").toggleClass("uiArrowUp").end()
                .next(".uiContent").stop(true, true)[opts.animation]( function()
                {
                    if($(this).is(":visible"))
                    {
                        if($.isFunction(opts.change))
                        {
                            opts.change.call(self[0], e);
                        }
                    }
                    opts.animating = false;
                });
                
            });
            return self;
        },
        
        activate : function(index)
        {
            var self = this, opts = self.opts;
            if(index === undefined)
            {
                var activateArr = [];
                var titleBarList = $("> .uiTitleBar", self);
                titleBarList.each(function(n)
                {
                    if($(this).hasClass(opts.activeClass))
                    {
                        activateArr.push(n);
                    }
                });
                return activateArr;
            }
            var obj = $("> .uiTitleBar", self).eq(index);
            if(!obj.hasClass(opts.activeClass))
            {
                obj.trigger(opts.event + ".uiAccordion");
            }
            return self;
        },
        
        item : function(index, content, title)
        {
            var self = this, opts = self.opts;
            if(index === undefined)
            {
                return $();
            }
            var titleBar = $("> .uiTitleBar", self).eq(index);
            if(content === undefined)
            {
                return titleBar.next();
            }
            if(title === undefined)
            {
                return titleBar.next().html(content);
            }
            return titleBar.html(title).next().html(content);
        },
        
        add : function(item)
        {
            var self = this, opts = self.opts, item = $(item);
            $(opts.itemHTML).addClass(opts.itemTitleBarClass)
            .children(".uiTitle").html(item.attr("title")).end().appendTo(self);
            item.addClass("uiContent uiHidden").height(opts.height).appendTo(self);
            return self;
        },
        
        remove : function(index)
        {
            var self = this, opts = self.opts;
            $("> .uiTitleBar", self).eq(index).next().andSelf().remove();
            return self;
        },
        
        title : function(title)
        {
            var self = this, opts = self.opts;
            var obj = $("> .uiAccordionTitleBar > span:last", self);
            if(typeof title == "undefined")
            {
                return obj.text();
            }
            obj.text(title);
            return self;
        },
        
        titleIcon : function(titleIcon)
        {
            var self = this, opts = self.opts;
            if(titleIcon === undefined)
            {
                return opts.titleIcon;
            }
            if(opts.titleIcon == null)
            {
                $("> .uiAccordionTitleBar", self).prepend($('<span class="uiTitleIcon" />'));
            }
            var obj = $("> .uiAccordionTitleBar > span.uiTitleIcon", self).removeClass(opts.titleIcon).addClass(titleIcon);
            opts.titleIcon = titleIcon;
            return self;
        }
    });
})(jQuery);

// JavaScript Document
;
(function($)
{
    $.angela.dropDownList = $.angela.dropDownList || {};
    $.angela.dropDownList.defaults = {
        
        dropDownListClass : $.angela.selectedGradientBG["40"] + " uiCornerAll uiBlueBigBorder",
        selectListClass : "uiBlueCss3GradientBG uiCornerAll uiBlueBigBorder uiBlueBoxShadow",        
        
        pageSize : 5,
        showAll : false,
        
        multiple : false,
        
        dropListType : "normal",
        
        searchTip : "查找/search",
        disabled : false,
        listItemHoverClass : $.angela.hoverGradientBG["40"],        

                
        widgetKey : null,
        selectItemTotal : 0,
        listItemOuterHeight : 0,
        dropDownHTML : '<div class="uiDropDown"><div class="uiDropDownBtn uiBlackBorder"></div></div>',
        selectListHTML : '<div class="uiSelectList"></div>',
        noListDataHTML : '<li style="font-size:12px;">无数据项..</li>',
        
        click : null,
        change : null,
        input : null,
        blur : null,
        focus : null
    };
    
    $.fn.dropDownList = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.dropDownList.defaults, init : $$.init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.extend($.angela.dropDownList, $.angela.widget, {
        init : function(opts)
        {
            var self = this;

            
            var multiple = opts.multiple? "uiMultiple" : "";
            
            var selectList = self.children().addClass(multiple + " uiSelectList " + opts.selectListClass);
            opts.selectItemTotal = $("> li", selectList).length;
            var dropDown = $(opts.dropDownHTML);
            if(opts.dropListType == "search")
            {
                dropDown.append('<input type="text" value="'+ opts.searchTip + '" class="uiCornerAll" />');
            }
            else
            {
                dropDown.append("<span></span>");
            }
            if(opts.multiple)
            {
                selectList.find("> li").prepend('<span class="uiUserBtn uiSelected"></span>');
            }
            self.append(dropDown)
            .append(selectList)
            .addClass("uiDorpDownList uiWidget " + opts.dropDownListClass);
            if(opts.dropListType == "search")
            {
                dropDown.children("input").width(dropDown.width() - 2 * parseInt(dropDown.css("padding-left")) - dropDown.children(".uiDropDownBtn").outerWidth(true));
            }
            
            if(opts.showAll)
            {
                opts.pageSize = opts.selectItemTotal;
                selectList.hide();
            }
            else
            {
                opts.listItemOuterHeight = selectList.find("> li").outerHeight();
                selectList.height(opts.listItemOuterHeight * opts.pageSize).hide();
            }
            
            $$.initEvent.call(self);
            if(opts.disabled)
            {
                $$.disable.call(self);
            }
            return self;
        },
        initEvent : function()
        {
            var self = this, opts = self.opts, selectedContent = $("> .uiDropDown > span, > .uiDropDown > input", self);
            
            $("> .uiDropDown > .uiDropDownBtn", self).bind("click.uiDorpDownList", function(e)
            {
                if(opts.disabled)
                {
                    return false;
                }
                if(opts.click)
                {
                    if(opts.click.call(this, e) === false)
                    {
                        return false;
                    }
                }
                $(this).parent().siblings(".uiSelectList").slideToggle();
            })
            .next("input").bind({
                "focus.uiDorpDownList" : function(e)
                {
                    if(opts.disabled)
                    {
                        return false;
                    }                    
                    var obj = $(this);
                    if($.isFunction(opts.focus))
                    {
                        if(opts.focus.call(obj[0], e) === false)
                        {
                            return false;   
                        }
                    }
                    if(!obj.hasClass("selected"))
                    {
                        if(obj.val() == opts.searchTip)
                        {
                            obj.val("");
                        }
                    }
                    obj.addClass("selected");
                },
                "blur.uiDorpDownList" : function(e)
                {
                    if(opts.disabled)
                    {
                        return ;
                    }                    
                    var obj = $(this);                    
                    if($.isFunction(opts.blur))
                    {
                        if(opts.blur.call(obj[0], e) === false)
                        {
                            return false;
                        }
                    }
                    if(obj.val() == "")
                    {
                        obj.val(opts.searchTip);
                    }
                    obj.removeClass("selected");
                },
                "input.uiDorpDownList" : function(e)
                {
                    if(opts.disabled)
                    {
                        return false;
                    }
                    if($.isFunction(opts.input))
                    {
                        opts.input.call(this, e);
                    }
                }
            });
            
            $("> .uiSelectList", self).bind("mousewheel.uiDorpDownList", function(e, delta)
            {
                if(opts.disabled)
                {
                    return false;
                }
                if($("> li",this).length <= opts.pageSize)
                {
                    return ;
                }
                if(delta < 0)
                {
                    var obj = $("> li:not(:hidden):first", this);
                    if(obj.nextAll().length >= opts.pageSize)
                    {
                        obj.hide();
                    }
                }
                else
                {
                    $("> li:hidden:last", this).show();
                }
                return false;
            })
            .bind("mousedown.uiDorpDownList", function(e)
            {
                if(opts.disabled)
                {
                    return ;
                }
                var selectedValue =  $(e.target).toggleClass("selected").text();
                if(opts.multiple)
                {
                    selectedValue = "";
                    $(this).children(".selected").each( function()
                    {
                        selectedValue += ($(this).text() + ";");
                    });
                    selectedValue = selectedValue.substring(0, selectedValue.length - 1);
                }
                else
                {
                    $(this).slideUp();
                }
                if(opts.dropListType == "search")
                {
                    selectedContent.val(selectedValue);
                }
                else
                {
                    selectedContent.html(selectedValue);
                }
                if($.isFunction(opts.change))
                {
                    if(opts.change.call(this, selectedValue, e) === false)
                    {
                        return false;
                    }
                }
            });
            $("> .uiSelectList > li", self).hover( function()
            {
                $(this).addClass(opts.listItemHoverClass);
            }, function()
            {
                $(this).removeClass(opts.listItemHoverClass);
            });
            return self;
        },
        selectItem : function(index)
        {
            var self = this, opts = self.opts;
            if(index === undefined)
            {
                return $();
            }
            $("> .uiSelectList ul li:eq(" + index + ")", self).trigger("click.uiDorpDownList");
            return self;
        },
        setList : function(obj)
        {
            var self = this, opts = self.opts;
            var selectList = $(".uiSelectList", self).empty();
            if(typeof obj == "string")
            {
                selectList.html(obj);
            }
            else if($.isArray(obj))
            {
                if(obj.length == 0)
                {
                    selectList.append(opts.noListDataHTML);
                }
                $.each(obj, function(i, item)
                {
                    selectList.append("<li>" + item + "</li>");
                });
            }
            else
            {
                selectList.append(obj);
            }
            var listItem = selectList.find("> li");
            opts.selectItemTotal = listItem.length;
            if(opts.multiple)
            {
                listItem.prepend('<span class="uiUserBtn uiSelected"></span>');
            }
            var listShowTotal = opts.pageSize;
            if(opts.showAll || opts.pageSize > opts.selectItemTotal)
            {
                listShowTotal = opts.selectItemTotal;
            }            
            if(opts.listItemOuterHeight == 0)
            {
                opts.listItemOuterHeight = selectList.children().outerHeight(true);
            }
            selectList.height(opts.listItemOuterHeight * listShowTotal);
            $("> .uiSelectList > li", self).hover( function()
            {
                $(this).addClass(opts.listItemHoverClass);
            }, function()
            {
                $(this).removeClass(opts.listItemHoverClass);
            });
            
            return self;
        },
        
        showSelectList : function()
        {
            var self = this, opts = self.opts;
            self.children(".uiSelectList").show();
            return self;
        },
        
        hideSelectList : function()
        {
            var self = this, opts = self.opts;
            self.children(".uiSelectList").hide();
            return self;
        },
        
        val : function(value)
        {
            var self = this, opts = self.opts, selectedValue = "";
            if(value === undefined)
            {
                self.children(".selected").each( function()
                {
                    selectedValue += ($(this).text() + ";");
                });
                selectedValue = selectedValue.substring(0, selectedValue.length - 1);
                
                return selectedValue;
            }
            else
            {
                var selectedContent = $("> .uiDropDown > span, > .uiDropDown > input", self);
                if(opts.dropListType == "search")
                {
                    selectedContent.val(value);
                }
                else
                {
                    selectedContent.html(value);
                }
                return self;
            }
        }
    });
})(jQuery);

// JavaScript Document
;
(function($)
{
    $.angela.dialog = $.angela.dialog || {};

    $.angela.dialog.defaults = {
        
        dlgClass : "uiBlueBigBorder uiCornerAll uiBlueBoxShadow",
        titleBarClass : $.angela.selectedGradientBG["40"],
        
        position : null,
        
        zIndex : 1000,
        
        draggable : false,
        
        resizable : false,
        
        minStatusWidth : 250,
        
        modal : false,
        
        buttonSet : null,
        
        minHeight : 300,
        maxHeight : 700,
        
        minWidth : 400,
        maxWidth : 1000,
        
        //closeOnEscape : false,
        active : true,
        minimize : true,
        closable : true,
        noTitle : false,
        titleIcon : null,
        
        controlButton : true,
        disabled : false,
        autoOpen : true,
        destroyOnClose : true,
        closeAnimate : "slideUp",
        openAnimate : "slideDown",
        
        
        widgetKey : null,
        
        dlgMinHeight : 0,
        
        dlgHeight : 0,
        
        dlgWidth : 0,
        
        dlgPosition : null,
        overflowStatus : null,
        controlButtonSetHTML : '<div class="uiDlgButtonSet"><div class="uiUserBtn uiMinBtn"></div><div class="uiUserBtn uiCloseBtn"></div></div>',
        titleBarHTML : '<div class="uiTitleBar"><span class="uiTitle"></span></div>',
        contentHTML : '<div class="uiContent"></div>',
        resizeHTML :'<div class="uiResizable"></div>',
        selectList : null,
        
        
        
        beforeClose : null,
        close : null,
        beforeOpen : null,
        open : null,
        
        beforeMin : null,
        min : null,
        
        beforeResume : null,
        resume : null,
        dragStart : null,
        draging : null,
        dragStop : null,
        resizeStart : null,
        resizing : null,
        resizeStop : null
    };

    
    $.fn.dialog = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.dialog.defaults, init : $$.init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.extend($.angela.dialog, $.angela.widget, {
        
        init : function(opts)
        {
            var self = this, titleBarClass = opts.titleBarClass + " uiCornerAll";

            opts.title = self.attr("title");
            opts.content = $.trim(self.html());
            
            if(opts.draggable)
            {
                titleBarClass += (" uiDraggalbe");
            }
            
            var controlButton = null;
            if(opts.controlButton)
            {
                controlButton = $(opts.controlButtonSetHTML);
                if(!opts.minimize)
                {
                    controlButton.children(".uiMinBtn").hide();
                }
                if(!opts.closable)
                {
                    controlButton.children(".uiCloseBtn").hide();
                }
            }

            

            var content =self.children().addClass("uiContent");
            if(opts.noTitle)
            {
                self.addClass("uiDialog uiWidget " + opts.dlgClass);
            }
            else
            {
                var tileBar = $(opts.titleBarHTML).addClass(titleBarClass).append(controlButton).children(".uiTitle").html(opts.title).end();
                if(opts.titleIcon != null)
                {
                    tileBar.children(".uiTitle").prepend($('<span class="uiTitleIcon" />').addClass(opts.titleIcon));
                }
                self.addClass("uiDialog uiWidget " + opts.dlgClass).prepend(tileBar);
            }
            
            if(opts.position !== null)
            {
                self.css("z-index", opts.zIndex + 1).moveToPos({position : opts.position});
            }
            
            if(opts.modal)
            {
                var maskObj = $("<div />").addClass("uiMask").appendTo("body");
                if($.browser.msie && $.browser.version == "6.0")
                {
                    opts.selectList = $("select:visible").filter(function(i)
                    {
                        if($(this).css("visibility") != "hidden")
                        {
                            return true;
                        }
                        return false;
                    }).css("visibility", "hidden");
                    maskObj.height($(document).height());
                }
            }
            
            if(opts.buttonSet != null)
            {
                var buttonSetHTML = "<div>";
                for(var key in opts.buttonSet)
                {
                    buttonSetHTML += ("<div>" + key + "</div>");
                }
                buttonSetHTML += "</div>";
                $(buttonSetHTML).buttonSet({
                    click : function()
                    {
                        if(opts.disabled)
                        {
                            return false;
                        }
                        if(opts.buttonSet[$(this).html()].call(this) === false)
                        {
                            return false;
                        }
                        $$.close.call(self);
                    }
                }).appendTo(self);
            }
            
            if(opts.resizable)
            {
                self.append(opts.resizeHTML);
                if(self.css("position") == "static")
                {
                    self.css("position", "relative");
                }
            }
            opts.minHeight = Math.min(self.height(), opts.minHeight);
            opts.minWidth = Math.min(self.width(), opts.minWidth);
            $$.setContentHeight.call(self);
            
            $$.initEvent.call(self);
            if(opts.disabled)
            {
                $$.disable.call(self);
            }
            if(!opts.autoOpen)
            {
                self.hide();
            }
            return self;
        },
        initEvent : function()
        {
            var self = this, opts = self.opts, posStr = self.css("position");
            
            self.find("> .uiTitleBar > .uiDlgButtonSet > .uiUserBtn").bind("click.uiDialog", function(e)
            {
                if(opts.disabled)
                {
                    return false;
                }
                var obj = $(this);
                if(obj.hasClass("uiMinBtn"))
                {
                    if($.isFunction(opts.beforeMin))
                    {
                        if(opts.beforeMin.call(this, e) === false)
                        {
                            return false;
                        }
                    }
                    $$.min.call(self, e);
                }
                else if(obj.hasClass("uiResumeBtn"))
                {
                    if($.isFunction(opts.beforeResume))
                    {
                        if(opts.beforeResume.call(this, e) === false)
                        {
                            return false;
                        }
                    }
                    $$.resume.call(self, e);
                }
                else if(obj.hasClass("uiCloseBtn"))
                {
                    if($.isFunction(opts.beforeClose))
                    {
                        if(opts.beforeClose.call(this, e) === false)
                        {
                            return false;
                        }
                    }
                    $$.close.call(self, e);
                }
            });
            
            if(opts.draggable)
            {
                var dragStopFunc = function(offset)
                {
                    if(opts.disabled)
                    {
                        return false;
                    }
                    if($.isFunction(opts.dragStop))
                    {
                        if(opts.dragStop.call(self) === false)
                        {
                            return false;
                        }
                    }
                    self.moveToPos({position : [offset.left, offset.top]});
                };

                self.draggable({
                    event : {start : opts.dragStart, doing : opts.draging,  stop : dragStopFunc}
                });
            }
            
            if(opts.resizable)
            {
                var resizeStopFunc = function(width, height)
                {
                    if(opts.disabled)
                    {
                        return false;
                    }
                    if($.isFunction(opts.resizeStop))
                    {
                        if(opts.resizeStop.call(self) === false)
                        {
                            return false;
                        }
                    }
                    height = Math.min(Math.max(opts.minHeight, height), opts.maxHeight);
                    width = Math.min(Math.max(opts.minWidth,  width), opts.maxWidth);
                    var otherItemHeightTotal = 0, content = self.width(width).height(height).children(".uiContent");
                    self.children().each( function()
                    {
                        var obj = $(this);
                        if(!obj.hasClass("uiContent") && !obj.hasClass("uiResizable"))
                        {
                            otherItemHeightTotal += $(this).outerHeight(true);
                        }
                    });
                    var outerOffset = content.outerHeight(true) - content.height();
                    content.height(height - otherItemHeightTotal - outerOffset);
                };

                self.resizable({
                    event : {start : opts.resizeStart, doing : opts.resizing,  stop : resizeStopFunc},
                    minHeight : opts.minHeight,
                    maxHeight : opts.maxHeight,
                    minWidth : opts.minWidth,
                    maxWidth : opts.maxWidth
                });
            }
            
            
            if(posStr != "static" && posStr != "relative")
            {
                if(opts.active && opts.autoOpen)
                {
                    $(".uiDialog").not(self).each( function()
                    {
                        var obj = $(this);
                        if(obj.css("position") != "static" && obj.css("position") != "relative")
                        {
                            obj.css("z-index", opts.zIndex).children(".uiTitleBar").addClass("uiInactive");
                        }
                    });
                }
                self.bind("mousedown.uiDialog", function(e)
                {
                    if(opts.disabled)
                    {
                        return ;
                    }
                    self.css("z-index", opts.zIndex + 1).children(".uiTitleBar").removeClass("uiInactive");
                    self.siblings(".uiDialog").each( function()
                    {
                        var obj = $(this);
                        if(obj.css("position") != "static" && obj.css("position") != "relative")
                        {
                            obj.css("z-index", opts.zIndex).children(".uiTitleBar").addClass("uiInactive");
                        }
                    });
                    var target = $(e.target);
                    if(target.hasClass("uiDraggalbe") || target.hasClass("uiResizable") || target.parent().hasClass("uiDraggalbe"))
                    {
                        return false;
                    }
                });
            }
            return self;
        },
        
        min : function(e)
        {
            var self = this, opts = self.opts;
            $(">.uiTitleBar >.uiDlgButtonSet >.uiMinBtn", self).removeClass("uiMinBtn").addClass("uiResumeBtn");
            opts.dlgMinHeight = self.find("> .uiTitleBar").outerHeight(true);
            opts.dlgHeight = self.height();
            opts.dlgWidth = self.width();
            if(opts.resizable)
            {
                $(".uiResizable", self).hide();
            }
            var positionStr = self.css("position");
            if(positionStr === "static" || positionStr === "relative")
            {
                opts.overflowStatus = self.css("overflow");
                self.height(opts.dlgMinHeight).css("overflow", "hidden");
            }
            else
            {
                var oldPos = {position : null, left : null, top : null, right : null, bottom : null};
                $.each(oldPos, function(key)
                {
                    oldPos[key] = self.css(key);
                });
                if(positionStr == "absolute")
                {
                    oldPos["top"] = parseInt(oldPos["top"]) - $(document).scrollTop();
                }
                opts.dlgPosition = oldPos;
                positionStr = "fixed";
                
                if($.browser.msie && $.browser.version == "6.0")
                {
                    positionStr = "absolute";
                }
                self.css({right : null, bottom : null, position : positionStr}).animate({height : opts.dlgMinHeight, width : opts.minStatusWidth, left : 0, top : 0}, 300);
                //self.height(opts.dlgMinHeight).width(opts.minStatusWidth).css({left : 0, top : 0, right : null, bottom : null, position : positionStr});
            }
            if($.isFunction(opts.min))
            {
                if(opts.min.call(self[0], e) === false)
                {
                    return false;
                }
            }
            return self;
        },
        
        resume : function(e)
        {
            var self = this, opts = self.opts;
            $(">.uiTitleBar >.uiDlgButtonSet >.uiResumeBtn", self).removeClass("uiResumeBtn").addClass("uiMinBtn");
            if(opts.resizable)
            {
                $(".uiResizable", self).show();
            }
            var position = self.css("position");
            if(position === "static")
            {
                self.height(opts.dlgHeight).width(opts.dlgWidth).css("overflow", opts.overflowStatus);
            }
            else
            {
                if(opts.dlgPosition["position"] == "absolute")
                {
                    opts.dlgPosition["top"] = parseInt(opts.dlgPosition["top"]) + $(document).scrollTop();
                }
                var tmpSetting = $.extend({}, opts.dlgPosition, {height : opts.dlgHeight, width : opts.dlgWidth});
                //self.height(opts.dlgHeight).width(opts.dlgWidth).css(opts.dlgPosition);
                self.css(tmpSetting);
            }
            if($.isFunction(opts.resume))
            {
                if(opts.resume.call(self[0], e) === false)
                {
                    return false;
                }
            }
            return self;
        },
        
        close : function(e)
        {
            var self = this, opts = self.opts;
            if(opts.modal)
            {
                if($.browser.msie && $.browser.version == "6.0")
                {
                    opts.selectList.css("visibility", "visible");
                }
                $(".uiMask").remove();
            }
            self[opts.closeAnimate]( function()
            {
                if($.isFunction(opts.close))
                {
                    if(opts.close.call(this, e) === false)
                    {
                        return false;
                    }
                }
                if(opts.destroyOnClose)
                {
                    $$.destroy.call(self);
                }
            });
            return self;
        },
        open : function()
        {
            var self = this, opts = self.opts;
            if(self.css("position") != "static")
            {
                if(opts.active)
                {
                    self.siblings(".uiDialog").each( function()
                    {
                        var obj = $(this);
                        if(obj.css("position") != "static")
                        {
                            obj.css("z-index", opts.zIndex).children(".uiTitleBar").addClass("uiInactive");
                        }
                    });
                }
            }
            if($.isFunction(opts.beforeOpen))
            {
                if(opts.beforeOpen.call(self) === false)
                {
                    return self;
                }
            }
            
            if(opts.modal)
            {
                if($(".uiMask").length == 0)
                {
                    $("<div />").addClass("uiMask").appendTo("body");
                }
            }
            self[opts.openAnimate]( function()
            {
                if($.isFunction(opts.open))
                {
                    opts.open.call(self);
                }
            });
            return self;
        },
        
        title : function(title)
        {
            var self = this, opts = self.opts;
            var obj = $("> .uiTitleBar > .uiTitle", self);
            if(title === undefined)
            {
                return obj.text();
            }
            obj.html(obj.html().replace(obj.text(), title));            
            return self.attr("title", title);
        },
        
        titleIcon : function(titleIcon)
        {
            var self = this, opts = self.opts;
            if(titleIcon === undefined)
            {
                return opts.titleIcon;
            }
            if(opts.titleIcon == null)
            {
                $("> .uiTitleBar > .uiTitle", self).prepend('<span class="uiTitleIcon" />');
            }
            var obj = $("> .uiTitleBar > .uiTitle > .uiTitleIcon", self).removeClass(opts.titleIcon).addClass(titleIcon);
            opts.titleIcon = titleIcon;
            return self;
        },
        setContentHeight : function()
        {
            var self = this, opts = self.opts;
            var otherItemHeightTotal = 0, contentHeight = 0, outerOffset = 0, content = self.children(".uiContent");
            self.children().each( function()
            {
                var obj = $(this);
                if(!obj.hasClass("uiContent") && !obj.hasClass("uiResizable"))
                {
                    otherItemHeightTotal += $(this).outerHeight(true);
                }
            });  
            contentHeight = content.outerHeight(true);
            outerOffset = contentHeight - content.height();    
            var imgList = self.find("img");
            if(imgList.length != 0)
            {
                var imgTotal = imgList.length;
                var completeLoad = 0;
                imgList.each(function()
                {
                    if(this.complete)
                    {
                        completeLoad++;
                        if(completeLoad == imgTotal) 
                        {
                            content.height(self.height() - otherItemHeightTotal - outerOffset);
                        }
                    }
                    else
                    {
                        $(this).load(function()
                        {
                            completeLoad++;
                            if(completeLoad == imgTotal)
                            {
                                content.height(self.height() - otherItemHeightTotal - outerOffset);
                            }
                        });
                    }
                });
            }  
            else
            {
                content.height(self.height() - otherItemHeightTotal - outerOffset);
            }
        }
    });
})(jQuery);

// JavaScript Document
;
(function($)
{
    $.angela.menu = $.angela.menu || {};

    $.angela.menu.defaults = {
        
        menuClass : $.angela.selectedGradientBG["40"] + " uiBlueBorder uiBorderNoLeft uiBorderNoRight",
        topLevelListItemClass : "uiBlueBigBorder uiBorderLeft",
        topLevelVerticalListItemClass : "uiBlueBigBorder uiBorderTop",
        subLevelListClass : "uiBlueCss3GradientBG uiBlueBigBorder uiCornerAll",
        listHoverClass : "ui40LightBlueGradientBG",
        
        url : null,   
        
        hoverColor : "#000",
        checkPosEachTime : false,
        
        show : "slideDown",
        
        hide : "hide",
        disabled : false,
        vertical : false,
        openNewWindow : false,
        
        
        widgetKey : null,
        
        subLevelListTotal : 0,
        
        hideFlag : false,     
        
        color : null,
        
        listPosSetFlag : null,
        hideDelay : 50,
        topLevelListHTML : '<ul class="uiTopLevel"></ul>',
        subLevelListHTML : '<ul class="uiSubLevel"></ul>',
        rightIconHTML : '<span style="float:right;" class="uiUserBtn uiArrowRight"></span>',
        downIconHTML : '<span style="float:right;" class="uiUserBtn uiArrowDown"></span>',
        hrefHTML : '<a class="uiHidden"></a>',
        
        
        error : null,
        click : null,
        hideAllSubList : null
    };

    
    $.fn.menu = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.menu.defaults, init : $$.init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.extend($.angela.menu, $.angela.widget, {
        init : function(opts)
        {
            var self = this;
            if(opts.url == null)
            {
                return self.addClass("uiMenu uiWidget " + opts.menuClass);
            }
            $$.initList.call(self);

            return self;
        },
        initList : function()
        {
            var self = this, opts = self.opts, listJson = null, topLevelList = $(opts.topLevelListHTML), topLevelListWidth = 0, pos = null;
            opts.listPosSetFlag = {};
            //$.getJSON(opts.url,  function(data)
            $.ajax({
                url : opts.url,
                dataType : "json",
                success : function(data)
                {
                    listJson = data;
                    var topLevelListItemClass = opts.vertical == true ? opts.topLevelVerticalListItemClass : opts.topLevelListItemClass, listIcon = null;
                    $.each(listJson.menu, function(n, item)
                    {
                        var itemClass = n == 0? "" : topLevelListItemClass, childrenListNO = 0, listHTMLStr;

                        
                        if(typeof item.children != "undefined")
                        {
                            childrenListNO = ++opts.subLevelListTotal;
                            $$.createList.call(self, item.children);
                            pos = item.pos;
                            if(opts.vertical)
                            {
                                if(pos == "right")
                                {
                                    listIcon = $(opts.rightIconHTML);
                                }
                                else
                                {
                                    listIcon = $(opts.downIconHTML);
                                }
                            }
                        }
                        if(typeof item.href != "undefined")
                        {
                            //listHTMLStr = '<li href="' + item.href + '">' + item.content + "</li>";
                            listHTMLStr = '<li><a class="" target="_ablank" href="' + item.href + '">' + item.content + "</a></li>";
                        }
                        else
                        {
                            listHTMLStr = '<li>' + item.content + "</li>";
                        }
                        var listClass = "";
                        if(typeof item.listIcon != "undefined")
                        {
                            listIcon = $('<span class="uiListIcon" />').addClass(item.listIcon);
                            listClass = "hasListIcon";
                        }
                        topLevelList.append($(listHTMLStr).attr("childrenListNO", childrenListNO).attr("pos", pos).addClass(itemClass).prepend(listIcon).prepend(listIcon).addClass(listClass));
                    });
                    self.addClass("uiMenu uiWidget " + opts.menuClass).append(topLevelList);
                    if(opts.vertical)
                    {
                        topLevelListWidth = topLevelList.addClass("verticalList").children().outerWidth(true);
                        self.addClass("uiBlueCss3GradientBG");
                    }
                    else
                    {
                        topLevelList.children().each( function()
                        {
                            topLevelListWidth += $(this).outerWidth(true);
                        });
                    }
                    topLevelList.width(topLevelListWidth);
                    opts.color = self.css("color");
                    $$.initEvent.call(self);
                    if(opts.disabled)
                    {
                        $$.disable.call(self);
                    }
                },
                error : function()
                {
                    if($.isFunction(opts.error))
                    {
                        opts.error();
                    }
                }
            });
            return self;
        },
        initEvent : function()
        {
            var self = this, opts = self.opts;
            $("> ul > li", self).hover( function(e)
            {
                if(opts.disabled)
                {
                    return false;
                }
                opts.hideFlag = false;
                var obj = $(this).addClass(opts.listHoverClass), no = obj.attr("childrenListNO"), pos = obj.attr("pos");                
                obj.siblings("." + opts.listHoverClass).removeClass(opts.listHoverClass);
                if(obj.children("a").length != 0)
                {
                    obj.children("a").stop(true,true).animate({color : opts.hoverColor})
                }
                else
                {
                    obj.stop(true,true).animate({color : opts.hoverColor});
                }
                $$.hideList.call(self, obj);
                if(no == 0)
                {
                    return ;
                }
                if(opts.checkPosEachTime || typeof opts.listPosSetFlag[no] == "undefined")
                {
                    var offset = $$.getOffset(self, obj, pos);
                    $('> ul[NO="' + no + '"]', self).css({"left" : offset.left, "top" : offset.top})[opts.show]().children().removeClass(opts.listHoverClass);
                    opts.listPosSetFlag[no] = true;
                }
                else
                {
                    $('> ul[NO="' + no + '"]', self)[opts.show]().children().removeClass(opts.listHoverClass);
                }
            }, function(e)
            {
                if(opts.disabled)
                {
                    return false;
                }
                var obj = $(this);
                if(obj.children("a").length != 0)
                {
                    obj = obj.children("a");
                }
                obj.stop(true,true).css("color", opts.color);
                opts.hideFlag = true;
                setTimeout( function()
                {
                    $$.hideAllSubList.call(self);
                }, opts.hideDelay);
            });
            self.find("a").bind("click.uiMenu", function(e)
            {
                if(opts.disabled)
                {
                    return false;
                }
                var target = $(this),  href = target.attr("href");
                if($.isFunction(opts.click))
                {
                    if(opts.click.call(target[0], e) === false)
                    {
                        return false;
                    }
                }
                if(href != undefined)
                {
                    if(!opts.openNewWindow)
                    {
                        setTimeout(function()
                        {
                            window.location.href = href;
                        }, 100);
                        return false;
                    }
                }
            });
            return self;
        },
        
        createList : function(listJson)
        {
            var self = this, opts = self.opts, subLevelList = $(opts.subLevelListHTML).addClass(opts.subLevelListClass).attr("NO", opts.subLevelListTotal);
            $.each(listJson, function(n, item)
            {
                var childrenListNO = 0, subLevelListIcon = null, pos = null, listHTMLStr;
                if(typeof item.children != "undefined")
                {
                    pos = item.pos;
                    childrenListNO = ++opts.subLevelListTotal;
                    $$.createList.call(self, item.children);
                    if(pos == "right")
                    {
                        subLevelListIcon = $(opts.rightIconHTML);
                    }
                    else
                    {
                        subLevelListIcon = $(opts.downIconHTML);
                    }
                }
                if(typeof item.href != "undefined")
                {
                    //listHTMLStr = '<li href="' + item.href + '">' + item.content + "</li>";
                    listHTMLStr = '<li><a class="" target="_ablank" href="' + item.href + '">' + item.content + "</a></li>";
                }
                else
                {
                    listHTMLStr = '<li>' + item.content + "</li>";
                }
                var listIcon = null;
                var listClass = "";
                if(typeof item.listIcon != "undefined")
                {
                    listIcon = $('<span class="uiListIcon" />').addClass(item.listIcon);
                    listClass = "hasListIcon";
                }
                subLevelList.append($(listHTMLStr).attr("childrenListNO", childrenListNO).attr("pos", pos).prepend(subLevelListIcon).prepend(listIcon).addClass(listClass));
            });
            self.append(subLevelList);
            return self;
        },
        getOffset : function(self, obj, position)
        {
            var leftValue = 0, topValue = 0, leftOffset = 0, topOffset = 0, pos = (position === undefined? "bottom" : position);
            if(self.css("position") != "static")
            {
                leftOffset = self.offset().left;
                topOffset = self.offset().top;
            }
            switch(pos)
            {
                case "bottom":
                    leftValue = obj.offset().left - leftOffset;
                    topValue = obj.offset().top - topOffset + obj.outerHeight();
                    break;
                case "right":
                    leftValue = obj.offset().left - leftOffset + obj.outerWidth();
                    topValue = obj.offset().top - topOffset + 2;
                    break;

            }
            return {left : leftValue, top : topValue};
        },
        hideList : function(target)
        {
            var self = this, opts = self.opts;
            if(target.parents(".uiTopLevel").length != 0)
            {
                $(".uiSubLevel", self).stop(true, true)[opts.hide]();
            }
            else
            {
                target.parents().prevAll(".uiSubLevel").stop(true, true)[opts.hide]();
            }
            return self;
        },
        hideAllSubList : function()
        {
            var self = this, opts = self.opts;
            if(opts.hideFlag)
            {
                $(".uiSubLevel", self).stop(true, true)[opts.hide]();
                $(".uiTopLevel li", self).removeClass(opts.listHoverClass);                
                if($.isFunction(opts.hideAllSubList))
                {
                    opts.hideAllSubList.call(self);
                }
            }
            return self;
        }
    });
})(jQuery);// JavaScript Document
;
(function($)
{
    $.angela.progressBar = $.angela.progressBar || {};
    $.angela.progressBar.defaults = {
        progressBarClass : $.angela.selectedGradientBG["10"] + " uiBlueBorder",
        progressBlockClass : "ui10LightBlueGradientBG",
        disabled : false,
        blockWidth : 12,
        value : 0,
        progressBarLength : 0,
        type : "normal",
        scrollTime : 3000,
        scrollValue : 0.19,
        
        
        scrolling : false,
        widgetKey : null
    };

    
    $.fn.progressBar = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.progressBar.defaults, init : $$.init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.extend($.angela.progressBar, $.angela.widget, {
        init : function(opts)
        {
            var self = this;

            var progressValue = $('<div class="progressValue"></div>');
            var blockTotal = Math.ceil(self.width() / opts.blockWidth);
            for(var i = 0; i < blockTotal; i++)
            {
                progressValue.append($('<div class="progressBlock"></div>').addClass(opts.progressBlockClass).width(opts.blockWidth));
            }
            opts.progressBarLength = self.addClass("uiProgressBar uiWidget " + opts.progressBarClass).append(progressValue).width();
            if(opts.disabled)
            {
                $$.disable.call(self);
            }
            if(opts.type == "scroll")
            {
                $$.val.call(self, opts.scrollValue);
                $$.scroll.call(self);
            }
            else
            {
                $$.val.call(self, opts.value);
            }
            return self;
        },
        val : function(value)
        {
            var self = this, opts = self.opts;
            if(value === undefined)
            {
                return opts.value;
            }
            opts.value = value > 1 ? 1 : (value < 0 ? 0 : value);
            value = opts.value == 1? 1.1 : opts.value;
            self.children(".progressValue").width(opts.progressBarLength * value);
            return self;
        },
        scroll : function()
        {
            var self = this, opts = self.opts;
            if(opts.type != "scroll" || opts.scrolling)
            {
                return self;
            }
            var obj = self.children(".progressValue");
            var marginLeftValue = opts.progressBarLength - (obj.width() + parseInt(obj.css("margin-left")));
            opts.scrolling = true;
            obj.animate({marginLeft : marginLeftValue}, opts.scrollTime, function()
            {
                opts.scrolling = false;
                if($$.widgetOptions(opts.widgetKey) != null)
                {
                    $$.scroll.call(self);
                }
            });
            return self;
        },
        stopScroll : function()
        {
            var self = this, opts = self.opts;
            if(opts.type != "scroll")
            {
                return self;
            }
            opts.scrolling = false;
            self.children(".progressValue").stop();
            return self;
        }
    });
})(jQuery);

// JavaScript Document
;
(function($)
{
    $.angela.list = $.angela.list || {};
    $.angela.list.defaults = {
        
        titleBarClass : $.angela.selectedGradientBG["30"],
        titleIcon : null,
        disabled : false,
        listClass : "uiBlueBigBorder uiCornerAll uiBlueBoxShadow",
        listItemClass : "uiListItem",
        listItemHoverClass : "ui40LightBlueGradientBG",
        listMoreClass : "ui40GrayGradientBG",
        listBackClass : "ui40GrayGradientBG",
        listItemSelectedClass : "ui40BlueGradientBG",        
        
        
        widgetKey : null,
        listWidth : 0,
        titleBarHTML : '<div class="uiListTitleBar uiNoSelectText"><span></span></div>',
        backItemHTML : '<li class="uiListBack"></li>',
        moreItemHTML : '<span class="uiListMoreBtn uiArrowRight"></span>',
        
        
        click : null
    };

    
    $.fn.list = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.list.defaults, init : $$.init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.extend($.angela.list, $.angela.widget, {
        init : function(opts)
        {
            var self = this, titleBar = null, title = self.attr("title");
            self.addClass("uiList uiWidget " + opts.listClass).children("div:first").addClass("uiListContent");
            
            if(title)
            {
                titleBar = $(opts.titleBarHTML).addClass(opts.titleBarClass).children("span").html(title).end();
                if(opts.titleIcon)
                {
                    titleBar.prepend($('<span class="uiTitleIcon" />').addClass(opts.titleIcon));
                }
                self.prepend(titleBar);
            }
            self.find("li").each(function()
            {
                var obj = $(this);
                if(obj.attr("number"))
                {
                    obj.addClass("uiListMore " + opts.listMoreClass).prepend(opts.moreItemHTML);

                }
                else
                {
                    obj.addClass(opts.listItemClass);
                }
            })
            var ulHeight = self.height() - $(">.uiListTitleBar", self).outerHeight(true);
            opts.listWidth = $(">.uiListContent > ul", self).filter(":gt(0)").hide().end().height(ulHeight).width();
            
            $$.initEvent.call(self);
            if(opts.disabled)
            {
                $$.disable.call(self);
            }
            return self;
        },
        
        initEvent : function()
        {
            var self = this, opts = self.opts;
            $(">.uiListContent > ul", self).bind("click.uiList", function(e)
            {
                if(opts.disabled)
                {
                    return false;
                }
                var target = $(e.target);
                if(target.attr("tagName").toUpperCase() != "LI")
                {
                    target = target.parent();
                }
                if(target.hasClass("uiListMore"))
                {
                    var number = target.attr("number");
                    var currentObj = $(this);
                    var currentNumber = currentObj.attr("number");
                    var obj = currentObj.siblings("[number='" + number + "']").show();
                    if(obj.length == 0)
                    {
                        return ;
                    }
                    obj.prepend($(opts.backItemHTML).addClass(opts.listBackClass).attr("number", currentNumber).html('<span class="uiListBackBtn uiArrowLeft"></span>' + target.text()));
                    var marginLeftValue = $.style(this, "marginLeft");
                    currentObj.animate({marginLeft : -opts.listWidth}, function()
                    {
                        $(this).hide();
                        $.style(this, "marginLeft", marginLeftValue);
                    });
                }
                else if(target.hasClass("uiListBack"))
                {
                    var number = target.attr("number");
                    var obj = $(this).siblings("[number='" + number + "']");
                    if(obj.length == 0)
                    {
                        return ;
                    }
                    var marginLeftValue = $.style(obj[0], "marginLeft");
                    obj.css("marginLeft", -opts.listWidth).show().animate({marginLeft : 0}, function()
                    {
                        target.parent("ul").hide().end().remove();
                        $.style(this, "marginLeft", marginLeftValue);
                    });
                }
                else
                {
                    target.removeClass(opts.listItemHoverClass).addClass(opts.listItemSelectedClass)
                        .siblings("." + opts.listItemSelectedClass).toggleClass(opts.listItemClass + " " + opts.listItemSelectedClass);
                    //target.siblings("." + opts.listItemSelectedClass).andSelf().toggleClass("uiListItem " + opts.listItemSelectedClass);
                    if($.isFunction(opts.click))
                    {
                        if(opts.click.call(target[0], e) === false)
                        {
                            return false;
                        }
                    }
                }
            })
            .bind("mouseover.uiList", function(e)
            {
                if(opts.disabled)
                {
                    return false;
                }
                var target = $(e.target);
                if(target.attr("tagName").toUpperCase() != "LI")
                {
                    target = target.parents("li");
                }

                if(target.hasClass(opts.listItemClass))
                {
                    target.removeClass(opts.listItemClass).addClass(opts.listItemHoverClass);
                }
            })
            .bind("mouseout.uiList", function(e)
            {
                if(opts.disabled)
                {
                    return false;
                }
                var target = $(e.target);
                if(target.attr("tagName").toUpperCase() != "LI")
                {
                    target = target.parents("li")
                }
                if(target.hasClass(opts.listItemHoverClass))
                {
                    target.removeClass(opts.listItemHoverClass).addClass(opts.listItemClass);
                }
            });
        }
    });
})(jQuery);
// JavaScript Document
;
(function($)
{
    $.angela.datePicker = $.angela.datePicker || {};

    $.angela.datePicker.defaults = {
        datePickerClass : "uiBlueBigBorder uiCornerAll uiBlueBoxShadow",
        monthAndYearClass : $.angela.selectedGradientBG[40] + " uiCornerTop",
        dateStr : null,
        weekViewArr : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        //monthViewArr : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthViewArr : ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        dayClass : "uiDayTD",
        specialDayList : null,
        hoverClass : "ui40LightBlueGradientBG",
        todayClass : "ui40BlueGradientBG",
        originalDateClass : "ui40RoyalBlueGradientBG",
        monthAndYearListClass : "uiBlueCss3GradientBG uiBlueBorder uiCornerAll",
        monthAndYearItemHoverClass : "ui30LightBlueGradientBG",
        
        select : null,
        
        tableWidth : 0,
        currentDate : null,
        dateObj : {
            year : null,
            month : null,
            day : null,
            week : null
        },
        origDateObj : null,
        dateContainerHTML : '<div class="uiDateContainer"></div>',
        monthAndYearHTML : '<div class="uiMonthAndYearContainer"><span class="uiPrevMonth uiArrowLeft"></span><span class="uiMonthAndYear"><span class="uiMonth"><span></span></span><span class="uiYear"><span></span></span></span><span class="uiNextMonth uiArrowRight"></span></div>',
        dayContainerHTML : '<div class="uiDayContainer"></div>',
        weeksHTML : null
    };
    $.fn.datePicker = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.datePicker.defaults, init : $$.init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.extend($.angela.datePicker, $.angela.widget, {
        init : function(opts)
        {
            var self = this;
            self.addClass("uiDatePicker uiWidget " + opts.datePickerClass);
            if(opts.dateStr != null)
            {
                opts.currentDate = new Date(opts.dateStr);
                if(isNaN(opts.currentDate.getFullYear()))
                {
                    opts.currentDate = new Date();
                }
                else
                {
                    opts.origDateObj = {
                        year : opts.currentDate.getFullYear(),
                        month : opts.currentDate.getMonth(),
                        day : opts.currentDate.getDate()
                    };
                }
            }
            else
            {
                opts.currentDate = new Date();
            }
            var dateContainer = $(opts.dateContainerHTML);
            var monthAndYearContainer = $(opts.monthAndYearHTML).addClass(opts.monthAndYearClass);
            var dayContainer = $(opts.dayContainerHTML);            
            self.append(dateContainer.append(monthAndYearContainer).append(dayContainer));
            opts.weeksHTML = "<tr>";
            for(var i = 0; i < 7; i++)
            {
                opts.weeksHTML += ('<td class="uiWeekTD">' + opts.weekViewArr[i] + "</td>");
            }
            opts.weeksHTML += "</tr>";
            $$.setDate.call(self);

            var monthListHTML = '<ul class="uiMonthList ' + opts.monthAndYearListClass + '">';
            for(var i = 0, len = opts.monthViewArr.length; i < len; i++)
            {
                monthListHTML += ("<li>" + opts.monthViewArr[i] + "</li>");
            }
            monthListHTML += "</ul>";
            $("> .uiMonthAndYear > .uiMonth", monthAndYearContainer).append(monthListHTML); 
            var yearListHTML = '<ul class="uiYearList ' + opts.monthAndYearListClass + '">';
            var currentYear = opts.currentDate.getFullYear();
            for(var i = 6; i > -6; i--)
            {
                yearListHTML += ("<li>" + (currentYear + i) + "</li>");
            }
            yearListHTML += "</ul>";
            $("> .uiMonthAndYear > .uiYear", monthAndYearContainer).append(yearListHTML);
            
            var isHidden = self.is(":hidden");
            if(isHidden)
            {
                self.show();
            }
            self.width($("> .uiDateContainer > .uiDayContainer > table", self).outerWidth(true) + 10);
            if(isHidden)
            {
                self.hide();
            }
            $$.initEvent.call(self);
            return self;
        },
        initEvent : function()
        {
            var self = this, opts = self.opts;
            $(">.uiDateContainer >.uiDayContainer", self).bind({
                "mouseover.uiDatePicker" : function(e)
                {
                    var target = $(e.target).parent();
                    if(target.hasClass("uiNormalTD"))
                    {                        
                        target.removeClass("uiNormalTD").addClass(opts.hoverClass);
                    }
                },
                "mouseout.uiDatePicker" : function(e)
                {
                    var target = $(e.target).parent();
                    if(target.hasClass(opts.hoverClass))
                    {
                        target.removeClass(opts.hoverClass).addClass("uiNormalTD");
                    }
                },
                "click.uiDatePicker" : function(e)
                {
                    if(opts.disabled)
                    {
                        return false;
                    }
                    var target = $(e.target).parent();
                    if(target.hasClass("uiNormalTD") || target.hasClass(opts.hoverClass))
                    {
                        var monthStr = opts.dateObj.month + 1;
                        if(monthStr < 10)
                        {
                            monthStr = "0" + monthStr;
                        }
                        var dateStr = monthStr + "/" + target.text() + "/" + opts.dateObj.year;
                        if($.isFunction(opts.select))
                        {
                            opts.select.call(self, dateStr);
                        }
                    }
                    $("> .uiDateContainer > .uiMonthAndYearContainer", self).find(".uiMonthList, .uiYearList").hide();
                }
            });
            $(">.uiDateContainer >.uiMonthAndYearContainer", self).click(function(e)
            {
                if(opts.disabled)
                {
                    return false;
                }
                var target = $(e.target);
                if(target.hasClass("uiPrevMonth"))
                {
                    opts.currentDate.setMonth(opts.currentDate.getMonth() - 1);        
                    $$.setDate.call(self, "prev");  
                }
                else if(target.hasClass("uiNextMonth"))
                {
                    opts.currentDate.setMonth(opts.currentDate.getMonth() + 1); 
                    $$.setDate.call(self, "next");
                }
                else if(target.parent().hasClass("uiMonth"))
                {
                    target.siblings(".uiMonthList").slideToggle();
                    $("> .uiDateContainer > .uiMonthAndYearContainer", self).find(".uiYearList").hide();
                    return false;
                }
                else if(target.parent().hasClass("uiYear"))
                {
                    target.siblings(".uiYearList").slideToggle();
                    $("> .uiDateContainer > .uiMonthAndYearContainer", self).find(".uiMonthList").hide();
                    return false;
                }
                else if(target.parent(".uiMonthList").length)
                {
                    var month = $.inArray(target.text(), opts.monthViewArr);
                    if(month != -1)
                    {        
                        var status = "next"; 
                        var currentMonth = opts.currentDate.getMonth();
                        if(currentMonth != month)
                        {                            
                            if(currentMonth > month)
                            {
                                status = "prev";
                            }
                            opts.currentDate.setMonth(month);
                            $$.setDate.call(self, status);
                        }                        
                    }
                    target.parent(".uiMonthList").hide();
                    return false;
                }
                else if(target.parent(".uiYearList").length)
                {
                    var year = parseInt(target.text());
                    var currentYear = opts.currentDate.getFullYear();
                    if(currentYear != year)
                    {            
                        var status = "next";             
                        target.siblings().andSelf().each(function(i)
                        {
                           $(this).text(year + 6 - i); 
                        });
                        if(currentYear > year)
                        {
                            status = "prev";
                        }
                        opts.currentDate.setFullYear(year);
                        $$.setDate.call(self, status);
                    }
                    target.parent(".uiYearList").hide();
                    return false;
                }
                $("> .uiDateContainer > .uiMonthAndYearContainer", self).find(".uiMonthList, .uiYearList").hide();
            })
            .find(".uiMonthList").add($(">.uiDateContainer >.uiMonthAndYearContainer .uiYearList", self)).bind({
                mousewheel : function(e, delta)
                {
                    if(delta < 0)
                    {
                        $(this).children(":lt(6)").hide();
                    }
                    else
                    {
                        $(this).children(":lt(6)").show();
                    }
                    return false;
                },
                mouseover : function(e)
                {
                    var target = $(e.target);
                    target.addClass(opts.monthAndYearItemHoverClass);
                },
                mouseout : function(e)
                {
                    var target = $(e.target);
                    target.removeClass(opts.monthAndYearItemHoverClass);
                }
            });
            self.bind("mousewheel.uiDatePicker", function(e, delta)
            {
                if(delta < 0)
                {
                    $(">.uiDateContainer >.uiMonthAndYearContainer >.uiNextMonth", this).click();
                }
                else
                {
                    $(">.uiDateContainer >.uiMonthAndYearContainer >.uiPrevMonth", this).click();
                }
            });
            return self;
        },
        setDate : function(status)
        {
            var self = this, opts = self.opts;
            
            opts.dateObj.year = opts.currentDate.getFullYear();
            opts.dateObj.month = opts.currentDate.getMonth();
            opts.dateObj.day = opts.currentDate.getDate();
            opts.dateObj.week = opts.currentDate.getDay();
            
            var today = new Date();
            var todayObj = {
                year : today.getFullYear(),
                month : today.getMonth(),
                day : today.getDate()
            }
            var todayFlag = false;
            var origDateFlag = false;
            var html = '<table cellspacing="0" cellpadding="0"><tbody>';
            var firstDayWeek = (opts.dateObj.week - opts.dateObj.day + 36) % 7;
            var dayContainer = $(">.uiDateContainer >.uiDayContainer", self);
            var monthAndYearContainer = $(">.uiDateContainer >.uiMonthAndYearContainer", self); 
            

            var monthStr = opts.dateObj.month + 1;
            if(monthStr < 10)
            {
                monthStr = "0" + monthStr;
            }
            
            if(todayObj.year == opts.dateObj.year && todayObj.month == opts.dateObj.month) 
            {
                todayFlag = true;
            }

            if(opts.origDateObj != null)
            {
                if(opts.origDateObj.year == opts.dateObj.year && opts.origDateObj.month == opts.dateObj.month)
                {
                    origDateFlag = true;
                }
            }        
            monthAndYearContainer.find("> .uiMonthAndYear > .uiMonth > span:first").html(opts.monthViewArr[opts.dateObj.month]).end().find("> .uiMonthAndYear > .uiYear > span:first").html(opts.dateObj.year);
            html += opts.weeksHTML;
            var total = 30;
            if(opts.dateObj.month == 1)
            {
                total = 28;
                if(opts.dateObj.year % 400 == 0 || (opts.dateObj.year % 4 == 0 && opts.dateObj.year % 100 != 0))
                {
                    total = 29;
                }
            }
            else if(opts.dateObj.month % 2 == 0)
            {
                total = 31;
            }
            var day = 1;
            var totalTD = Math.ceil((total + firstDayWeek) / 7 ) * 7;
            for(var i = 0; i < totalTD; i++)
            {
                if(i % 7 == 0)
                {
                    html += "<tr>";
                }
                if(i < firstDayWeek || day > total)
                {
                    html += ("<td></td>");
                }
                else
                {
                    var dayStr = day;
                    if(dayStr < 10)
                    {
                        dayStr = "0" + dayStr;
                    }
                    var tdClass = "uiNormalTD " + opts.dayClass;
                    if(todayFlag && day == todayObj.day)
                    {
                        tdClass += " uiTodayTD " + opts.todayClass;                        
                    }
                    else if(origDateFlag && day == opts.origDateObj.day)
                    {
                        tdClass += " uiTodayTD " + opts.originalDateClass;
                    }
                    var dayClass = "";
                    var title = "";
                    if(opts.specialDayList != null)
                    {
                        var dateStr = monthStr + "/" + dayStr + "/" + opts.dateObj.year;
                        if(opts.specialDayList[dateStr] !== undefined)
                        {
                            dayClass = opts.specialDayList[dateStr].specialClass;
                            title = opts.specialDayList[dateStr].desc;
                        }
                    }
                    html += ('<td class="'+ tdClass + '"><div class="' + dayClass + '" title="' + title + '">' + dayStr + "</div></td>");
                    day++;
                }
                if(i % 7 == 6)
                {
                    html += "</tr>";
                }
            }
            html += '</tbody></table>';
            var newTable = $(html);
            if(status === undefined)
            {                
                dayContainer.empty().append(newTable);
            }
            else if(status == "prev")
            {                
                if(opts.tableWidth == 0)
                {
                    opts.tableWidth = $(">.uiDateContainer >.uiDayContainer >table", self).outerWidth(true);
                }
                var oldTalbe = dayContainer.children("table");
                dayContainer.prepend(newTable.css("marginLeft", -opts.tableWidth));
                newTable.animate({marginLeft : 0}, function()
                {
                    oldTalbe.remove();
                });
            }
            else
            {
                if(opts.tableWidth == 0)
                {
                    opts.tableWidth = $(">.uiDateContainer >.uiDayContainer >table", self).outerWidth(true);
                }
                var oldTalbe = dayContainer.children("table");
                dayContainer.append(newTable);
                oldTalbe.animate({marginLeft : -opts.tableWidth}, function()
                {
                    oldTalbe.remove();
                }); 
            }
            return self;            
        },
        setSpecialDayList : function(dayList)
        {
            var self = this, opts = self.opts; 
            opts.specialDayList = dayList;
            if($$.checkView(dayList, opts.currentDate))
            {
                $$.setDate.call(self);  
            }     
            return self;       
        },
        addSpecialDayList : function(dayList)
        {
            var self = this, opts = self.opts; 
            opts.specialDayList = $.extend({}, opts.specialDayList, dayList);
            if($$.checkView(dayList, opts.currentDate))
            {
                $$.setDate.call(self);  
            } 
            return self;
        },
        removeSpecialDayList : function(key)
        {
            var self = this, opts = self.opts;
            if(opts.specialDayList != null & opts.specialDayList[key] !== undefined)
            {
                var dayList = {};
                dayList[key] = opts.specialDayList[key];
                opts.specialDayList[key] = null;
                delete opts.specialDayList[key];
                if($$.checkView(dayList, opts.currentDate))
                {
                    $$.setDate.call(self);  
                } 
            }
            return self;
        },
        checkView : function(dayList, currentDate)
        {
            var view = false;
            var year = currentDate.getFullYear();
            var month = currentDate.getMonth() + 1;
            
            $.each(dayList, function(key, value)
            {
                var dateArr = key.split("/");
                if(parseInt(dateArr[0]) == month && dateArr[2] == year)
                {
                    view = true;
                    return false;
                }
            });
            return view;
        }
    });
})(jQuery);// JavaScript Document
;
(function($)
{
    $.angela.tip = $.angela.tip || {};
    $.angela.tip.defaults = {
        
        tipClass : "uiCornerAll",
        borderColor : "#6f829f",
        backgroundColor : "#f3f3f3",
        target : null,
        direction : "top",
        positionValue : "44%",
        
        tipWidth : 0,
        tipHeight : 0,
        arrowOffset : 10,
        defaultTipText : "无提示消息",
        targetWidget : null,
        
        widgetKey : null,
        tipHTML : '<div class="uiTipArrow"></div><div class="uiTipArrow"></div>'
    };

    
    $.fn.tip = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.tip.defaults, init : $$.init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.extend($.angela.tip, $.angela.widget, {
        init : function(opts)
        {
            var self = this;
            self.addClass("uiTip uiCornerAll uiWidget").children().addClass("uiTipContent").end().prepend(opts.tipHTML);
            var cssShow = { position: "absolute", visibility: "hidden", display: "block" };
            $.swap( self[0], cssShow, function()
            {
                $$.setPosition.call(self);
            });       
            $$.initEvent.call(self);
            return self.hide();
        },
        
        initEvent : function()
        {
            var self = this, opts = self.opts;
            opts.target.bind("mouseenter." + opts.widgetKey, function()
            {
                self.show();
            })
            .bind("mouseleave." + opts.widgetKey, function()
            {
                self.hide();
            });            
        },
        
        setPosition : function()
        {
            var self = this, opts = self.opts, tip = opts.tip;
            
            var leftValue = opts.target.offset().left;
            var topValue = opts.target.offset().top;
            var arrowList = self.find(".uiTipArrow");
            var arrow1 = arrowList.eq(0);
            var arrow2 = arrowList.eq(1);
            var setting = {
                "top" : {
                    border : "border-top-color",
                    borderNone : "border-bottom"
                },
                "bottom" : {
                    border : "border-bottom-color",
                    borderNone : "border-top"
                }
            };
            if(opts.tipWidth != 0)
            {
                self.width(opts.tipWidth);
            }
            else
            {
                opts.tipWidth = self.width();
            }
            if(opts.tipHeight != 0)
            {
                self.height(opts.tipHeight);
            }
            else
            {
                opts.tipHeight = self.height();
            }
            self.css({"border-color" : opts.borderColor, "background-color" : opts.backgroundColor});
            arrow1.css(setting[opts.direction].border, opts.borderColor);
            arrow2.css(setting[opts.direction].border, opts.backgroundColor);
            arrowList.css(setting[opts.direction].borderNone, "none");
            leftValue += (opts.target.outerWidth() / 2 - opts.tipWidth / 2);
            if(opts.direction == "bottom")
            {
                self.css({"left" : leftValue, "top" : topValue + opts.target.height() + opts.arrowOffset});
                var arrow1TopValue = -opts.arrowOffset;
                var arrow2TopValue = arrow1TopValue + 1;
                arrow1.css({"top" : arrow1TopValue, "left" : opts.positionValue});
                arrow2.css({"top" : arrow2TopValue, "left" : opts.positionValue});
            }
            else if(opts.direction == "top")
            {                
                self.css({"left" : leftValue, "top" : topValue - opts.tipHeight - opts.arrowOffset});
                var arrow1TopValue = opts.tipHeight;
                var arrow2TopValue = arrow1TopValue - 1;
                arrow1.css({"top" : arrow1TopValue, "left" : opts.positionValue});
                arrow2.css({"top" : arrow2TopValue, "left" : opts.positionValue});
            }
            return self;
        },
        
        beforeDestroy : function()
        {
            var self = this, opts = self.opts;
            opts.target.unbind("." + opts.widgetKey);
            return self;
        }
    });
})(jQuery);;
(function($)
{
    $.angela.hack = $.angela.hack || {};
    var $$ = $.extend($.angela.hack, {
        fixedPosition : function(element)
        {
            if($.browser.msie && $.browser.version == "6.0")
            {
                var scrollTimer = 0;
                var obj = $(element);
                var originTopValue = obj.offset().top;
                var originLeftValue = obj.offset().left;
                $(window).scroll(function()
                {
                    clearTimeout(scrollTimer);
                    obj.hide();
                    scrollTimer = setTimeout(function()
                    {
                        var topValue = originTopValue + $(window).scrollTop();
                        var leftValue = originLeftValue + $(window).scrollLeft();
                        obj.css({position : "absolute", top : topValue, left : leftValue}).show();
                        scrollTimer = 0;
                    }, 300);
                });
            }
        }
    });
})(jQuery);
// JavaScript Document
;
(function($)
{
    $.angela.plugIn = $.angela.plug || {};
    $.extend($.angela.plugIn, {
        scrollBar : function(objList)
        {
            
            var returnObj = $();
            objList.each(function()
            {
                var self = $(this);
                var heightValue = $.style(self[0], "height");
                var overflowValue = $.style(self[0], "overflow");
                var originHeight = self.height();
                self.css({overflow : "auto", height : "auto"});
                var realHeight = self.height();
                $.style(self[0], "overflow", overflowValue);
                $.style(self[0], "height", heightValue);
                if(originHeight == realHeight)
                {
                    return true;
                }
                var leftValue = self.offset().left + self.outerWidth() - 12;
                var topValue = self.offset().top
                var sliderLengthValue = parseInt(originHeight / realHeight * originHeight);
                var stepValue = Math.min((originHeight - 20) / (realHeight - originHeight), 1);
                var slideObj = $("<div></div>").css({position : "absolute", height : originHeight, width : 10, left : leftValue, top : topValue}).appendTo(self)
                .slide({
                    slideClass : "",
                    sliderClass : "uiBlackBorder ui10LightBlueGradientBGVertical uiCornerAll",
                    mode : "vertical",
                    sliderLeft : 1,
                    sliderLength : sliderLengthValue,
                    noUserEvent : true,
                    slide : function()
                    {
                        slideObj.fadeOut();
                    }
                }).hide();
                self.bind("mousewheel", function(e, delta)
                {
                    var value = slideObj.slide("value");
                    if(delta > 0)
                    {
                        value -= parseInt(stepValue * 100);
                    }
                    else
                    {
                        value += parseInt(stepValue * 100);
                    }
                    slideObj.stop(true, true).show().slide("value", value);
                    return false;
                });
                returnObj.add(slideObj);
            });
            return returnObj;
        }
    });
})(jQuery);
