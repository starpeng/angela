
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
        version : "0.7.1",
        msie6 : $.browser.msie && $.browser.version == "6.0",
        defaultAnimateDuration : 300,
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
        widgetType : {
            uiDialog : "dialog",
            uiTabs : "tabs",
            uiSlide : "slide",
            uiAccordion : "accordion",
            uiButtonSet : "buttonSet",
            uiDorpDownList : "dropDownList",
            uiProgressBar : "progressBar",
            uiTip : "tip",
            uiList : "list",
            uiDatePicker : "datePicker",
            uiTree : "tree",
            uiGrid : "grid"
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
        
        getRandomKey : function(length)
        {
            return  this.randomKey.getRandomStr(length);
        }
    });
})(jQuery);

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

;
(function($)
{
    $.each(['borderRadius'], function(i, attr)
    {
        $.fx.step[attr] = function(fx)
        {
            //fx.elem.style["OBorderRadius"] = fx.pos * (fx.end - fx.start) + "px";
        };
    });
    
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
        }
        while ( elem = elem.parentNode );

        return getRGB(color);
    }
    
    var borderRadiusKey = "borderRadius";
    if($.browser.webkit)
    {
        borderRadiusKey = "WebkitBorderRadius";
    }
    else if($.browser.mozilla)
    {
        borderRadiusKey = "MozBorderRadius";
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

        },
        borderRadius : function(fx)
        {
            fx.elem.style[borderRadiusKey] = fx.pos * (fx.end - fx.start) + "px";
        }
    });

    
})(jQuery);// JavaScript Document
;
(function($)
{
    $.angela.widget = $.angela.widget || {};
    var $$ = $.extend($.angela.widget, {
        
        initWidget : function()
        {
            var self = this, args = Array.prototype.slice.call(arguments), widgetSetting = args.pop(), options, opts, key;            
            
            if(args.length == 0 || $.isPlainObject(args[0]))
            {
                self.each(function()
                {
                    var obj = $(this); 
                    if(obj.attr("widget") !== undefined)
                    {
                        return ;
                    }
                    options = args.length == 0 ? {} : args[0];        
                    opts =  $.extend({}, widgetSetting.defaults, options);
                    opts.clone = obj.clone();
                    obj.opts = opts;
                    opts.widgetKey = $.angela.getRandomKey();
                    obj.attr("widget",opts.widgetKey);
                    $$.widgetOptions(opts.widgetKey, opts);
                    var visibilityValue = $.style(obj[0], "visibility");
                    obj.css("visibility", "hidden");
                    widgetSetting.init.call(obj);
                    $.style(obj[0], "visibility", visibilityValue);
                });
            }
            
            else 
            if(typeof args[0] == "string")
            {
                var returnValueArr = [];
                self.each( function(i)
                {
                    var obj = $(this), key = obj.attr("widget"), widgetOptions = $$.widgetOptions(key);
                    if(widgetOptions != null)
                    {
                        obj.opts = widgetOptions;
                        returnValueArr.push($$.funcHandle.apply(obj, args));
                    }
                });
                var value = returnValueArr;
                if(value[0] !=null && value[0].jquery !== undefined)
                {
                    value = $();
                    for(var i = 0, len = returnValueArr.length; i < len; i++)
                    {
                        value = value.add(returnValueArr[i]);
                    }
                }
                else if(value.length == 1)
                {
                    value = value[0];
                }
                return value;
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
            var name = null;
            $.each($.angela.widgetType, function(key, value)
            {
                if(self.hasClass(key))
                {
                    name = value;
                    return false;
                }
            });
            if(name == null)
            {                
                $.each(self.attr("class").split(" "), function(i, value)
                {
                    if(value.substring(0, 2) == "ui")
                    {
                        if(value == "uiWidget")
                        {
                            return ;
                        }
                        name = value.charAt(2).toLowerCase() + value.substring(3);
                        if($.angela[name] !== undefined)
                        {
                            return false;
                        }
                        name = null;
                    }
                });
            }
            return name;
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
            
            var self = this;
            self.find(".uiWidget").each( function()
            {
                var obj = $(this), key = obj.attr("widget"), widgetOptions = $$.widgetOptions(key);
                if(widgetOptions != null)
                {
                    obj.opts = widgetOptions;
                    widgetDestroy.call(obj, revert);
                }
            });
            return widgetDestroy.call(self, revert);
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
        },
        min : function(target, e)
        {
            var self = this, opts = self.opts;
            if($.isFunction(opts.beforeMin))
            {
                if(opts.beforeMin.call(self[0], target, e) === false)
                {
                    return self;
                }
            }
            $(">.uiTitleBar .uiMinBtn", self).removeClass("uiMinBtn").addClass("uiResumeBtn");
            opts.minStatusHeight = self.find("> .uiTitleBar").outerHeight(true);
            opts.originHeight = self.height();
            opts.originWidth = self.width();
            if(opts.resizable)
            {
                $(".uiResizable", self).hide();
            }
            var positionStr = self.css("position");
            var animateTime = opts.animateTime || $.angela.defaultAnimateDuration;
            if(positionStr === "static" || positionStr === "relative")
            {
                opts.overflowStatus = self.css("overflow");
                //self.height(opts.dlgMinHeight).css("overflow", "hidden");
                self.css("overflow", "hidden").animate({height : opts.minStatusHeight}, animateTime);
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
                opts.originPosition = oldPos;
                positionStr = "fixed";
                
                if($.browser.msie && $.browser.version == "6.0")
                {
                    positionStr = "absolute";
                }
                var temOffset = self.offset();
                self.css({right : null, bottom : null, position : positionStr, left : temOffset.left, top : temOffset.top}).animate({height : opts.minStatusHeight, width : opts.minStatusWidth, left : 0, top : 0}, animateTime);
            }
            if($.isFunction(opts.min))
            {
                if(opts.min.call(self[0], target, e) === false)
                {
                    return self;
                }
            }
            return self;
        },
        resume : function(target, e)
        {
            var self = this, opts = self.opts;            

            if($.isFunction(opts.beforeResume))
            {
                if(opts.beforeResume.call(self[0], target, e) === false)
                {
                    return self;
                }
            }
            $(">.uiTitleBar .uiResumeBtn", self).removeClass("uiResumeBtn").addClass("uiMinBtn");
            if(opts.resizable)
            {
                $(".uiResizable", self).show();
            }
            var positionStr = self.css("position");
            if(positionStr === "static" || positionStr === "relative")
            {
                self.height(opts.originHeight).width(opts.originWidth).css("overflow", opts.overflowStatus);
            }
            else
            {
                if(opts.originPosition["position"] == "absolute")
                {
                    opts.originPosition["top"] = parseInt(opts.originPosition["top"]) + $(document).scrollTop();
                }
                var tmpSetting = $.extend({}, opts.originPosition, {height : opts.originHeight, width : opts.originWidth});
                self.css(tmpSetting);
            }
            if($.isFunction(opts.resume))
            {
                if(opts.resume.call(self[0], target, e) === false)
                {
                    return self;
                }
            }
            return self;
        },
        close : function(target, e)
        {
            var self = this, opts = self.opts;
            if($.isFunction(opts.beforeClose))
            {
                if(opts.beforeClose.call(self[0], target, e) === false)
                {
                    return self;
                }
            }
            if(opts.modal)
            {
                if($.browser.msie && $.browser.version == "6.0")
                {
                    opts.selectList.css("visibility", "visible");
                }
                $(".uiMask").remove();
            }
            var animateTime = opts.animateTime || $.angela.defaultAnimateDuration;
            var animateFunc = opts.closeAnimate || "slideUp";
            self[animateFunc](animateTime, function()
            {
                if($.isFunction(opts.close))
                {
                    if(opts.close.call(self[0], target, e) === false)
                    {
                        return self;
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
            if($.isFunction(opts.beforeOpen))
            {
                if(opts.beforeOpen.call(self) === false)
                {
                    return self;
                }
            }
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
            
            if(opts.modal)
            {
                if($(".uiMask").length == 0)
                {
                    $("<div />").addClass("uiMask").appendTo("body");
                }
            }
            var animateTime = opts.animateTime || $.angela.defaultAnimateDuration;
            var animateFunc = opts.openAnimate || "slideDown";
            self[animateFunc](animateTime, function()
            {
                if($.isFunction(opts.open))
                {
                    opts.open.call(self);
                }
            });
            return self;
        }
    });
    
    

    function widgetDestroy(revert)
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
        widgetKey = self.removeClass("uiWidget").attr("widget");
        $$.removeWidgetOptions(widgetKey);
        if(revert)
        {
            opts.clone.insertAfter(self);
        }
        opts.clone = null;
        opts = null;
        return self.remove();
    }
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
            else
            if($.isPlainObject(opts.position))
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
            var posSetting = {position: "absolute", left : opts.position.left, top : opts.position.top, right : null, bottom : null};
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
            var opts = options, obj;
            if(opts.type ==="resize")
            {
                obj = self.find(".uiResizable");
                if(obj.length === 0)
                {
                    if(self.css("position") === "static")
                    {
                        self.css("position", "relative");
                    }
                    obj = $('<div class="uiResizable"></div>').appendTo(self);
                }
            }
            else
            if(opts.type === "drag")
            {
                obj = self.find(".uiDraggalbe");
                if(obj.length === 0)
                {
                    obj = self.addClass("uiDraggalbe");
                }
            }
            var mouseDownEvent = "mousedown." + opts.type;
            obj.bind(mouseDownEvent, function(e)
            {
                $$.setInteractionSetting(self, opts, e);
                return !opts.stopMouseDownPropagation;
            });
            var mouseMoveEvent = "mousemove." + opts.widget + opts.type;
            var mouseUpEvent = "mouseup." + opts.widget + opts.type;

            $(document).bind(mouseMoveEvent, function(e)
            {
                if(opts.start)
                {
                    if(opts.mask === null)
                    {
                        if($$.setInteractionMask(self, opts, e) === false)
                        {
                            return ;
                        }
                    }
                    var maskItem = opts.mask;
                    opts.doing = true;
                    var offsetX = e.clientX - opts.originClientX, offsetY = e.clientY - opts.originClientY;
                    if(opts.type === "resize")
                    {
                        var newWidth = opts.originWidth + offsetX;
                        var newHeight = opts.originHeight + offsetY;
                        if(opts.maxWidth !== null)
                        {
                            if(newWidth > opts.maxWidth)
                            {
                                newWidth = opts.maxWidth;
                            }
                        }
                        if(opts.minWidth !== null)
                        {
                            if(newWidth < opts.minWidth)
                            {
                                newWidth = opts.minWidth;
                            }
                        }
                        if(opts.maxHeight !== null)
                        {
                            if(newHeight > opts.maxHeight)
                            {
                                newHeight = opts.maxHeight;
                            }
                        }
                        if(opts.minHeight !== null)
                        {
                            if(newHeight < opts.minHeight)
                            {
                                newHeight = opts.minHeight;
                            }
                        }
                        if($.isFunction(opts.event.doing))
                        {
                            if(opts.event.doing.call(self, maskItem, newWidth, newHeight) === false)
                            {
                                return ;
                            }
                        }
                        maskItem.width(newWidth).height(newHeight);
                    }
                    else
                    if(opts.type = "drag")
                    {
                        var position = {left : opts.originPosition.left + offsetX, top : opts.originPosition.top + offsetY};
                        
                        if($.isFunction(opts.event.doing))
                        {
                            if(opts.event.doing.call(self[0], maskItem, {left : position.left, top : position.top}) === false)
                            {
                                return ;
                            }
                        }
                        maskItem.css({left : position.left, top : position.top});
                        if(opts.dest !== null)
                        {
                            if($$.checkArea(opts, position, opts.destPosition) === true)
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
                if(opts.doing === false)
                {
                    opts.start = false;
                    return ;
                }
                var maskItem = opts.mask;

                opts.start = false;
                opts.doing = false;
                if($.isFunction(opts.event.stop))
                {
                    if(opts.type === "resize")
                    {
                        if(opts.event.stop.call(self[0], opts.mask, maskItem.width(), maskItem.height()) === false)
                        {
                            return ;
                        }
                    }
                    else
                    if(opts.type === "drag")
                    {
                        var originOffset = maskItem.position();
                        if(opts.event.stop.call(self[0], opts.mask, originOffset) === false)
                        {
                            return ;
                        }
                    }
                }
                maskItem.remove();
                opts.mask = null;
            });
            return self;
        },
        setInteractionSetting : function(self, opts, e)
        {
            if(opts.disable)
            {
                return ;
            }
            opts.start = true;
            if($.isFunction(opts.event.start))
            {
                if(opts.event.start.call(self) === false)
                {
                    opts.start = false;
                    return false;
                }
            }
            if($(e.target).hasClass("uiUserBtn"))
            {
                opts.start = false;
                return false;
            }
        },
        
        setInteractionMask : function(self, opts, e)
        {
            var maskHeight = self.outerHeight(), maskWidth = self.outerWidth(), maskPosition = self.position();

            opts.originClientX = e.clientX;
            opts.originClientY = e.clientY;
            opts.outerHeight = maskHeight;
            opts.outerWidth = maskWidth;
            opts.originWidth = self.width();
            opts.originHeight = self.height();
            opts.originPosition = opts.position = maskPosition;
            if($.isFunction(opts.getUserMask))
            {
                opts.mask = opts.getUserMask.call(self[0]);
                opts.originPosition = opts.mask.position();
                if(opts.mask.length === 0)
                {
                    opts.mask = null;
                    opts.start = false;
                    return false;
                }
                else
                {
                    opts.position = opts.mask.position();
                }
            }
            else
            if(opts.originMask)
            {
                opts.mask = self.clone().css({position : "absolute", left : maskPosition.left, top : maskPosition.top}).appendTo("body");
            }
            else
            {
                var marginLeftValue = self.css("marginLeft");
                var marginTopValue = self.css("marginTop");
                opts.mask = $(opts.HTML).width(maskWidth).height(maskHeight).css({marginLeft : marginLeftValue, marginTop : marginTopValue, left : maskPosition.left, top : maskPosition.top}).hide().addClass("uiBlackBigBorder uiCornerAll").appendTo("body");
            }
            opts.mask.show();
            if(opts.type === "drag" && opts.dest !== null)
            {
                var dest = $(opts.dest);
                opts.destPosition = [];
                dest.each( function()
                {
                    var obj = $(this);
                    var pos = obj.offset();
                    var destWidth = obj.width();
                    var destHeight = obj.height();
                    opts.destPosition.push({ leftTop : [pos.left, pos.top], rightBottom : [pos.left + destWidth, pos.top + destHeight]});
                });
            }
            return true;
        },
        checkArea : function(opts, position, destPosition)
        {
            var left = position.left;
            var top = position.top;
            var right = left + opts.outerWidth;
            var bottom = top + opts.outerHeight;
            var crossFlag = false;
            for(var i = 0, len = destPosition.length; i < len; i++)
            {
                var pos = destPosition[i];
                if(!((left > pos.rightBottom[0] | right < pos.leftTop[0]) | (bottom < pos.leftTop[1] | top > pos.rightBottom[1])))
                {
                    crossFlag = true;
                    break;
                }
            }
            return crossFlag;
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
        originMask : false,
        getUserMask : null,
        stopMouseDownPropagation : false,
        
        start : false,
        originPosition : null,
        originClientX : 0,
        originClientY : 0,
        doing : false,
        step : 2,
        type : "drag",
        mask : null,
        position : null,
        outerWidth : null,
        outerHeight : null,
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
        //if(typeof options === "string")
        if(options === "destroy")
        {
            var key = self.attr("widget");
            $(document).unbind("." + key + "drag");
            self.find(".uiDraggalbe").unbind(".drag");
            if(!$.angela.widget.widgetOptions(key))
            {
                self.removeAttr("widget");
            }
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
        disable : false,
        minWidth : null,
        minHeight : null,
        maxWidth : null,
        maxHeight : null,
        originMask : false,
        getUserMask : null,
        stopMouseDownPropagation : false,
        
        start : false,
        originWidth : 0,
        originHeight : 0,
        originClientX : 0,
        originClientY : 0,
        doing : false,
        step : 2,
        type : "resize",
        mask : null,
        disable : false,
        outerWidth : null,
        outerHeight : null,
        destPosition : null,
        HTML : '<div class="uiInteractionMask uiInactive uiCornerAll uiBlackBigBorder"></div>',
        
        event : {start : null, doing : null, stop : null}
    };
    $.fn.resizable = function(options)
    {
        var self = this;
        //if(typeof options === "string")
        if(options === "destroy")
        {
            var key = self.attr("widget");
            $(document).unbind("." + key + "resize");
            self.find(".uiResizable").remove();
            if(!$.angela.widget.widgetOptions(key))
            {
                self.removeAttr("widget");
            }
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
        btnSelectedClass : $.angela.selectedGradientBG["40"] + " .uiActive",
        btnPressClass : "ui40CadetBlueGradientBG uiButtonPressed",
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
        var widgetSetting = {defaults : $.angela.buttonSet.defaults, init : init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.angela.buttonSet = $.extend({}, $.angela.widget, $.angela.buttonSet, {
        clickButton : function(index)
        {
            var self = this, opts = self.opts;
            if(index === undefined)
            {
                return $();
            }
            var obj = self.children().eq(index).click();
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
            if(text === undefined)
            {
                return obj.text();
            }
            var iconObj = obj.children(".uiIcon");
            obj.html(text).prepend(iconObj);
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
            if(icon === undefined)
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
                self.children(".uiButton").remove();
                return self;
            }
            return self.children(".uiButton").eq(index).remove();
        }
    });

    function init()
    {
        var self = this, opts = self.opts;
        
        //opts.btnSelectedClass += " uiActive";
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
            if(n !== 0)
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
                    if(floatClass === "right")
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
        if(opts.btnMargin === null)
        {
            self.addClass(opts.btnSetClass + " " + opts.btnSetBorderClass);
        }
        if(opts.vertical)
        {
            self.width(self.children().outerWidth(true));
        }
        
        initEvent.call(self);
        if(opts.disabled)
        {
            $$.disable.call(self);
        }
        if(opts.defaultSelectedItem !== null)
        {
            changeButtonStatus.call(self.children().eq(opts.defaultSelectedItem), opts);
        }
        return self;
    }

    function initEvent()
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
                    if(opts.click.call(self[0], $(this), e) === false)
                    {
                        return self;
                    }
                }
                changeButtonStatus.call(this, opts);
                return ;
            }
            var classValue;
            var funcValue ;
            switch(e.type)
            {
                case "mouseenter":
                    //classValue = opts.btnHoverClass;
                    //funcValue = "setStatusClass";
                    setStatusClass.call(this, opts, opts.btnHoverClass);
                    break;
                case "mouseleave":
                    //classValue = opts.btnHoverClass;
                    //funcValue = "removeStatusClass";
                    removeStatusClass.call(this, opts, opts.btnHoverClass);
                    break;
                case "mousedown":
                    //classValue = opts.btnPressClass;
                    //funcValue = "setStatusClass";
                    setStatusClass.call(this, opts, opts.btnPressClass);
                    break;
                case "mouseup":
                    //classValue = opts.btnPressClass;
                    //funcValue = "removeStatusClass";
                    removeStatusClass.call(this, opts, opts.btnPressClass);
                    break;
            }
            //$$[funcValue].call(this, opts, classValue);
        });
        return self;
    }

    function changeButtonStatus(opts)
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
        else
        if(obj.hasClass("uiCheckBox") || obj.hasClass("uiImgCheckBox"))
        {
            if(opts.statusClass[opts.btnHoverClass] === null)
            {
                obj.toggleClass(opts.btnSelectedClass).toggleClass(opts.btnClass);
            }
            else
            if(opts.statusClass[opts.btnHoverClass] !== opts.btnSelectedClass)
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
    }

    function setOriginClass(opts, statusClass)
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
    }

    function getOriginClass(opts, statusClass)
    {
        if(opts.statusClass[statusClass] === null)
        {
            return ;
        }
        var obj = $(this);
        $.each([opts.btnClass, opts.btnSelectedClass, opts.btnHoverClass, opts.btnPressClass], function(n, value)
        {
            obj.removeClass(value);
        });
        obj.addClass(opts.statusClass[statusClass]);
    }

    function setStatusClass(opts, statusClass)
    {
        setOriginClass.call(this, opts, statusClass);
        $(this).addClass(statusClass);
    }

    function removeStatusClass(opts, statusClass)
    {
        getOriginClass.call(this, opts, statusClass);
    }

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
        animateTime : $.angela.defaultAnimateDuration,
        titleList : null,

        
        change : null,
        close : null,
        leftClick : null,
        rightClick : null,        
        
        
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
        itemContent : '<div class="uiHidden"><p></p></div>'

    };

    
    $.fn.tabs = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.tabs.defaults, init : init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.angela.tabs = $.extend({}, $.angela.widget, $.angela.tabs, {
        addItem : function(title, content)
        {
            if(title === undefined || content === undefined)
            {
                return self;
            }
            var self = this, opts = self.opts;
            $(opts.tabsItemClass).html(title + opts.closeHTML).appendTo($("> .uiTabsList > .uiListContent > div", self));
            $(opts.itemContent).addClass("uiTabsContent uiHidden").children("p").html(content).end().appendTo(self);
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
            if(content !== null)
            {
                item.html(content);
            }
            if(title === undefined)
            {
                return item;
            }
            titleBar.html(title);
            return self;
        }
    });
    function init()
    {
        var self = this, opts = self.opts;
        
        var titleBarObj = $(opts.titleBarHTML).addClass(opts.titleBarClass).append(opts.controlHTML);
        self.addClass("uiTabs uiWidget " + opts.tabsClass).children().each( function(n)
        {
            var closeHTML = "";
            if(opts.closableArray === "all" || ($.isArray(opts.closableArray) && $.inArray(n, opts.closableArray) !== -1))
            {
                closeHTML = opts.closeHTML;
            }
            var title = null;
            var contentObj = $(this).addClass("uiTabsContent uiHidden");
            if($.isArray(opts.titleList))
            {
                title = opts.titleList[n];
            }
            title = title || contentObj.attr("title");
            $(opts.tabsItemClass).html(title + closeHTML).appendTo(titleBarObj.find("> .uiListContent > div"));
            opts.tabsItemTotal++;
        });
        self.prepend(titleBarObj);
        var tabsItemList = $("> .uiTabsList > .uiListContent > div > .uiTabsItem", self);
        if(opts.tabsItemWidth !== null)
        {
            tabsItemList.width(opts.tabsItemWidth);
        }
        if(opts.tabsItemMargin !== null)
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
        
        initEvent.call(self);
        var disableValue = opts.disabled;
        opts.disabled = false;
        $("> .uiTabsList > .uiListContent > div >.uiTabsItem", self).eq(opts.activateIndex).click();
        opts.disabled = disableValue;
        if(opts.disabled)
        {
            $$.disable.call(self);
        }
        if($.angela.msie6 === true)
        {
            $.angela.hack.fixPNG(self.find(".uiRightArrow, .uiLeftArrow"));
        }
        return self;
    }

    function initEvent()
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
                
                var obj = target.parent(".uiTabsItem");
                if($.isFunction(opts.close))
                {
                    if(opts.close.call(self[0], target, obj, e) === false)
                    {
                        return false;
                    }
                }
                if(obj.next().length !== 0)
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
                checkItemViewStatus.call(self);
                return false;
            }
            else
            if(target.hasClass("uiTabsItem"))
            {
                index = target.addClass("selected").siblings(".selected").removeClass("selected").end().index();
                var content = self.children(".uiTabsContent:eq(" + index + ")");
                if($.isFunction(opts.change))
                {
                    if(opts.change.call(self[0], target, content, e) === false)
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
            else
            if(target.hasClass("uiLeftArrow"))
            {
                clickFunc = "leftClick";
                opts.tabsItemViewIndex--;
            }
            if(opts.tabsItemViewIndex < 0)
            {
                opts.tabsItemViewIndex = 0;
                return ;
            }
            else
            if(opts.tabsItemTotal - opts.tabsItemViewTotal  < opts.tabsItemViewIndex)
            {
                opts.tabsItemViewIndex = opts.tabsItemTotal - opts.tabsItemViewTotal;
                return ;
            }
            if(clickFunc !== "")
            {
                if($.isFunction(opts[clickFunc]))
                {
                    if(opts[clickFunc].call(self[0], target, e) === false)
                    {
                        return false;
                    }
                }
                var scrollLeftValue = opts.tabsItemOuterWidth * opts.tabsItemViewIndex;
                target.siblings(".uiListContent").stop().animate({left : -scrollLeftValue}, opts.animateTime);
                checkItemViewStatus.call(self);
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
        $("> .uiTabsList > .uiListContent > div > .uiTabsItem", self).hover( function()
        {
            if(opts.disabled)
            {
                return false;
            }
            $(this).addClass(opts.tabsItemHoverClass);
        }, function()
        {
            if(opts.disabled)
            {
                return false;
            }
            $(this).removeClass(opts.tabsItemHoverClass);
        });
        return self;
    }

    function checkItemViewStatus()
    {
        var self = this, opts = self.opts;
        
        if(opts.tabsItemTotal - opts.tabsItemViewTotal  <= opts.tabsItemViewIndex)
        {
            if($.browser.opera) //opera调用hide()的时候，会导致往前移
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
    }

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
        animateTime : $.angela.defaultAnimateDuration,
        
        click : null,
        slide : null,

        
        animation : true,
        widgetKey : null,
        slideLength : 0,
        slideValue : 0,
        slideMax : 0,
        slideBegin : 0,
        panelHTML : '<div class="uiPanel"></div>',
        sliderHTML : '<div class="uiSlider"></div>',
        slideDrag : false

    };

    
    $.fn.slide = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.slide.defaults, init : init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.angela.slide = $.extend({}, $.angela.widget, $.angela.slide, {
        val : function(value, animate)
        {
            var self = this, opts = self.opts;
            if(value === undefined)
            {
                return opts.slideValue;
            }
            if(animate === undefined)
            {
                animate = true;
            }
            setSlide.call(self, value, animate, true);
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
            if(opts.mode === "vertical")
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

    function init()
    {
        var self = this, opts = self.opts;

        
        if(opts.mode === "vertical")
        {
            opts.slideClass = opts.slideClass.replace($.angela.selectedGradientBG["10"], "ui10BlueGradientBGVertical");
        }
        self.addClass("uiSlide uiWidget uiNoSelectText " + opts.slideClass).append($(opts.panelHTML).append($(opts.sliderHTML).addClass(opts.sliderClass)));
        var slider = $("> .uiPanel > .uiSlider", self);

        if(opts.mode === "vertical")
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

        
        if(!opts.noUserEvent)
        {
            initEvent.call(self);
        }
        if(opts.slideValue !== 0)
        {
            setSlide.call(self, opts.slideValue);
        }
        if(opts.disabled)
        {
            $$.disable.call(self);
        }
        return self;
    }

    function initEvent()
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
                if(opts.click.call(self[0], $(this), e) === false)
                {
                    return false;
                }
            }
            var beginValue;
            if(opts.mode === "vertical")
            {
                beginValue = e.clientY + self.parent().scrollTop();
            }
            else
            {
                beginValue = e.clientX + self.parent().scrollLeft();
            }
            var percent = (beginValue - opts.slideBegin - (opts.sliderLength >> 1)) / opts.slideMax;
            setSlide.call(self, Math.floor(percent * (opts.max - opts.min) + opts.min), opts.animation);
        })
        .bind("mousewheel.uiSlide", function(e, delta)
        {
            if(opts.disabled)
            {
                return false;
            }
            var positionStr = "left";
            if(opts.mode === "vertical")
            {
                positionStr = "top";
            }
            var percent = parseInt($("> .uiSlider", this).css(positionStr)) / opts.slideMax + opts.step * (-delta/2);
            console.log(percent);
            setSlide.call(self, Math.floor(percent * (opts.max - opts.min) + opts.min), false);
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
                if(opts.mode === "vertical")
                {
                    beginValue = e.clientY + self.parent().scrollTop();
                }
                else
                {
                    beginValue = e.clientX + self.parent().scrollLeft();
                }
                var percent = (beginValue - opts.slideBegin - (opts.sliderLength >> 1)) / opts.slideMax;
                setSlide.call(self, Math.floor(percent * (opts.max - opts.min) + opts.min), false);
            }
        })
        .bind(mouseUpEvent, function()
        {
            opts.slideDrag = false;
        });
        return self;
    }

    
    function setSlide(value, animate, jumpToEnd)
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
        if(opts.mode === "vertical")
        {
            props = {"top" : value};
        }
        else
        {
            props = {"left" : value};
        }
        if(animate)
        {
            obj.stop(true, jumpToEnd).animate(props, opts.animateTime, function()
            {
                if($.isFunction(opts.slide))
                {
                    opts.slide.call(self[0], obj, opts.slideValue);
                }
            });
        }
        else
        {
            obj.css(props);
            if($.isFunction(opts.slide))
            {
                opts.slide.call(self[0], obj, opts.slideValue);
            }
        }
        return self;
    }

})(jQuery);
;
(function($)
{
    $.fn.scrollBar = function(options)
    {
        var objList = this;
        var args = Array.prototype.slice.call(arguments);
        objList.each( function()
        {
            var self = $(this);
            if(typeof args[0] == "string")
            {
                var scrollBarObj = self.find(".uiScrollBar.uiSlide");
                if(args[0] === "destroy")
                {
                    self.unbind("." + widgetKey);
                }
                else if(args[0] === "reset")
                {                    
                    var widgetKey = scrollBarObj.attr("widget");
                    var opts = $.angela.widget.widgetOptions(widgetKey);
                    reset.call(self, opts);
                    return self;
                }
                return scrollBarObj.slide(args);
            }
            var realHeight = self.attr("scrollHeight")
            var originHeight = self.attr("clientHeight");
            if(originHeight === realHeight)
            {
                return ;
            }
            var defaults = {
                sliderLeft : 1,
                slideMinLength : 40,
                leftValue : null,
                sliderClass : "uiBlackBorder ui10LightBlueGradientBGVertical uiCornerAll",
                
                
                slideClass : "",
                mode : "vertical",
                overHeight : 0,   
                sliderLength : null,
                stepValue : null,
                slideObj : null,
                marginHeight : 0
            };
            var opts = $.extend({}, defaults, options);
            opts.slide = function(obj, value)
            {
                var slideObj = $(this);
                var widgetKey = slideObj.attr("widget");
                var opts = $.angela.widget.widgetOptions(widgetKey);
                var obj = self.children(":first");
                var marginTopValue = opts.overHeight * (value / 100);
                opts.marginHeight = marginTopValue;
                obj.css("marginTop", -marginTopValue);
            }
            opts.overHeight = realHeight - originHeight;
            var topValue, positionStr = self.css("position");
            if(opts.leftValue === null)
            {         
                if(positionStr == "absolute" || positionStr == "fixed")
                {
                    
                }       
                else
                {
                    opts.leftValue = self.offset().left + self.outerWidth() - 12;
                }
            }

            if(positionStr == "absolute" || positionStr == "fixed")
            {
                if(opts.leftValue === null)
                {
                    opts.leftValue = self.outerWidth() - 12;
                }
                topValue = 2;
            }
            else
            {
                opts.leftValue = self.offset().left + self.outerWidth() - 12;
                topValue = self.offset().top + 2;
            }
            opts.sliderLength = Math.max(opts.slideMinLength, parseInt(originHeight / realHeight * originHeight));
            opts.stepValue = Math.min((originHeight - 20) / realHeight, 1) * 100;
            var slideObj = opts.slideObj = $("<div></div>").addClass("uiScrollBar").css({position : "absolute", height : originHeight - 2, width : 10, left : opts.leftValue, top : topValue}).appendTo(self);
            slideObj.slide(opts).hide();
            var widgetKey = slideObj.attr("widget");
            self.bind("mousewheel." + widgetKey, function(e, delta)
            {                
                var value = slideObj.slide("val");
                if(delta > 0)
                {
                    value -= opts.stepValue;
                }
                else
                {
                     value += opts.stepValue;
                }
                slideObj.slide("val", value, false);
                return false;
            })
            .bind("mouseenter." + widgetKey, function()
            {
                slideObj.show();
            })
            .bind("mouseleave." + widgetKey, function()
            {
                slideObj.hide();
            });
        });
        return objList;
    };
    
    function reset(opts)
    {
        var self = this;
        var realHeight = self.attr("scrollHeight") + opts.marginHeight;
        var originHeight = self.attr("clientHeight");
        if(originHeight === realHeight)
        {
            return true;
        }
        opts.overHeight = realHeight - originHeight;
        var sliderLength = Math.max(opts.slideMinLength, parseInt(originHeight / realHeight * originHeight));
        opts.stepValue = Math.min((originHeight - 20) / opts.overHeight, 1);
        var slideObj = self.find(".uiScrollBar.uiSlide");
        slideObj.slide("sliderLength", sliderLength);
        slideObj.slide("val", opts.marginHeight / opts.overHeight * 100);
        return self
    }
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
        
        event : "click",
        
        titleIcon : null,
        
        animation : "toggle",
        disabled : false,
        title : null,
        itemTitleList : null,
        animateTime : $.angela.defaultAnimateDuration,

        
        
        height : "auto",
        
        toggle : false,
        
        hideOthers : true,

        
        widgetKey : null,
        animating : false,
        titleBarHTML : '<div class="uiAccordionTitleBar uiNoSelectText"><span></span></div>',
        itemTitleBarHTML : '<div class="uiTitleBar uiNoSelectText"><div class="uiUserBtn uiArrowDown"></div><span class="uiTitle"></span></div>',

        
        changeStart : null,
        change : null
    };

    
    $.fn.accordion = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.accordion.defaults, init : init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.angela.accordion = $.extend({}, $.angela.widget, $.angela.accordion, {
        
        activate : function(index)
        {
            var self = this, opts = self.opts;
            if(index === undefined)
            {
                var activateArr = [];
                var titleBarList = $("> .uiTitleBar", self);
                titleBarList.each( function(n)
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
                obj.trigger(opts.event);
            }
            return self;
        },
        item : function(index, content, title)
        {
            var self = this, opts = self.opts;
            index = index || 0;
            var titleBar = $("> .uiTitleBar", self).eq(index);
            if(content === undefined)
            {
                return titleBar.next();
            }
            if(title === undefined)
            {
                return titleBar.next().html(content);
            }
            titleBar.children(".uiTitle").html(title);
            if(content !== null)
            {
                return titleBar.next().html(content);
            }
            return titleBar.next();
        },
        
        addItem : function(item, title, index)
        {
            var self = this, opts = self.opts, item = $(item), title = title || item.attr("title");
            var titleBar = $(opts.itemTitleBarHTML).addClass(opts.itemTitleBarClass)
            .children(".uiTitle").html(title).end();
            item.addClass("uiContent uiHidden").height(opts.height);
            if(index !== undefined)
            {
                var obj = $("> .uiTitleBar", self).eq(index);
                titleBar.insertBefore(obj);
                item.insertBefore(obj);
            }
            else
            {
                self.append(titleBar).append(item);
            }
            if($.angela.msie6 === true)
            {
                $.angela.hack.fixPNG(titleBar.find(".uiUserBtn"));
            }
            return self;
        },
        
        removeItem : function(index)
        {
            var self = this, opts = self.opts;
            return $("> .uiTitleBar", self).eq(index).next().andSelf().remove();
        },
        
        title : function(title)
        {
            var self = this, opts = self.opts;
            var obj = $("> .uiAccordionTitleBar > span:last", self);
            if(title === undefined)
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
            if(opts.titleIcon === null)
            {
                $("> .uiAccordionTitleBar", self).prepend($('<span class="uiTitleIcon" />'));
            }
            var obj = $("> .uiAccordionTitleBar > span.uiTitleIcon", self).removeClass(opts.titleIcon).addClass(titleIcon);
            opts.titleIcon = titleIcon;
            return self;
        }
    });

    function init()
    {
        var self = this, opts = self.opts, titleBar = null, title = opts.title || self.attr("title");
        
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
            var contentClass = "uiHidden", titleBarClass = opts.itemTitleBarClass, buttonClass = "", obj = $(this);
            
            if(opts.active === "all" || $.inArray(n, opts.active) !== -1)
            {
                contentClass = "";
                titleBarClass = opts.activeClass + " uiActive";
                buttonClass = "uiArrowUp";
            }
            
            title = null;
            if($.isArray(opts.itemTitleList))
            {
                title = opts.itemTitleList[n];
            }
            title = title || obj.attr("title");
            $(opts.itemTitleBarHTML).addClass(titleBarClass)
            .children(".uiUserBtn").addClass(buttonClass)
            .siblings(".uiTitle").html(title).end().end()
            .insertBefore(obj.addClass("uiContent " + contentClass).height(opts.height));
        }).end()
        .prepend(titleBar);

        
        initEvent.call(self);
        if(opts.disabled)
        {
            $$.disable.call(self);
        }
        if($.angela.msie6 === true)
        {
            $.angela.hack.fixPNG(self.find(".uiUserBtn"));
        }
        return self;
    }

    function initEvent()
    {
        var self = this, opts = self.opts;
        
        self.bind(opts.event + ".uiAccordion", function(e)
        {
            if(opts.disabled || opts.animating)
            {
                return ;
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
                if(opts.changeStart.call(self[0], target, e) === false)
                {
                    return self;
                }
            }
            opts.animating = true;
            var selectedList = opts.hideOthers === true? $("> ." + opts.activeClass, self).not(target).removeClass(opts.activeClass + " uiActive").addClass(opts.itemTitleBarClass) : null;
            target.toggleClass(opts.itemTitleBarClass).toggleClass(opts.activeClass + " uiActive").add(selectedList)
            .children(".uiUserBtn").toggleClass("uiArrowUp").end()
            .next(".uiContent").stop(true, true)[opts.animation](opts.animateTime, function()
            {
                if($(this).is(":visible"))
                {
                    if($.isFunction(opts.change))
                    {
                        opts.change.call(self[0], target, e);
                    }
                }
                opts.animating = false;
            });
        });
        return self;
    }
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
        hasScrollBar : false,
        listItemHoverClass : $.angela.hoverGradientBG["40"],
        animateTime : $.angela.defaultAnimateDuration,
        
        
        
        click : null,
        change : null,
        input : null,
        blur : null,
        focus : null,

        
        widgetKey : null,
        selectItemTotal : 0,
        listItemOuterHeight : 0,
        dropDownHTML : '<div class="uiDropDown"><div class="uiDropDownBtn uiBlackBorder"></div></div>',
        selectListHTML : '<div class="uiSelectList"></div>',
        noListDataHTML : '<li style="font-size:12px;">无数据项..</li>'
    };
    
    $.fn.dropDownList = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.dropDownList.defaults, init : init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.angela.dropDownList = $.extend({}, $.angela.widget, $.angela.dropDownList, {
        selectItem : function(index)
        {
            var self = this, opts = self.opts;
            if(index === undefined)
            {
                return $(">.uiSelectList>.selected", self);
            }
            $("> .uiSelectList > li:eq(" + index + ")", self).click();
            return self;
        },
        selectList : function(list)
        {
            var self = this, opts = self.opts;
            var selectList = $(".uiSelectList", self);
            if(list === undefined)
            {
                return selectList.children();
            }
            selectList.empty();
            if(typeof list === "string")
            {
                selectList.html(list);
            }
            else
            if($.isArray(list))
            {
                if(list.length === 0)
                {
                    selectList.append(opts.noListDataHTML);
                }
                $.each(list, function(i, item)
                {
                    selectList.append("<li>" + item + "</li>");
                });
            }
            else
            {
                selectList.append(list);
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
            if(opts.listItemOuterHeight === 0)
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
            var self = this, opts = self.opts, selectedValue = [];
            if(value === undefined)
            {
                self.find(">.uiSelectList>.selected").each( function()
                {
                    selectedValue.push($(this).text());
                });
                return selectedValue;
            }
            else
            {
                var selectedContent = $("> .uiDropDown > span, > .uiDropDown > input", self);
                if(opts.dropListType === "search")
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

    function init()
    {
        var self = this, opts = self.opts;

        
        var multiple = opts.multiple? "uiMultiple" : "";
        
        var selectList = self.children().addClass(multiple + " uiSelectList " + opts.selectListClass);
        opts.selectItemTotal = $("> li", selectList).length;
        var dropDown = $(opts.dropDownHTML);
        if(opts.dropListType === "search")
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
        if(opts.dropListType === "search")
        {
            dropDown.children("input").width(dropDown.width() - 2 * parseInt(dropDown.css("padding-left")) - dropDown.children(".uiDropDownBtn").outerWidth(true));
        }
        
        if(opts.showAll)
        {
            opts.pageSize = opts.selectItemTotal;
        }
        else
        {
            opts.listItemOuterHeight = selectList.find("> li").outerHeight();
            selectList.height(opts.listItemOuterHeight * opts.pageSize);
        }
        selectList.hide();
        
        initEvent.call(self);        
        if(opts.disabled)
        {
            $$.disable.call(self);
        }
        if($.angela.msie6 === true)
        {
            $.angela.hack.fixPNG(self.find(".uiDropDownBtn"));
        }
        return self;
    }

    function initEvent()
    {
        var self = this, opts = self.opts, selectedContent = $("> .uiDropDown > span, > .uiDropDown > input", self);
        
        $("> .uiDropDown", self).bind("click.uiDorpDownList", function(e)
        {
            if(opts.disabled)
            {
                return false;
            }
            if(opts.click)
            {
                if(opts.click.call(self[0], $(this), e) === false)
                {
                    return false;
                }
            }
            $(this).siblings(".uiSelectList").slideToggle(opts.animateTime);
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
                    if(opts.focus.call(self[0], obj, e) === false)
                    {
                        return false;
                    }
                }
                if(!obj.hasClass("selected"))
                {
                    if(obj.val() === opts.searchTip)
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
                    if(opts.blur.call(self[0], obj, e) === false)
                    {
                        return false;
                    }
                }
                if(obj.val() === "")
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
                    opts.input.call(self[0], $(this), e);
                }
            }
        });
        
        var selectList = $("> .uiSelectList", self);
        if(opts.hasScrollBar)
        {
            selectList.show().scrollBar().hide();
        }
        else
        {
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
                    if(obj.nextAll("li").length >= opts.pageSize)
                    {
                        obj.hide();
                    }
                }
                else
                {
                    $("> li:hidden:last", this).show();
                }
                return false;
            });
        }
        selectList.bind("click.uiDorpDownList", function(e)
        {
            if(opts.disabled)
            {
                return ;
            }
            var target = $(e.target);
            if(target.attr("tagName").toUpperCase() != "LI")
            {
                return ;
            }
            var selectedValue = target.toggleClass("selected").text();
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
            if(opts.dropListType === "search")
            {
                selectedContent.val(selectedValue);
            }
            else
            {
                selectedContent.html(selectedValue);
            }
            if($.isFunction(opts.change))
            {
                if(opts.change.call(self[0], $(this), selectedValue, e) === false)
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
    }

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
        noTitleBar : false,
        titleIcon : null,
        title : null,
        
        controlButton : true,
        disabled : false,
        autoOpen : true,
        destroyOnClose : true,
        closeAnimate : "slideUp",
        openAnimate : "slideDown",
        animateTime : $.angela.defaultAnimateDuration,

        
        
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
        resizeStop : null,        
        
        
        widgetKey : null,
        
        minStatusHeight : 0,
        
        originHeight : 0,
        
        originWidth : 0,
        
        originPosition : null,
        overflowStatus : null,
        controlButtonSetHTML : '<div class="uiDlgButtonSet"><div class="uiUserBtn uiMinBtn"></div><div class="uiUserBtn uiCloseBtn"></div></div>',
        titleBarHTML : '<div class="uiTitleBar"><span class="uiTitle"></span></div>',
        contentHTML : '<div class="uiContent"></div>',
        resizeHTML :'<div class="uiResizable"></div>',
        selectList : null
    };

    
    $.fn.dialog = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.dialog.defaults, init : init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.angela.dialog = $.extend({}, $.angela.widget, $.angela.dialog, {
        
        title : function(title)
        {
            var self = this, opts = self.opts;
            var obj = $("> .uiTitleBar > .uiTitle", self);
            if(title === undefined)
            {
                return obj.text();
            }
            opts.title = title;
            obj.html(obj.html().replace(obj.text(), title));
            return self;
        },
        
        titleIcon : function(titleIcon)
        {
            var self = this, opts = self.opts;
            if(titleIcon === undefined)
            {
                return opts.titleIcon;
            }
            if(opts.titleIcon === null)
            {
                $("> .uiTitleBar > .uiTitle", self).prepend('<span class="uiTitleIcon" />');
            }
            var obj = $("> .uiTitleBar > .uiTitle > .uiTitleIcon", self).removeClass(opts.titleIcon).addClass(titleIcon);
            opts.titleIcon = titleIcon;
            return self;
        },
        content : function(content)
        {
            var self = this, opts = self.opts;
            var contentObj = self.children(".uiContent");
            if(content === undefined)
            {
                return contentObj;
            }
            contentObj.empty().append($(content));
            return self;
        }
    });

    
    function init()
    {
        var self = this, opts = self.opts, titleBarClass = opts.titleBarClass + " uiCornerAll";
        if(opts.title === null)
        {
            opts.title = self.attr("title") || "";
        }
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
        if(opts.noTitleBar)
        {
            self.addClass("uiDialog uiWidget " + opts.dlgClass);
        }
        else
        {
            var tileBar = $(opts.titleBarHTML).addClass(titleBarClass).append(controlButton).children(".uiTitle").html(opts.title).end();
            if(opts.titleIcon !== null)
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
            if($.browser.msie && $.browser.version === "6.0")
            {
                opts.selectList = $("select:visible").filter( function(i)
                {
                    if($(this).css("visibility") !== "hidden")
                    {
                        return true;
                    }
                    return false;
                }).css("visibility", "hidden");
                maskObj.height($(document).height());
            }
        }
        
        if(opts.buttonSet !== null)
        {
            var buttonSetHTML = "<div>";
            for(var key in opts.buttonSet)
            {
                buttonSetHTML += ("<div>" + key + "</div>");
            }
            buttonSetHTML += "</div>";
            $(buttonSetHTML).buttonSet({
                click : function(target)
                {
                    if(opts.disabled)
                    {
                        return false;
                    }
                    if(opts.buttonSet[target.text()].call(this) === false)
                    {
                        return false;
                    }
                    $$.close.call(self, target);
                }
            }).appendTo(self);
        }
        
        if(opts.resizable)
        {
            self.append(opts.resizeHTML);
            if(self.css("position") === "static")
            {
                self.css("position", "relative");
            }
        }
        opts.minHeight = Math.min(self.height(), opts.minHeight);
        opts.minWidth = Math.min(self.width(), opts.minWidth);
        setContentHeight.call(self);
        
        initEvent.call(self);
        if(opts.disabled)
        {
            $$.disable.call(self);
        }
        if(!opts.autoOpen)
        {
            self.hide();
        }
        if($.angela.msie6 === true)
        {
            $.angela.hack.fixPNG(self.find(".uiUserBtn, .uiResizable"));
        }
        return self;
    }

    function initEvent()
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
                $$.min.call(self, obj, e);
                return false;
            }
            else
            if(obj.hasClass("uiResumeBtn"))
            {
                $$.resume.call(self, obj, e);
                return false;
            }
            else
            if(obj.hasClass("uiCloseBtn"))
            {
                $$.close.call(self, obj, e);
                return false;
            }
        });
        
        if(opts.draggable)
        {
            var dragStopFunc = function(mask, offset)
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
                self.moveToPos({position : offset});
            };
            self.draggable({
                event : {start : opts.dragStart, doing : opts.draging,  stop : dragStopFunc}
            });
        }
        
        if(opts.resizable)
        {
            var resizeStopFunc = function(mask, width, height)
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
        
        
        if(posStr !== "static" && posStr !== "relative")
        {
            if(opts.active && opts.autoOpen)
            {
                $(".uiDialog").not(self).each( function()
                {
                    var obj = $(this);
                    if(obj.css("position") !== "static" && obj.css("position") !== "relative")
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
                    if(obj.css("position") !== "static" && obj.css("position") !== "relative")
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
    }

    function setContentHeight()
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
        if(imgList.length !== 0)
        {
            var imgTotal = imgList.length;
            var completeLoad = 0;
            imgList.each( function()
            {
                if(this.complete)
                {
                    completeLoad++;
                    if(completeLoad === imgTotal)
                    {
                        content.height(self.height() - otherItemHeightTotal - outerOffset);
                    }
                }
                else
                {
                    $(this).load( function()
                    {
                        completeLoad++;
                        if(completeLoad === imgTotal)
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
        animateTime : $.angela.defaultAnimateDuration,
        
        
        error : null,
        click : null,
        hideAllSubList : null,
        
        
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
        hrefHTML : '<a class="uiHidden"></a>'

    };

    
    $.fn.menu = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.menu.defaults, init : init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.angela.menu = $.extend({}, $.angela.widget, $.angela.menu, {

    });

    function init()
    {
        var self = this, opts = self.opts;
        if(opts.url === null)
        {
            return $$.destroy.call(self, true);
        }
        initList.call(self);

        return self;
    }

    function initList()
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
                var topLevelListItemClass = opts.vertical === true ? opts.topLevelVerticalListItemClass : opts.topLevelListItemClass, listIcon = null;
                $.each(listJson.menu, function(n, item)
                {
                    var itemClass = n === 0? "" : topLevelListItemClass, childrenListNO = 0, listHTMLStr;

                    
                    if(item.children !== undefined)
                    {
                        childrenListNO = ++opts.subLevelListTotal;
                        createList.call(self, item.children);
                        pos = item.pos;
                        if(opts.vertical)
                        {
                            if(pos === "right")
                            {
                                listIcon = $(opts.rightIconHTML);
                            }
                            else
                            {
                                listIcon = $(opts.downIconHTML);
                            }
                        }
                    }
                    if(item.href !== undefined)
                    {
                        //listHTMLStr = '<li href="' + item.href + '">' + item.content + "</li>";
                        if(item.target !== undefined)
                        {
                            listHTMLStr = '<li><a target="' + item.target + '" href="' + item.href + '">' + item.content + "</a></li>";
                        }
                        else
                        {
                            
                            listHTMLStr = '<li><a href="' + item.href + '">' + item.content + "</a></li>";
                        }
                    }
                    else
                    {
                        listHTMLStr = '<li>' + item.content + "</li>";
                    }
                    var listClass = "";
                    if(item.listIcon !== undefined)
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
                initEvent.call(self);
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
    }

    function initEvent()
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
            if(obj.children("a").length !== 0)
            {
                obj.children("a").stop(true,true).animate({color : opts.hoverColor})
            }
            else
            {
                obj.stop(true,true).animate({color : opts.hoverColor});
            }
            hideList.call(self, obj);
            if(no === 0)
            {
                return ;
            }
            if(opts.checkPosEachTime || opts.listPosSetFlag[no] === undefined)
            {
                var offset = getOffset(self, obj, pos);
                $('> ul[NO="' + no + '"]', self).css({"left" : offset.left, "top" : offset.top})[opts.show](opts.animateTime).children().removeClass(opts.listHoverClass);
                opts.listPosSetFlag[no] = true;
            }
            else
            {
                $('> ul[NO="' + no + '"]', self)[opts.show](opts.animateTime).children().removeClass(opts.listHoverClass);
            }
        }, function(e)
        {
            if(opts.disabled)
            {
                return false;
            }
            var obj = $(this);
            if(obj.children("a").length !== 0)
            {
                obj = obj.children("a");
            }
            obj.stop(true,true).css("color", opts.color);
            opts.hideFlag = true;
            setTimeout( function()
            {
                hideAllSubList.call(self);
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
                if(opts.click.call(self[0], target, e) === false)
                {
                    return false;
                }
            }
            
        });
        return self;
    }

    
    function createList(listJson)
    {
        var self = this, opts = self.opts, subLevelList = $(opts.subLevelListHTML).addClass(opts.subLevelListClass).attr("NO", opts.subLevelListTotal);
        $.each(listJson, function(n, item)
        {
            var childrenListNO = 0, subLevelListIcon = null, pos = null, listHTMLStr;
            if(item.children !== undefined)
            {
                pos = item.pos;
                childrenListNO = ++opts.subLevelListTotal;
                createList.call(self, item.children);
                if(pos === "right")
                {
                    subLevelListIcon = $(opts.rightIconHTML);
                }
                else
                {
                    subLevelListIcon = $(opts.downIconHTML);
                }
            }

            if(item.target !== undefined)
            {
                listHTMLStr = '<li><a target="' + item.target + '" href="' + item.href + '">' + item.content + "</a></li>";
            }
            else
            {

                listHTMLStr = '<li><a href="' + item.href + '">' + item.content + "</a></li>";
            }
                        
            var listIcon = null;
            var listClass = "";
            if(item.listIcon !== undefined)
            {
                listIcon = $('<span class="uiListIcon" />').addClass(item.listIcon);
                listClass = "hasListIcon";
            }
            subLevelList.append($(listHTMLStr).attr("childrenListNO", childrenListNO).attr("pos", pos).prepend(subLevelListIcon).prepend(listIcon).addClass(listClass));
        });
        self.append(subLevelList);
        return self;
    }

    function getOffset(self, obj, position)
    {
        var leftValue = 0, topValue = 0, leftOffset = 0, topOffset = 0, pos = (position === undefined? "bottom" : position);
        if(self.css("position") !== "static")
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
    }

    function hideList(target)
    {
        var self = this, opts = self.opts;
        if(target.parents(".uiTopLevel").length !== 0)
        {
            $(".uiSubLevel", self).stop(true, true)[opts.hide]();
        }
        else
        {
            target.parents().prevAll(".uiSubLevel").stop(true, true)[opts.hide]();
        }
        return self;
    }

    function hideAllSubList()
    {
        var self = this, opts = self.opts;
        if(opts.hideFlag)
        {
            $(".uiSubLevel", self).stop(true, true)[opts.hide]();
            $(".uiTopLevel li", self).removeClass(opts.listHoverClass);
            if($.isFunction(opts.hideAllSubList))
            {
                opts.hideAllSubList.call(self[0]);
            }
        }
        return self;
    }

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
        marginValue : null,
        value : 0,
        type : "normal",
        scrollTime : 3000,
        scrollValue : 0.19,

        
        progressBarLength : 0,
        scrolling : false,
        widgetKey : null
    };

    
    $.fn.progressBar = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.progressBar.defaults, init : init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.angela.progressBar = $.extend({}, $.angela.widget, $.angela.progressBar, {
        val : function(value)
        {
            var self = this, opts = self.opts;
            if(value === undefined)
            {
                return opts.value;
            }
            opts.value = value > 1 ? 1 : (value < 0 ? 0 : value);
            value = opts.value === 1? 1.1 : opts.value;
            self.children(".progressValue").width(opts.progressBarLength * value);
            return self;
        },
        scroll : function(scrolling)
        {
            var self = this, opts = self.opts;
            if(opts.type !== "scroll" || (scrolling && opts.scrolling))
            {
                return self;
            }
            if(!scrolling)
            {
                opts.scrolling = false;
                self.children(".progressValue").stop();
            }
            else
            {
                var obj = self.children(".progressValue");
                var marginLeftValue = opts.progressBarLength - (obj.width() + parseInt(obj.css("margin-left")));
                opts.scrolling = true;
                obj.animate({marginLeft : marginLeftValue}, opts.scrollTime, function()
                {
                    opts.scrolling = false;
                    $$.scroll.call(self, true);
                });
            }
            return self;
        }
    });

    function init()
    {
        var self = this, opts = self.opts;

        var progressValue = $('<div class="progressValue"></div>');
        var blockTotal = Math.ceil(self.width() / opts.blockWidth);
        for(var i = 0; i < blockTotal; i++)
        {
            var obj = $('<div class="progressBlock"></div>').addClass(opts.progressBlockClass).width(opts.blockWidth);
            if(opts.marginValue !== null)
            {
                obj.css("marginRight", opts.marginValue);
            }
            progressValue.append(obj);
        }
        opts.progressBarLength = self.addClass("uiProgressBar uiWidget " + opts.progressBarClass).append(progressValue).width();
        if(opts.disabled)
        {
            $$.disable.call(self);
        }
        if(opts.type === "scroll")
        {
            $$.val.call(self, opts.scrollValue);
            $$.scroll.call(self, true);
        }
        else
        {
            $$.val.call(self, opts.value);
        }
        return self;
    }

})(jQuery);

// JavaScript Document
;
(function($)
{
    $.angela.list = $.angela.list || {};
    $.angela.list.defaults = {
        
        title : null,
        titleBarClass : $.angela.selectedGradientBG["30"],
        titleIcon : null,
        disabled : false,
        listClass : "uiBlueBigBorder uiCornerAll uiBlueBoxShadow",
        listItemClass : "uiListItem",
        listItemHoverClass : "ui40LightBlueGradientBG",
        listMoreClass : "ui40GrayGradientBG",
        listBackClass : "ui40GrayGradientBG",
        listItemSelectedClass : "ui40BlueGradientBG",
        animateTime : $.angela.defaultAnimateDuration,
         
        
        click : null,
        
        
        
        widgetKey : null,
        listWidth : 0,
        titleBarHTML : '<div class="uiListTitleBar uiNoSelectText"><span></span></div>',
        backItemHTML : '<li class="uiListBack"></li>',
        moreItemHTML : '<span class="uiListMoreBtn uiArrowRight"></span>'

    };

    
    $.fn.list = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.list.defaults, init : init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.angela.list = $.extend({}, $.angela.widget, $.angela.list, {

    });

    function init()
    {
        var self = this, opts = self.opts, titleBar = null, title = opts.title || self.attr("title");
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
        self.find("li").each( function()
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
        
        initEvent.call(self);
        if(opts.disabled)
        {
            $$.disable.call(self);
        }
        if($.angela.msie6 === true)
        {
            $.angela.hack.fixPNG(self.find(".uiArrowRight"));
        }
        return self;
    }

    function initEvent()
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
                if(obj.length === 0)
                {
                    return ;
                }
                obj.prepend($(opts.backItemHTML).addClass(opts.listBackClass).attr("number", currentNumber).html('<span class="uiListBackBtn uiArrowLeft"></span>' + target.text()));
                var marginLeftValue = $.style(this, "marginLeft");
                currentObj.animate({marginLeft : -opts.listWidth}, opts.animateTime, function()
                {
                    $(this).hide();
                    $.style(this, "marginLeft", marginLeftValue);
                });
            }
            else
            if(target.hasClass("uiListBack"))
            {
                var number = target.attr("number");
                var obj = $(this).siblings("[number='" + number + "']");
                if(obj.length === 0)
                {
                    return ;
                }
                var marginLeftValue = $.style(obj[0], "marginLeft");
                obj.css("marginLeft", -opts.listWidth).show().animate({marginLeft : 0}, opts.animateTime, function()
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
                    opts.click.call(self[0], target, e);
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

})(jQuery);
// JavaScript Document
;
(function($)
{
    $.angela.tree = $.angela.tree || {};
    $.angela.tree.defaults = {
        url : null,
        checkButton : false,
        getMoreData : null,
        hoverClass : "uiItemHover",
        selectedClass : "uiItemSelected",
        line1Class : "uiLine1",
        line2Class : "uiLine2",
        line3Class : "uiLine3",
        plusClass : "uiPlus",
        minusClass : "uiMinus",
        insertClass : "uiItemInsert",
        draggable : false,
        beforeOpen : null,
        open : null,
        beforeClose : null,
        close : null,        
        animateTime : $.angela.defaultAnimateDuration,
        
        error : null,
        select : null,
        
        
        itemHeight : 0,
        treeJSON : null,
        insertTipHTML : '<span class="uiInsertTip"></span>',
        treeItemHTML : '<li class="uiTreeItem"></li>',
        itemHTML : '<span class="uiItem"></span>',
        iconHTML : '<span class="uiTreeIcon"></span>',
        nameHTML : '<span class="uiName"></span>'
    };

    
    $.fn.tree = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.tree.defaults, init : init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.angela.tree = $.extend({}, $.angela.widget, $.angela.tree, {
        getItemIndexArray : function(item)
        {
            if(item.hasClass("uiTreeItem"))
            {
                var indexArr = getIndexArrayByTreeItem(item);
                return indexArr;
            }
            return [];
        },
        getItem : function(indexArr)
        {
            var self = this, opts = self.opts;
            return getTreeItemByIndexArray(indexArr, self);
        },
        getData : function(dest)
        {
            var self = this, opts = self.opts;
            var indexArr = dest;
            if(!$.isArray(dest))
            {
                indexArr = getIndexArrayByTreeItem(dest);
            }
            var data = opts.treeJSON;
            for(var i = 0, len = indexArr.length - 1; i < len; i++)
            {
                data = data[indexArr[i]].children;
            }
            return data[indexArr.pop()];
        },
        selectItem : function(indexArr)
        {
            var self = this, opts = self.opts;
            var selectObj = self.find("." + opts.selectedClass);
            if(indexArr === undefined)
            {
                return selectObj.parent(".uiTreeItem");
            }
            var obj = getTreeItemByIndexArray(indexArr, self);
            if(obj.length !== 0)
            {
                selectObj.removeClass(opts.selectedClass);
                obj.children(".uiItem").addClass(opts.selectedClass);
            }
            return self;
        },
        addItem : function(data, dest, insertFunc)
        {
            var self = this, opts = self.opts;            
            if(arguments.length == 2)
            {
                var insertFunc = "insertAfter";
            }
            else if(arguments.length < 2)
            {
                return self;
            }
            var itemObj = $(opts.itemHTML).append($(opts.iconHTML).addClass(data.type)).append($(opts.nameHTML).html(data.name));
            var iconObj = $(opts.iconHTML);
            if("children" in data || ("ajax" in data && data.ajax == true))
            {
                iconObj.addClass(opts.plusClass);
            }
            else
            {
                iconObj.addClass(opts.line3Class);
            }
            var insertObj = $(opts.treeItemHTML).append(iconObj).append(itemObj);
            var destObj = dest;
            if($.isArray(dest))
            {
                destObj = getTreeItemByIndexArray(dest, self);
            }
            if(destObj.length !== 0)
            {
                addTreeItem(destObj, insertObj, data, insertFunc, opts);
            }
            return self;
        },
        removeItem : function(dest)
        {
            var self = this, opts = self.opts;
            var removeObj = dest;
            if($.isArray(dest))
            {
                removeObj = getTreeItemByIndexArray(dest, self);
            }
            removeTreeItem(removeObj, opts);
            return self;
        },
        openItem : function(dest)
        {
            var self = this, opts = self.opts;
            if($.isArray(dest))
            {
                dest = getTreeItemByIndexArray(dest, self);
            }
            dest.children("." + opts.plusClass).click();
            return self;
        },
        closeItem : function(dest)
        {
            var self = this, opts = self.opts;
            if($.isArray(dest))
            {
                dest = getTreeItemByIndexArray(dest, self);
            }
            dest.children("." + opts.minusClass).click();
            return self;
        }
    });

    function init()
    {
        var self = this, opts = self.opts;
        if(opts.url === null)
        {
            return $$.destroy.call(self, true);
        }
        self.addClass("uiTree uiWidget ");
        $.ajax({
            url : opts.url,
            dataType : "json",
            success : function(data)
            {
                opts.treeJSON = data;
                setTree.call(self, self, [], true);
                opts.itemHeight = self.find(">ul>.uiTreeItem").outerHeight(true);
                initEvent.call(self);
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
    }

    function initEvent()
    {
        var self = this, opts = self.opts;
        self.bind("click.uiTree", function(e)
        {
            var target = $(e.target), treeItem;
            if(target.hasClass(opts.plusClass))
            {
                var parentObj = target.parent(".uiTreeItem");
                if($.isFunction(opts.beforeOpen))
                {
                    if(opts.beforeOpen.call(self[0], parentObj, e) === false)
                    {
                        return ;
                    }
                }
                target.removeClass(opts.plusClass).addClass(opts.minusClass);
                var success = true;
                treeItem = parentObj;
                treeItem.css("height", opts.itemHeight);
                if(parentObj.find(">ul>.uiTreeItem").length === 0)
                {
                    var indexArr = getIndexArrayByTreeItem(parentObj);
                    success = setTree.call(self, treeItem, indexArr, true);
                }
                if(success)
                {
                    toggleTreeItem(treeItem, opts);
                }
                if($.isFunction(opts.open))
                {
                    opts.open.call(self[0], parentObj, e)
                }
            }
            else
            if(target.hasClass(opts.minusClass))
            {
                var parentObj = target.parent(".uiTreeItem");
                if($.isFunction(opts.beforeClose))
                {
                    if(opts.beforeClose.call(self[0], parentObj, e) === false)
                    {
                        return ;
                    }
                }
                target.removeClass(opts.minusClass).addClass(opts.plusClass);
                treeItem = parentObj
                toggleTreeItem(treeItem, opts);
                if($.isFunction(opts.close))
                {
                    opts.close.call(self[0], parentObj, e)
                }
            }
            else
            if(target.hasClass("uiUnChecked") || target.hasClass("uiChildrenChecked"))
            {
                var parentObj = target.parent();
                changeCheckStatus(parentObj, true);
                
            }
            else
            if(target.hasClass("uiChecked"))
            {
                var parentObj = target.parent();
                changeCheckStatus(parentObj, false);
                
            }
            else
            if(target.parent(".uiItem").length !== 0)
            {                
                var obj = target.parent(".uiItem");
                if($.isFunction(opts.select))
                {
                    if(opts.select.call(self[0], obj.parent(".uiTreeItem"), e) === false)
                    {
                        return ;
                    }
                }
                self.find("." + opts.selectedClass).removeClass(opts.selectedClass);
                obj.addClass(opts.selectedClass);
            }
        })
        .bind("mouseover.uiTree mouseout.uiTree", function(e)
        {
            var target = $(e.target).parent(".uiItem");
            if(target.length !== 0)
            {
                target.toggleClass(opts.hoverClass);
            }
        });

        if(opts.draggable)
        {
            var visibleItemList = null;
            self.draggable({
                getUserMask : function()
                {
                    var selectedObj = self.find("." + opts.hoverClass);
                    if(selectedObj.length !== 0)
                    {
                        visibleItemList = self.find(".uiItem:visible");
                        originOffset = selectedObj.offset();
                        return selectedObj.clone().removeClass(opts.selectedClass).unbind().css({position : "absolute", left : originOffset.left, top : originOffset.top, "z-index" : 99}).insertAfter(selectedObj);
                    }
                    return selectedObj;
                },
                event : {
                    doing : function(mask, offset)
                    {
                        checkArea(self, visibleItemList, opts, mask, offset);
                    },
                    stop : function(mask, offset)
                    {
                        destObj = checkArea(self, visibleItemList, opts, mask, offset);
                        visibleItemList = null;
                        if(destObj.length === 0)
                        {
                            return ;
                        }
                        var insertTip = destObj.removeClass(opts.insertClass).children(".uiInsertTip");
                        var insertFunc = "insertAfter";
                        if(insertTip.hasClass("uiInsertBefore"))
                        {
                            insertFunc = "insertBefore";
                        }
                        insertTip.remove();
                        destObj = destObj.parent(".uiTreeItem");
                        var moveObj = mask.parent(".uiTreeItem");
                        if(moveObj[0] !== destObj[0])
                        {
                            var changeDestIcon = false;
                            var changeInsertIcon = false;                            
                            var removeObj = removeTreeItem(moveObj, opts);    
                            addTreeItem(destObj, removeObj.treeItem, removeObj.data, insertFunc, opts);     
                        }
                    }
                }
            });
        }
        return self;
    }

    function setTree(dest, indexArr, getData, hide)
    {
        var self = this, opts = self.opts;
        var json = opts.treeJSON;
        var noData = false;
        var allSpaceFlag = false;

        var line1HTML = '<span class="uiTreeIcon ' + opts.line1Class + '"></span>';
        var spaceHTML = '<span class="uiTreeIcon uiSpace"></span>';

        var paddingItemHTML = "";
        if($.isArray(indexArr))
        {
            $.each(indexArr, function(index, data)
            {
                if(data === json.length - 1)
                {
                    paddingItemHTML += spaceHTML;
                }
                else
                {
                    paddingItemHTML += line1HTML;
                }
                json = json[data];
                if(json["ajax"] === true)
                {
                    noData = true;
                    return false;
                }
                else
                {
                    json = json["children"];
                }
            });
        }
        if(noData)
        {
            if($.isFunction(opts.getMoreData) && getData)
            {
                opts.getMoreData(indexArr, function(data)
                {
                    json["ajax"] = false;
                    json["children"] = data;
                    if(setTree.call(self, dest, indexArr, false))
                    {
                        toggleTreeItem(dest, opts);
                    }
                });
            }
            return false;
        }
        var icon = $(opts.iconHTML);
        var totalItem = json.length;
        var checkBoxClass = "uiUnChecked";
        if(dest.children(".uiChecked").length !== 0)
        {
            checkBoxClass = "uiChecked";
        }
        var itemList = $("<ul></ul>");
        if(hide === true)
        {
            itemList.hide();
        }
        $.each(json, function(index, data)
        {
            var item = $(opts.treeItemHTML);
            if(paddingItemHTML !== "")
            {
                item.append($(paddingItemHTML))
            }
            var itemClass = opts.line3Class;
            if(index === totalItem - 1)
            {
                itemClass = opts.line2Class;
            }
            if("ajax" in data || "children" in data)
            {
                itemClass = opts.plusClass;
            }
            item.append(icon.clone().addClass(itemClass));
            if(opts.checkButton)
            {
                item.append(icon.clone().addClass(checkBoxClass));
            }
            item.append($(opts.itemHTML).append(icon.clone().addClass(data.type)).append($(opts.nameHTML).html(data.name)));
            if(itemClass === opts.plusClass)
            {
                var tmpIndex = indexArr.slice(0);
                tmpIndex.push(index);
                setTree.call(self, item, tmpIndex, false, true);
            }
            itemList.append(item);
        });
        dest.append(itemList);
        return true;
    }

    function checkArea(self, visibleItemList, opts, mask, offset)
    {
        self.find("." + opts.insertClass).removeClass(opts.insertClass).children(".uiInsertTip").remove();
        var index = Math.ceil((offset.top - self.offset().top + parseInt(self.scrollTop())) / opts.itemHeight);
        var destObj = visibleItemList.eq(index - 1);
        var destOffset = destObj.offset();
        var destLeft = destOffset.left;
        var destTop = destOffset.top;
        var destRight = destLeft + destObj.outerWidth();
        var destBottom = destTop + destObj.outerHeight();
        var maskLeft = offset.left;
        var maskTop = offset.top;
        var maskRigth = maskLeft + mask.outerWidth();
        var maskBottom = maskTop + mask.outerHeight();

        var moveObj = mask.parent(".uiTreeItem");
        var checkObj = destObj.parent(".uiTreeItem");
        if(checkObj[0] === moveObj[0])
        {
            return $();
        }
        var inserIndexArr = getIndexArrayByTreeItem(moveObj);
        var destIndexArr = getIndexArrayByTreeItem(checkObj);
        var isChild = false;
        if(inserIndexArr.length < destIndexArr.length)
        {
            isChild = true;
            for(var i = 0, len = inserIndexArr.length; i < len; i++)
            {
                if(inserIndexArr[i] != destIndexArr[i])
                {
                    isChild = false;
                }
            }
        }
        if(isChild)
        {
            return $();
        }
        if(!(destLeft > maskRigth | destTop > maskBottom | destRight < maskLeft | destBottom < maskTop))
        {
            var insertClass = "uiInsertBefore";
            $("#test").html(destTop - maskTop);
            if((Math.abs(destTop - maskTop) % opts.itemHeight) > (opts.itemHeight / 2))
            {
                insertClass = "uiInsertAfter";
            }
            return destObj.addClass(opts.insertClass).prepend($(opts.insertTipHTML).addClass(insertClass));
        }
        return $();
    }

    function toggleTreeItem(treeItem, opts)
    {
        var treeItemHeight = opts.itemHeight;
        var callBackFunc = "close";
        var showFlag = treeItem.height() == opts.itemHeight ? true : false;
        if(showFlag)
        {
            var treeItemClone = treeItem.clone().height("auto").find(">ul").show().end().css($.angela.cssShow).insertBefore(treeItem);
            treeItemHeight = treeItemClone.height();
            treeItemClone.remove();
            treeItem.find(">ul").show();
            callBackFunc = "open";
        }
        treeItem.animate({"height" : treeItemHeight}, opts.animateTime, function()
        {
            if(!showFlag)
            {
                $(this).find(">ul").hide();
            }
            $.style(this, "height", "");
            if($.isFunction(opts[callBackFunc]))
            {
                opts[callBackFunc].call(self);
            }
        });
    }

    function getIndexArrayByTreeItem(obj)
    {
        var indexArr = [];
        if(obj.hasClass("uiTreeItem"))
        {
            while(obj.length !== 0 && !obj.hasClass("uiTree"))
            {
                indexArr.push(obj.prevAll(".uiTreeItem").length);
                obj = obj.parent("ul").parent(".uiTreeItem");
            }
        }
        return indexArr.reverse();
    }
    
    function getTreeItemByIndexArray(arr, treeObj)
    {
        var obj = treeObj;
        if($.isArray(arr))
        {
            for(var i = 0, len = arr.length; i < len; i++)
            {
                obj = obj.find(">ul >.uiTreeItem").eq(arr[i]);
                if(obj.length === 0)
                {
                    break;
                }
            }
        }
        else
        {
            obj = $();
        }
        return obj;
    }

    function changeItemIcon(obj, cloneIcon, index)
    {
        obj.find(">ul>.uiTreeItem").each( function()
        {
            var destObj = $(this);
            var iconList = destObj.children(".uiTreeIcon");
            var Iconfilter = ":lt(" + index + ")";
            iconList.filter(Iconfilter).remove();
            destObj.prepend(cloneIcon.clone());
            changeItemIcon(destObj, cloneIcon, index);
        });
    }
    function removeTreeItem(obj, opts)
    {
        var removeIndexArr = getIndexArrayByTreeItem(obj);
        var removeJSON = opts.treeJSON;
        for(var i = 0, len = removeIndexArr.length - 1; i < len; i++)
        {
            removeJSON = removeJSON[removeIndexArr[i]].children;
        }
        var removeIndex = removeIndexArr.pop();
        var removeData = removeJSON[removeIndex];
        removeJSON.splice(removeIndex, 1);

        var iconList;
        var plusMinusFilter = "." + opts.plusClass + ", ." + opts.minusClass;
        var Iconfilter;
        var iconOffsetIndex = -1;
        if(opts.checkButton)
        {
            iconOffsetIndex = -2;
        }
        if(obj.next(".uiTreeItem").length === 0)
        {
            iconList = obj.prev(".uiTreeItem").children(".uiTreeIcon");
            if(iconList.filter(plusMinusFilter).length === 0)
            {
                iconList.eq(iconOffsetIndex).removeClass(opts.line3Class).addClass(opts.line2Class);
            }
            iconList = obj.children(".uiTreeIcon");
            if(iconList.filter(plusMinusFilter).length === 0)
            {
                iconList.eq(iconOffsetIndex).removeClass(opts.line2Class).addClass(opts.line3Class);
            }
        }
        var returObj = {
            data : removeData,
            treeItem : obj
        }
        var parentObj = obj.parent("ul").parent(".uiTreeItem");
        if(opts.checkButton)
        {            
            var checkObj = obj.next(".uiTreeItem");
            var arguments = [];
            if(checkObj.length === 0)
            {
                checkObj = obj.prev(".uiTreeItem");
            }
            if(checkObj.length === 0)
            {
                checkObj = parentObj;
                arguments.push(false);
            }            
            obj.remove();       
            arguments.unshift(checkObj);    
            changeCheckStatus.apply(self, arguments);
        }
        else
        {
            obj.remove();
        }
        var praentIconObj = parentObj.find("." + opts.plusClass + ", ." + opts.minusClass);
        if(praentIconObj.length !== 0)
        {
            if(parentObj.find(".uiTreeItem").length === 0)
            {
                praentIconObj.removeClass(opts.plusClass + " " + opts.minusClass);
                
                if(parentObj.next(".uiTreeItem").length === 0)
                {
                    praentIconObj.addClass(opts.line2Class);
                }
                else
                {
                    praentIconObj.addClass(opts.line3Class);
                }
            }
        }
        return returObj;
    }

    function addTreeItem(destObj, addObj, addData, insertFunc, opts)
    {
        var changeDestIcon = false;
        var changeInsertIcon = false;
        var destIndexArr = getIndexArrayByTreeItem(destObj);
        var destJSON = opts.treeJSON;
        for(var i = 0, len = destIndexArr.length - 1; i < len; i++)
        {
            destJSON = destJSON[destIndexArr[i]].children;
        }
        var destIndex = destIndexArr.pop();

        if(insertFunc === "insertAfter")
        {
            if(destObj.next(".uiTreeItem").length === 0)
            {
                changeDestIcon = true;
            }
            destIndex++;
        }
        destJSON.splice(destIndex, 0, addData);
        var iconList;
        var plusMinusFilter = "." + opts.plusClass + ", ." + opts.minusClass;
        var Iconfilter;
        var iconOffsetIndex = -1;
        if(opts.checkButton)
        {
            iconOffsetIndex = -2;
        }

        iconList = destObj.children(".uiTreeIcon");
        var destObjIconListLen = iconList.length;
        Iconfilter = ":lt(" + (destObjIconListLen + iconOffsetIndex) + ")";
        var cloneIcon = iconList.filter(Iconfilter).clone();
        iconList = addObj.children(".uiTreeIcon");
        var addObjIconListLen = iconList.length;
        Iconfilter = ":lt(" + (addObjIconListLen + iconOffsetIndex) + ")";
        iconList.filter(Iconfilter).remove();
        addObj.prepend(cloneIcon)[insertFunc](destObj);
        var addObjChildren = addObj.find(">ul>.uiTreeItem");
        if(addObjChildren.length !== 0)
        {
            var cloneIconClass = opts.line1Class;
            if(changeDestIcon)
            {
                cloneIconClass = "uiSpace";
            }
            cloneIcon = cloneIcon.clone().add($(opts.iconHTML).addClass(cloneIconClass));
            changeItemIcon(addObj, cloneIcon, addObjIconListLen + iconOffsetIndex + 1);
        }
        if(changeDestIcon)
        {
            iconList = destObj.children(".uiTreeIcon");
            if(iconList.filter(plusMinusFilter).length === 0)
            {
                iconList.eq(iconOffsetIndex).removeClass(opts.line2Class).addClass(opts.line3Class);
            }
            iconList = addObj.children(".uiTreeIcon");
            if(iconList.filter(plusMinusFilter).length === 0)
            {
                iconList.eq(iconOffsetIndex).removeClass(opts.line3Class).addClass(opts.line2Class);
            }
        }
        if(opts.checkButton)
        {
            changeCheckStatus(addObj);
        }
        return self;
    }
    
    function changeCheckStatus(obj, checked)
    {
        var childrenChenckedClass = "uiChildrenChecked";        
        var filterStr = ".uiChecked, .uiChildrenChecked";
        var allClassStr = "uiUnChecked uiChecked uiChildrenChecked";
        var addClassStr = "uiUnChecked";
        var findClassStr = ".uiChecked";
        if(arguments.length === 1)
        {
            var checked = false;
            if(obj.children(filterStr).length !== 0)
            {
                checked = true;
            }
        }
        if(checked)
        {
            filterStr = ".uiUnChecked, .uiChildrenChecked";
            addClassStr = "uiChecked";
            findClassStr = ".uiUnChecked";
        }
        if(arguments.length === 2)
        {
            obj.find(filterStr).removeClass(allClassStr).addClass(addClassStr);
        }
        obj = obj.parent("ul").parent(".uiTreeItem");
        while(obj.length !== 0)
        {
            var findObjList = obj.find(findClassStr);
            var changeObj = obj.children(filterStr);
            if(findObjList.length !== 0)
            {
                changeObj.removeClass(allClassStr).addClass(childrenChenckedClass);
            }
            else
            {
                changeObj.removeClass(allClassStr).addClass(addClassStr);
            }
            obj = obj.parent("ul").parent(".uiTreeItem");
        }
    }
})(jQuery);

// JavaScript Document
;
(function($)
{
    $.angela.grid = $.angela.grid || {};
    $.angela.grid.defaults = {
        
        gridClass : "uiBlueBigBorder uiCornerAll uiBlueBoxShadow",
        titleBarClass : $.angela.selectedGradientBG["30"],
        columnClass : "ui30GrayGradientBG",
        trHoverClass : "uiTrHover",
        trOddClass : "uiTrOdd",
        trEvenClass : "uiTrEven",
        url : "grid.json",
        gridJSON : null,
        getData : null,
        
        resizable : true,
        minimize : true,
        closable : true,
        titleText : null,
        noTitleBar : false,
        titleIcon : null,
        controlButton : true,
        disabled : false,
        closeAnimate : "slideUp",
        openAnimate : "slideDown",
        minHeight : 300,
        maxHeight : 700,
        minWidth : 400,
        maxWidth : 1000,
        resultsPerPageOptions : [10, 20, 30],
        currentPage : 0,
        animateTime : $.angela.defaultAnimateDuration,
        
        
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
        resizeStop : null,
        
        
        widgetKey : null,        
        resultsPerPage : null,
        minStatusHeight : 0,
        
        originHeight : 0,
        
        originWidth : 0,
        
        originPosition : null,
        columnTableHeight : null,
        gettingMoreData : false,
        currentIndex : 0,
        total : 0,
        columnWidthList : null,
        tableWidth : 0,
        scrollLeft : 0,
        dragging : false,
        sortOrderList : null,
        controlButtonSetHTML : '<div class="uiGridButtonSet"><div class="uiUserBtn uiMinBtn"></div><div class="uiUserBtn uiCloseBtn"></div></div>',
        titleBarHTML : '<div class="uiTitleBar"><span class="uiTitle"></span></div>',
        contentHTML : '<div class="uiContent"></div>',
        resizeHTML :'<div class="uiResizable"></div>',
        contentHTML : '<div class="uiContent"></div>',
        buttonSetHTML : '<div class="uiGridButtonSet ui30GrayGradientBG"><div class="uiGridButtonContainer"><div class="uiGridButton uiSearchBtn"></div></div><div class="uiBtnSeparator"></div><div class="uiGridButtonContainer"><div class="uiGridButton uiGoToFirstBtn"></div></div><div class="uiGridButtonContainer"><div class="uiGridButton uiPrevBtn"></div></div><div class="uiBtnSeparator"></div><div class="uiGridButtonContainer"><div class="uiGridButton uiNextBtn"></div></div><div class="uiGridButtonContainer"><div class="uiGridButton uiGoToLastBtn"></div></div><div class="uiBtnSeparator"></div><div class="uiPageShowSelect"><select></select></div><div class="uiBtnSeparator"></div><div class="uiPageSetting"></div><div class="uiBtnSeparator"></div><div class="uiGridButtonContainer"><div class="uiGridButton uiRefreshBtn uiLoading"></div></div><div class="uiBtnSeparator"></div></div>',
        columnTableHTML : '<table class="uiColumnTable" cellspacing="0" cellpadding="0"><thead><tr></tr></thead></table>',
        dataTableHTML : '<div class="uiDataContainer"><table cellspacing="0" cellpadding="0"><tbody></tbody></table></div>',
        separatorHTML : '<div class="uiSeparator"></div>',
        sortHTML : '<span class="uiArrowDown uiSortIcon"></span>'
        
    };

    
    $.fn.grid = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.grid.defaults, init : init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.angela.grid = $.extend({}, $.angela.widget, $.angela.grid, {
    });

    function init()
    {
        var self = this, opts = self.opts;
        $.ajax({
            url : opts.url,
            dataType : "json",
            success : function(data)
            {
                opts.gridJSON = data;
                setDataArray(opts.gridJSON.data, opts.gridJSON.total);
                opts.title = opts.titleText || self.attr("title");
                opts.sortOrderList = {};

                
                var controlButton = null;
                var tileBar, titleBarHeight = 0;
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

                if(opts.noTitleBar)
                {
                    self.addClass("uiGrid uiWidget " + opts.gridClass);
                }
                else
                {
                    tileBar = $(opts.titleBarHTML).addClass(opts.titleBarClass).append(controlButton).children(".uiTitle").html(opts.title).end();
                    if(opts.titleIcon !== null)
                    {
                        tileBar.children(".uiTitle").prepend($('<span class="uiTitleIcon" />').addClass(opts.titleIcon));
                    }
                    self.addClass("uiGrid uiWidget " + opts.gridClass).prepend(tileBar);
                    titleBarHeight = tileBar.outerHeight(true);
                }

                var content = $(opts.contentHTML);
                opts.tableWidth = 0;
                var originColumnWidthList = opts.gridJSON.columnWidth;
                for(var i = 0, len = originColumnWidthList.length; i < len; i++)
                {
                    opts.tableWidth += originColumnWidthList[i];
                }
                var columnTable = $(opts.columnTableHTML).width(opts.tableWidth);
                var columnTr = columnTable.children("thead").addClass(opts.columnClass).children("tr");
                $.each(opts.gridJSON.column, function(i, value)
                {
                    columnTr.append($("<td>" + opts.sortHTML + value + "</td>").width(originColumnWidthList[i]));
                });
                content.append(columnTable);
                var dataObj = $(opts.dataTableHTML);
                var dataTable = dataObj.children("table").width(opts.tableWidth).children("tbody");
                content.append(dataObj);
                var buttonSet = $(opts.buttonSetHTML);
                var pageShowSelect = buttonSet.find(".uiPageShowSelect > select");
                var pageShowSelectOptionsList = "";
                opts.resultsPerPage = opts.resultsPerPageOptions[0];
                for(var i = 0, len = opts.resultsPerPageOptions.length; i < len; i++)
                {
                    pageShowSelectOptionsList += ("<option>" + opts.resultsPerPageOptions[i] + "</option>");
                }
                pageShowSelect.append(pageShowSelectOptionsList);
                var pageSetting = buttonSet.find(".uiPageSetting");
                pageSetting.html('<span>Page</span><input type="text" size="5" /><span>of ' + Math.ceil(opts.gridJSON.total / opts.resultsPerPage) + "</span>");
                buttonSet.find(".uiRefreshBtn").removeClass("uiLoading");
                self.append(content).append(buttonSet);
                var contentHeight = self.height() - titleBarHeight - buttonSet.outerHeight(true);
                content.height(contentHeight);
                opts.columnTableHeight = content.children(".uiColumnTable").outerHeight(true);
                content.children(".uiDataContainer").height(contentHeight - opts.columnTableHeight);
                if(opts.resizable)
                {
                    self.append(opts.resizeHTML);
                    if(self.css("position") === "static")
                    {
                        self.css("position", "relative");
                    }
                }
                var separatorLeftValue = 0, separatorList = $();
                opts.columnWidthList = originColumnWidthList;
                $(">.uiContent >.uiColumnTable td", self).each( function(i)
                {
                    separatorLeftValue += $(this).outerWidth();
                    separatorList = separatorList.add($(opts.separatorHTML).css("left", separatorLeftValue - 1));
                });
                content.prepend(separatorList);
                setTable.call(self, dataTable, 0);
                initEvent.call(self);
                if(opts.disabled)
                {
                    $$.disable.call(self);
                }
                if($.angela.msie6 === true)
                {
                    $.angela.hack.fixPNG(self.find(".uiGridButton, .uiResizable"));
                }
            },
            error : function()
            {
                $$.destroy.call(self, true);
            }
        });
        return self;
    }

    function initEvent()
    {
        var self = this, opts = self.opts, posStr = self.css("position");
        var columnTable = $(">.uiContent>.uiColumnTable", self);
        $(">.uiContent>.uiDataContainer", self).bind("scroll.uiGrid", function(e)
        {
            var obj = $(this);
            var scrollLeftValue = obj.scrollLeft();
            var scrollTopValue = obj.scrollTop();
            var maxScrollTopValue = obj.attr("scrollHeight") - obj.attr("clientHeight");
            if(opts.scrollLeft !== scrollLeftValue)
            {
                columnTable.css("marginLeft", -scrollLeftValue);
                opts.scrollLeft = scrollLeftValue;
                setSeparatorPos.call(self);
            }
            if(maxScrollTopValue === scrollTopValue)
            {
                var dataTable = $(">.uiContent >.uiDataContainer >table >tbody", self);
                setTable.call(self, dataTable, opts.currentIndex + opts.resultsPerPage);
            }
        })
        .bind({
            "mouseover.uiGrid" : function(e)
            {
                if(opts.dragging)
                {
                    return ;
                }
                var target = $(e.target);
                if(target.hasClass("uiDataContainer"))
                {
                    return ;
                }
                var trObj = target.parentsUntil("tbody").addClass(opts.trHoverClass);
            },
            "mouseout.uiGrid" : function(e)
            {
                var target = $(e.target);
                var trObj = target.parentsUntil("tbody").removeClass(opts.trHoverClass);
            }
        });
        self.find("> .uiTitleBar > .uiGridButtonSet > .uiUserBtn").bind("click.uiGrid", function(e)
        {
            if(opts.disabled)
            {
                return false;
            }
            var obj = $(this);
            if(obj.hasClass("uiMinBtn"))
            {
                $$.min.call(self, obj, e);
                return false;
            }
            else
            if(obj.hasClass("uiResumeBtn"))
            {
                $$.resume.call(self, obj, e);
                return false;
            }
            else
            if(obj.hasClass("uiCloseBtn"))
            {
                $$.close.call(self, obj, e);
                return false;
            }
        });
        var originPositon;
        $(">.uiContent >.uiSeparator", self).draggable({
            getUserMask : function()
            {
                return $(this).addClass("uiSeparatorShow");
            },
            event : {
                start : function()
                {
                    originPositon = $(this).position();
                },
                doing : function(mask, position)
                {
                    opts.dragging = true;
                    $(this).css("left", position.left);
                    return false;
                },
                stop : function(mask, position)
                {
                    opts.dragging = false;
                    $(this).removeClass("uiSeparatorShow");
                    var index = mask.prevAll(".uiSeparator").length;
                    var offsetLength = position.left - originPositon.left;
                    var tableObj = $(">.uiContent >.uiColumnTable", self);
                    var tdObj = $(">thead >tr >td", tableObj).eq(index);
                    var columnNewWidth = opts.columnWidthList[index] + offsetLength;
                    if(columnNewWidth < 0)
                    {
                        mask.css(originPositon);
                        return false;
                    }
                    opts.tableWidth += offsetLength;
                    opts.columnWidthList[index] = columnNewWidth;

                    tableObj.width(opts.tableWidth);
                    tdObj.width(opts.columnWidthList[index]);

                    tableObj = $(">.uiContent >.uiDataContainer >table", self);
                    tdObj = $(">tbody >tr >td", tableObj).eq(index);

                    tableObj.width(opts.tableWidth);
                    tdObj.width(opts.columnWidthList[index]);

                    setSeparatorPos.call(self);
                    return false;
                }
            }
        });
        $(">.uiContent >.uiColumnTable td", self).bind("mouseenter.uiGrid mouseleave.uiGrid", function(e)
        {
            var value = "hidden";
            if(e.type === "mouseenter")
            {
                value = "visible";
            }
            $(this).children(".uiSortIcon").css("visibility", value);
        });
        $(">.uiContent >.uiColumnTable", self).bind("click.uiGrid", function(e)
        {
            var target = $(e.target);
            if(target.hasClass("uiSortIcon"))
            {
                target = target.parent();
            }
            var index = target.index();
            var sortIcon = target.children(".uiSortIcon");
            if(sortIcon.length === 0)
            {
                target.prepend(opts.sortHTML);
                sortIcon = target.children(".uiSortIcon");
            }
            if(sortIcon.hasClass("uiArrowUp"))
            {
                sortIcon.removeClass("uiArrowUp");
                opts.sortOrderList[index] = "des";
            }
            else
            {
                sortIcon.addClass("uiArrowUp");
                opts.sortOrderList[index] = "asc";
            }
            var btnObj = $(">.uiGridButtonSet .uiRefreshBtn", self).addClass("uiLoading");
            setTimeout( function()
            {
                sortTable($(">.uiContent >.uiDataContainer >table >tbody", self), opts, index);
                btnObj.removeClass("uiLoading");
            }, 30);
        });
        $(">.uiGridButtonSet", self).bind("click.uiGrid", function(e)
        {
            var obj = $(this);
            var target = $(e.target);
            var dataTable = $(">.uiContent >.uiDataContainer >table >tbody", self);
            $(">.uiContent>.uiDataContainer", self).scrollLeft(0).scrollTop(0);
            var page = parseInt(obj.find(">.uiPageSetting >input").val()) - 1;
            if(target.hasClass("uiRefreshBtn"))
            {
                var index = page * opts.resultsPerPage;
                setTable.call(self, dataTable, index, true);
            }
            else
            if(target.hasClass("uiGoToFirstBtn"))
            {
                setTable.call(self, dataTable, 0, true);
            }
            else
            if(target.hasClass("uiPrevBtn"))
            {
                var index = (page - 1) * opts.resultsPerPage;
                setTable.call(self, dataTable, index, true);
            }
            else
            if(target.hasClass("uiNextBtn"))
            {
                var index = (page + 1) * opts.resultsPerPage;
                setTable.call(self, dataTable, opts.currentIndex + opts.resultsPerPage, true);
            }
            else
            if(target.hasClass("uiGoToLastBtn"))
            {
                setTable.call(self, dataTable, opts.gridJSON.total - opts.resultsPerPage, true);
            }
        })
        .find(">.uiPageShowSelect >select").bind("change.uiGrid", function(e)
        {
            opts.resultsPerPage = parseInt($(this).val());
            var totalPage = Math.ceil(opts.gridJSON.total / opts.resultsPerPage);
            var textValue = "of " + totalPage;
            $(this).parent().siblings(".uiPageSetting").children("span:last").text(textValue);
            var dataTable = $(">.uiContent >.uiDataContainer >table >tbody", self);
            setTable.call(self, dataTable, 0, true);
        });
        if(opts.resizable)
        {
            var resizeStopFunc = function(mask, width, height)
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
                var contentHeight = height - otherItemHeightTotal - outerOffset;
                content.height(contentHeight).children(".uiDataContainer").height(contentHeight - opts.columnTableHeight);
            };
            self.resizable({
                event : {start : opts.resizeStart, doing : opts.resizing,  stop : resizeStopFunc},
                minHeight : opts.minHeight,
                maxHeight : opts.maxHeight,
                minWidth : opts.minWidth,
                maxWidth : opts.maxWidth
            });
        }
        return self;
    }

    function setTable(dataTable, index, clearData)
    {
        var self = this, opts = self.opts;
        if(opts.gettingMoreData)
        {
            return ;
        }
        if(index < 0)
        {
            index = 0;
        }
        else
        if(index > opts.gridJSON.total - 1)
        {
            return ;
        }
        var offsetIndex, columnWidthList = opts.columnWidthList;
        var data = opts.gridJSON.data;
        var getIndex = opts.currentIndex = index;
        if(opts.currentIndex + opts.resultsPerPage > opts.gridJSON.total - 1)
        {
            getIndex = opts.gridJSON.total - opts.resultsPerPage - 1;
        }
        if(data[getIndex + opts.resultsPerPage] === null)
        {
            if($.isFunction(opts.getData))
            {
                var btnObj = $(">.uiGridButtonSet .uiRefreshBtn", self).addClass("uiLoading");
                opts.gettingMoreData = true;
                opts.getData({currentIndex : opts.currentIndex}, function(newData)
                {
                    btnObj.removeClass("uiLoading");
                    replaceDataArray(data, newData, opts.currentIndex);
                    var dataTable = $(">.uiContent >.uiDataContainer >table >tbody", self);
                    opts.gettingMoreData = false;
                    setTable.call(self, dataTable, opts.currentIndex, clearData);
                });
            }
            return ;
        }
        if(clearData === true)
        {
            dataTable.empty();
        }
        var total = Math.min(opts.currentIndex + opts.resultsPerPage, opts.gridJSON.total);
        for(var i = opts.currentIndex; i < total; i++)
        {
            var trObj = $("<tr></tr>");
            if(i % 2 === 1)
            {
                trObj.addClass(opts.trEvenClass);
            }
            else
            {
                trObj.addClass(opts.trOddClass);
            }
            var value = data[i];
            if(value === null)
            {
                break;
            }
            for(var j = 0, lenColumn = value.length; j < lenColumn; j++)
            {
                var tdObj = $("<td>" + value[j] + "</td>");
                if(i === 0 || (clearData === true && i === opts.currentIndex))
                {
                    tdObj.width(columnWidthList[j]);
                }
                trObj.append(tdObj);
            }
            dataTable.append(trObj);
        }
        opts.currentPage = Math.ceil((opts.currentIndex + opts.resultsPerPage) / opts.resultsPerPage);
        $(">.uiGridButtonSet >.uiPageSetting > input", self).val(opts.currentPage);
    }

    function setSeparatorPos()
    {
        var self = this, opts = self.opts, columnWidthList = opts.columnWidthList;
        var leftOffset = 0;
        var separatorList = $("> .uiContent > .uiSeparator", self);
        var separatorLeftValue = 0;
        $(">.uiContent >.uiColumnTable td", self).each( function(i)
        {
            separatorLeftValue += $(this).outerWidth();
            separatorList.eq(i).css("left", separatorLeftValue - 1 - opts.scrollLeft);
        });
    }

    function setDataArray(data, total)
    {
        var dataLength = data.length;
        for(var i = dataLength; i < total; i++)
        {
            data.push(null);
        }
    }

    function replaceDataArray(data, newData, replaceIndex)
    {
        var total = replaceIndex + newData.length;
        var index = 0;
        for(var i = replaceIndex; i < total; i++)
        {
            if(data[i] === undefined)
            {
                break;
            }
            data[i] = newData[index++];
        }
    }

    function sortTable(table, opts, index)
    {
        //var date1 = new Date();
        var itemList = table.children();
        var firstTdList = itemList.eq(0).children();
        var columnTotal = firstTdList.length;
        var tmpArr = $.makeArray(itemList);
        var sortOrderList = opts.sortOrderList;
        var columnWidthList = opts.columnWidthList;
        var sortOrder = sortOrderList[index] || "asc";

        itemList.each( function()
        {
            var obj = $(this);
            var key = obj.children().eq(index).html();
            this.gridSortOrderKey = key;
            obj.removeClass();
        });
        tmpArr.sort(compare);
        $(tmpArr[0]).children().each( function(n)
        {
            $(this).width(columnWidthList[n]);
        });
        for(var i = 0, len = tmpArr.length; i < len; i++)
        {
            delete tmpArr[i].gridSortOrderKey;
            if(i % 2 === 0)
            {
                $(tmpArr[i]).addClass(opts.trOddClass);
            }
            else
            {
                $(tmpArr[i]).addClass(opts.trEvenClass);
            }
        }
        table.append(tmpArr);
        function compare(item1, item2)
        {
            var value1 = item1.gridSortOrderKey;
            var value2 = item2.gridSortOrderKey;
            var testReg = /\d+/;
            var result =  testReg.exec(value1);
            if(result !== null)
            {
                value1 = parseInt(value1);
                value2 = parseInt(value2);
            }
            if(value1 > value2)
            {
                if(sortOrder === "asc")
                {
                    return 1;
                }
                return -1;
            }
            else
            if(value1 < value2)
            {
                if(sortOrder === "asc")
                {
                    return -1;
                }
                return 1;
            }
            return 0;
        }

    }

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
        min : null,
        max : null,
        animateTime : $.angela.defaultAnimateDuration,
        
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
        minDateObj : null,
        maxDateObj : null,
        dateContainerHTML : '<div class="uiDateContainer"></div>',
        monthAndYearHTML : '<div class="uiMonthAndYearContainer"><span class="uiPrevMonth uiArrowLeft"></span><span class="uiMonthAndYear"><span class="uiMonth"><span></span></span><span class="uiYear"><span></span></span></span><span class="uiNextMonth uiArrowRight"></span></div>',
        dayContainerHTML : '<div class="uiDayContainer"></div>',
        weeksHTML : null
    };
    $.fn.datePicker = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.datePicker.defaults, init : init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.angela.datePicker = $.extend({}, $.angela.widget, $.angela.datePicker, {
        setSpecialDayList : function(dayList)
        {
            var self = this, opts = self.opts;
            opts.specialDayList = dayList;
            if(checkView(dayList, opts.currentDate))
            {
                setDate.call(self);
            }
            return self;
        },
        addSpecialDayList : function(dayList)
        {
            var self = this, opts = self.opts;
            opts.specialDayList = $.extend({}, opts.specialDayList, dayList);
            if(checkView(dayList, opts.currentDate))
            {
                setDate.call(self);
            }
            return self;
        },
        removeSpecialDayList : function(key)
        {
            var self = this, opts = self.opts;
            if(opts.specialDayList === null)
            {
                return self;
            }
            else if(key === undefined)
            {
                var tempDayList = opts.specialDayList;
                opts.specialDayList = null;
                if(checkView(tempDayList, opts.currentDate))
                {
                    setDate.call(self);
                }
            }
            else if(opts.specialDayList[key] !== undefined)
            {
                var dayList = {};
                dayList[key] = opts.specialDayList[key];
                opts.specialDayList[key] = null;
                delete opts.specialDayList[key];
                if(checkView(dayList, opts.currentDate))
                {
                    setDate.call(self);
                }
            }
            return self;
        }
    });

    function init()
    {
        var self = this, opts = self.opts;
        self.addClass("uiDatePicker uiWidget " + opts.datePickerClass);
        if(opts.dateStr !== null)
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
        if(opts.min !== null)
        {
            var minDateObj = new Date(opts.min);
            if(!isNaN(minDateObj.getFullYear()))
            {
                opts.minDateObj = {
                    year : minDateObj.getFullYear(),
                    month : minDateObj.getMonth(),
                    day : minDateObj.getDate()
                };
            }
        }
        if(opts.max !== null)
        {
            var maxDateObj = new Date(opts.max);
            if(!isNaN(maxDateObj.getFullYear()))
            {
                opts.maxDateObj = {
                    year : maxDateObj.getFullYear(),
                    month : maxDateObj.getMonth(),
                    day : maxDateObj.getDate()
                };
            }
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
        setDate.call(self);

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
        self.width($("> .uiDateContainer > .uiDayContainer > table", self).outerWidth(true) + parseInt($("> .uiDateContainer", self).css("marginLeft"))*2);
        if(isHidden)
        {
            self.hide();
        }
        initEvent.call(self);
        if($.angela.msie6 === true)
        {
            $.angela.hack.fixPNG(self.find(".uiArrowLeft, .uiArrowRight"));
        }
        return self;
    }

    function initEvent()
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
                    if(target.hasClass("disable"))
                    {
                        return false;
                    }
                    var monthStr = opts.dateObj.month + 1;
                    if(monthStr < 10)
                    {
                        monthStr = "0" + monthStr;
                    }
                    var day = parseInt(target.text());
                    var dateStr = monthStr + "/" + day + "/" + opts.dateObj.year;
                    var dateObj = {
                        year : opts.dateObj.year,
                        month : opts.dateObj.month,
                        day : day
                    }
                    if($.isFunction(opts.select))
                    {
                        opts.select.call(self[0], target, dateStr, dateObj, e);
                    }
                }
                $("> .uiDateContainer > .uiMonthAndYearContainer", self).find(".uiMonthList, .uiYearList").hide();
            }
        });
        $(">.uiDateContainer >.uiMonthAndYearContainer", self).click( function(e)
        {
            if(opts.disabled)
            {
                return false;
            }
            var target = $(e.target);
            if(target.hasClass("uiPrevMonth"))
            {
                opts.currentDate.setMonth(opts.currentDate.getMonth() - 1);
                setDate.call(self, "prev");
            }
            else
            if(target.hasClass("uiNextMonth"))
            {
                opts.currentDate.setMonth(opts.currentDate.getMonth() + 1);
                setDate.call(self, "next");
            }
            else
            if(target.parent().hasClass("uiMonth"))
            {
                target.siblings(".uiMonthList").slideToggle(opts.animateTime);
                $("> .uiDateContainer > .uiMonthAndYearContainer", self).find(".uiYearList").hide();
                return false;
            }
            else
            if(target.parent().hasClass("uiYear"))
            {
                target.siblings(".uiYearList").slideToggle(opts.animateTime);
                $("> .uiDateContainer > .uiMonthAndYearContainer", self).find(".uiMonthList").hide();
                return false;
            }
            else
            if(target.parent(".uiMonthList").length)
            {
                var month = $.inArray(target.text(), opts.monthViewArr);
                if(month !== -1)
                {
                    var status = "next";
                    var currentMonth = opts.currentDate.getMonth();
                    if(currentMonth !== month)
                    {
                        if(currentMonth > month)
                        {
                            status = "prev";
                        }
                        opts.currentDate.setMonth(month);
                        setDate.call(self, status);
                    }
                }
                target.parent(".uiMonthList").hide();
                return false;
            }
            else
            if(target.parent(".uiYearList").length)
            {
                var year = parseInt(target.text());
                var currentYear = opts.currentDate.getFullYear();
                if(currentYear !== year)
                {
                    var status = "next";
                    target.siblings().andSelf().each( function(i)
                    {
                        $(this).text(year + 6 - i);
                    });
                    if(currentYear > year)
                    {
                        status = "prev";
                    }
                    opts.currentDate.setFullYear(year);
                    setDate.call(self, status);
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
            return false;
        });
        return self;
    }

    function setDate(status)
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
        var checkMinDate = false;
        var minDateFlag = false;
        var checkMaxDate = false;
        var maxDateFlag = false;
        var html = '<table cellspacing="0" cellpadding="0"><tbody>';
        var firstDayWeek = (opts.dateObj.week - opts.dateObj.day + 36) % 7;
        var dayContainer = $(">.uiDateContainer >.uiDayContainer", self);
        var monthAndYearContainer = $(">.uiDateContainer >.uiMonthAndYearContainer", self);

        var monthStr = opts.dateObj.month + 1;
        if(monthStr < 10)
        {
            monthStr = "0" + monthStr;
        }

        if(todayObj.year === opts.dateObj.year && todayObj.month === opts.dateObj.month)
        {
            todayFlag = true;
        }
        if(opts.minDateObj !== null)
        {
            if(opts.minDateObj.year > opts.dateObj.year || (opts.minDateObj.year === opts.dateObj.year && opts.minDateObj.month > opts.dateObj.month))
            {
                minDateFlag = true;
            }
            else
            if(opts.minDateObj.year === opts.dateObj.year && opts.minDateObj.month === opts.dateObj.month)
            {
                checkMinDate = true;
            }
        }
        else
        {
            checkMinDate = false;
        }
        if(opts.maxDateObj !== null)
        {
            if(opts.maxDateObj.year < opts.dateObj.year || (opts.maxDateObj.year === opts.dateObj.year && opts.maxDateObj.month < opts.dateObj.month))
            {
                maxDateFlag = true;
            }
            else
            if(opts.maxDateObj.year === opts.dateObj.year && opts.maxDateObj.month === opts.dateObj.month)
            {
                checkMaxDate = true;
            }
        }
        else
        {
            checkMaxDate = false;
        }

        if(opts.origDateObj !== null)
        {
            if(opts.origDateObj.year === opts.dateObj.year && opts.origDateObj.month === opts.dateObj.month)
            {
                origDateFlag = true;
            }
        }
        monthAndYearContainer.find("> .uiMonthAndYear > .uiMonth > span:first").html(opts.monthViewArr[opts.dateObj.month]).end().find("> .uiMonthAndYear > .uiYear > span:first").html(opts.dateObj.year);
        html += opts.weeksHTML;
        var total = 30;
        if(opts.dateObj.month === 1)
        {
            total = 28;
            if(opts.dateObj.year % 400 === 0 || (opts.dateObj.year % 4 === 0 && opts.dateObj.year % 100 !== 0))
            {
                total = 29;
            }
        }
        else
        if(opts.dateObj.month % 2 === 0)
        {
            total = 31;
        }
        var day = 1;
        var totalTD = Math.ceil((total + firstDayWeek) / 7 ) * 7;
        for(var i = 0; i < totalTD; i++)
        {
            if(i % 7 === 0)
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
                if(todayFlag && day === todayObj.day)
                {
                    tdClass += " uiTodayTD " + opts.todayClass;
                }
                else
                if(origDateFlag && day === opts.origDateObj.day)
                {
                    tdClass += " uiTodayTD " + opts.originalDateClass;
                }
                var dayClass = "";
                var title = "";
                if(opts.specialDayList !== null)
                {
                    var dateStr = monthStr + "/" + dayStr + "/" + opts.dateObj.year;
                    if(opts.specialDayList[dateStr] !== undefined)
                    {
                        dayClass = opts.specialDayList[dateStr].specialClass;
                        title = opts.specialDayList[dateStr].desc;
                    }
                }
                if((minDateFlag || (checkMinDate && day < opts.minDateObj.day)) || (maxDateFlag || (checkMaxDate && day > opts.maxDateObj.day)))
                {
                    tdClass += " disable";
                }
                html += ('<td class="'+ tdClass + '"><div class="' + dayClass + '" title="' + title + '">' + dayStr + "</div></td>");
                day++;
            }
            if(i % 7 === 6)
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
        else
        if(status === "prev")
        {
            if(opts.tableWidth === 0)
            {
                opts.tableWidth = $(">.uiDateContainer >.uiDayContainer >table", self).outerWidth(true);
            }
            var oldTalbe = dayContainer.children("table");
            dayContainer.prepend(newTable.css("marginLeft", -opts.tableWidth));
            newTable.animate({marginLeft : 0}, opts.animateTime, function()
            {
                oldTalbe.remove();
            });
        }
        else
        {
            if(opts.tableWidth === 0)
            {
                opts.tableWidth = $(">.uiDateContainer >.uiDayContainer >table", self).outerWidth(true);
            }
            var oldTalbe = dayContainer.children("table");
            dayContainer.append(newTable);
            oldTalbe.animate({marginLeft : -opts.tableWidth}, opts.animateTime, function()
            {
                oldTalbe.remove();
            });
        }
        return self;
    }

    function checkView(dayList, currentDate)
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
        positionValue : "40%",
        tipWidth : 0,
        tipHeight : 0,
        showAnimate : "slideDown",
        hideAnimate : "slideUp",
        animateTime : $.angela.defaultAnimateDuration,
        
        beforeShow : null,
        show : null,
        beforeHide : null,
        hide : null,
        
        targetObj : null,
        tipStyle : null,
        arrowOffset : 10,
        widgetKey : null,
        tipHTML : '<div></div><div></div>'
    };

    
    $.fn.tip = function()
    {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var widgetSetting = {defaults : $.angela.tip.defaults, init : init};
        args.push(widgetSetting);
        return $$.initWidget.apply(self, args);
    };
    var $$ = $.angela.tip = $.extend({}, $.angela.widget, $.angela.tip, {
        content : function(content, resetPosition)
        {
            var self = this, opts = self.opts;
            var contentObj = self.children(".uiTipContent");
            if(content === undefined)
            {
                return contentObj;
            }
            contentObj.html(content);
            if(resetPosition === true)
            {
                setPosition.call(self);
            }
            return self;
        },
        arrowPosition : function(value)
        {
            var self = this, opts = self.opts;
            var arrowList = self.children(".uiTipArrowStyle1, .uiTipArrowStyle2");
            if(value === undefined)
            {
                return opts.positionValue;
            }
            if(opts.tipStyle === 1)
            {
                arrowList.css("left", value);
            }
            else
            {
                arrowList.css("top", value);
            }
            opts.positionValue = value;
            return self;
        },
        beforeDestroy : function()
        {
            var self = this, opts = self.opts;
            opts.targetObj.unbind("." + opts.widgetKey);
            return self;
        }
    });

    function init()
    {
        var self = this, opts = self.opts;
        opts.targetObj = $(opts.target);
        if(opts.targetObj.length === 0)
        {
            $$.destroy.call(self);
        }
        var tipObj = $(opts.tipHTML);
        if(opts.direction === "top" || opts.direction === "bottom")
        {
            tipObj.addClass("uiTipArrowStyle1");
            opts.tipStyle = 1;
        }
        else
        {
            opts.tipStyle = 2;
            tipObj.addClass("uiTipArrowStyle2");
        }
        var contentObj = self.children();
        if(contentObj.length === 0)
        {
            self.wrapInner('<div class="uiTipContent" />');
        }
        else
        {
            contentObj.addClass("uiTipContent");
        }
        self.addClass("uiTip uiWidget " + opts.tipClass).prepend(tipObj);
        var cssShow = { position: "absolute", visibility: "hidden", display: "block" };
        $.swap( self[0], cssShow, function()
        {
            setPosition.call(self);
        });
        initEvent.call(self);
        return self.hide();
    }

    function initEvent()
    {
        var self = this, opts = self.opts;
        opts.targetObj.bind("mouseenter." + opts.widgetKey, function(e)
        {
            var target = $(this);
            if($.isFunction(opts.beforeShow))
            {
                if(opts.beforeShow.call(self[0], target, e) === false)
                {
                    return ;
                }
            }
            self.stop(true, true)[opts.showAnimate](opts.animateTime, function()
            {
                if($.isFunction(opts.show))
                {
                    opts.show.call(self[0], target);
                }
            });
        })
        .bind("mouseleave." + opts.widgetKey, function(e)
        {
            var target = $(this);
            if($.isFunction(opts.beforeHide))
            {
                if(opts.beforeHide.call(self[0], target, e) === false)
                {
                    return ;
                }
            }
            self.stop(true, true)[opts.hideAnimate](opts.animateTime, function()
            {
                if($.isFunction(opts.hide))
                {
                    opts.hide.call(self[0], target);
                }
            });
        });
    }

    function setPosition()
    {
        var self = this, opts = self.opts;

        var leftValue = opts.targetObj.offset().left;
        var topValue = opts.targetObj.offset().top;
        var targetWidth = opts.targetObj.outerWidth();
        var targetHeight = opts.targetObj.outerHeight();
        var arrowList = self.children(".uiTipArrowStyle1, .uiTipArrowStyle2");
        var arrow1 = arrowList.eq(0);
        var arrow2 = arrowList.eq(1);
        var tipWidth = 0, tipHeight = 0;
        var setting = {
            top : {
                border : "border-top-color",
                borderNone : "border-bottom"
            },
            bottom : {
                border : "border-bottom-color",
                borderNone : "border-top"
            },
            left : {
                border : "border-left-color",
                borderNone : "border-right"
            },
            right : {
                border : "border-right-color",
                borderNone : "border-left"
            }
        };
        if(opts.tipWidth !== 0)
        {
            self.width(opts.tipWidth);
            tipWidth = opts.tipWidth;
        }
        else
        {
            tipWidth = self.width();
        }
        if(opts.tipHeight !== 0)
        {
            self.height(opts.tipHeight);
            tipHeight = opts.tipHeight;
        }
        else
        {
            tipHeight = self.height();
        }
        self.css({"border-color" : opts.borderColor, "background-color" : opts.backgroundColor});
        arrow1.css(setting[opts.direction].border, opts.borderColor);
        arrow2.css(setting[opts.direction].border, opts.backgroundColor);
        arrowList.css(setting[opts.direction].borderNone, "none");
        var arrow1TopValue, arrow2TopValue, arrow1LeftValue, arrow2LeftValue;
        arrow1TopValue = arrow2TopValue = arrow1LeftValue = arrow2LeftValue = opts.positionValue;
        if(opts.tipStyle === 1)
        {
            leftValue += (targetWidth / 2 - tipWidth / 2);
            arrow1TopValue = -opts.arrowOffset;
            arrow2TopValue = arrow1TopValue + 1;
            if(opts.direction === "bottom")
            {
                topValue += (targetHeight + opts.arrowOffset);
            }
            else
            if(opts.direction === "top")
            {
                topValue -= (tipHeight + opts.arrowOffset);
                arrow1TopValue = tipHeight;
                arrow2TopValue = arrow1TopValue - 1;
            }
        }
        else
        {
            arrow1LeftValue = tipWidth;
            arrow2LeftValue = arrow1LeftValue - 1;
            if(opts.direction === "left")
            {
                leftValue -= (tipWidth + opts.arrowOffset);
            }
            else
            if(opts.direction === "right")
            {
                leftValue += (targetWidth + opts.arrowOffset);
                arrow1LeftValue = -opts.arrowOffset;
                arrow2LeftValue = arrow1LeftValue + 1;
            }
        }
        self.css({"left" : leftValue, "top" : topValue});
        arrow1.css({"top" : arrow1TopValue, "left" : arrow1LeftValue});
        arrow2.css({"top" : arrow2TopValue, "left" : arrow2LeftValue});
        return self;
    }

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
                $(window).scroll( function()
                {
                    clearTimeout(scrollTimer);
                    obj.hide();
                    scrollTimer = setTimeout( function()
                    {
                        var topValue = originTopValue + $(window).scrollTop();
                        var leftValue = originLeftValue + $(window).scrollLeft();
                        obj.css({position : "absolute", top : topValue, left : leftValue}).show();
                        scrollTimer = 0;
                    }, 300);
                });
            }
        },
        fixPNG : function(fixObj)
        {
            if($.angela.msie6 === true && window["DD_belatedPNG"] !== undefined)
            {
                fixObj.each(function()
                {
                    DD_belatedPNG.fixPng(this);
                });
            }
        }
    });
})(jQuery);
