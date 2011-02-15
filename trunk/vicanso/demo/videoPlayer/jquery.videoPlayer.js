;
(function($)
{
    $.fn.videoPlayer = function()
    {
        $$.init.call(this);
    }
    
    var $$ = {
        init : function()
        {
            var self = this;
            if($$.html5VideoSupport)
            {
                $$.initEvent.call(self);
            }
        },
        html5VideoSupport : function()
        {
            return !!document.createElement('video').canPlayType;
        },
        getFlashVersion : function()
        {
            var version = 0, desc;
            if (typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] == "object")
            {
                desc = navigator.plugins["Shockwave Flash"].description;
                if (desc && !(typeof navigator.mimeTypes != "undefined" && navigator.mimeTypes["application/x-shockwave-flash"] && !navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin))
                {
                    version = parseInt(desc.match(/^.*\s+([^\s]+)\.[^\s]+\s+[^\s]+$/)[1], 10);
                }
            }
            else
            if (typeof window.ActiveXObject != "undefined")
            {
                try
                {
                    var testObject = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    if (testObject)
                    {
                        version = parseInt(testObject.GetVariable("$version").match(/^[^\s]+\s(\d+)/)[1], 10);
                    }
                }
                catch(e)
                {
                }
            }
            return version;
        },
        initEvent : function()
        {
            var self = this;
            self.bind({
                loadstart : function(e)
                {
                    var i = 0;
                },
                progress : function(e)
                {
                    var i = 0;
                },
                suspend : function(e)
                {
                    var i = 0;
                },
                abort : function(e)
                {
                    var i = 0;
                },
                error : function(e)
                {
                    var i = 0;
                },
                emptied : function(e)
                {
                    var i = 0;
                },
                stalled : function(e)
                {
                    var i = 0;
                },
                play : function(e)
                {
                    var i = 0;
                },
                pause : function(e)
                {
                    var i = 0;
                },
                loadedmetadata : function(e)
                {
                    var i = 0;
                },
                loadeddata : function(e)
                {
                    var i = 0;
                },
                waiting : function(e)
                {
                    var i = 0;
                },
                playing : function(e)
                {
                    var i = 0;
                },
                canplay : function(e)
                {
                    var i = 0;
                },
                canplaythrough : function(e)
                {
                    var i = 0;
                },
                seeking : function(e)
                {
                    var i = 0;
                },
                seeked : function(e)
                {
                    var i = 0;
                },
                timeupdate : function(e)
                {
                    var i = 0;
                },
                ended : function(e)
                {
                    var i = 0;
                },
                ratechange : function(e)
                {
                    var i = 0;
                },
                durationchange : function(e)
                {
                    var i = 0;
                },
                volumechange : function(e)
                {
                    var i = 0;
                }
            });
        }
    };

})(jQuery);