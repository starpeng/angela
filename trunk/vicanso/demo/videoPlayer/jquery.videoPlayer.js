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
                var mediaAttr = $$.getMediaAttr.call(self);
                if(mediaAttr.controls)
                {
                    $$.initEvent.call(self);
                }
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
        init : function()
        {
            
        },
        getMediaAttr : function()
        {
            var self = this;
            var videoObj = self.children("video")[0];
            var attrKeyList = ["error", "currentSrc", "networkState", "buffered", "readyState", "seeking", 
            "currentTime", "startTime", "duration", "paused", "defaultPlaybackRate", "playbackRate", "seekable", "ended", 
            "autoplay", "loop", "controls", "volume"];
            var attr = {};
            $.each(attrKeyList, function(i, key)
            {
                if(typeof videoObj[key] == "undefined")
                {
                    attr[key] = null;
                }
                else
                {
                    attr[key] = videoObj[key];
                }
            });
            return attr;
        },
        getAttr : function(key)
        {
            var self = this;
            var videoObj = self.children("video")[0];
            return videoObj[key];
        },
        
        initEvent : function()
        {
            var self = this;
            self.children("video").bind({
                /*浏览器开始请求媒介*/
                loadstart : function(e)
                {
                    var i = 0;
                    console.log("loadstart");
                },
                /*浏览器正在获取媒介*/
                progress : function(e)
                {
                    var i = 0;
                    console.log("progress");
                },
                /*浏览器非主动获取媒介数据，但没有加载完整个媒介资源*/
                suspend : function(e)
                {
                    var i = 0;
                    console.log("suspend");
                },
                /*浏览器在完全加载前中止获取媒介数据*/
                abort : function(e)
                {
                    var i = 0;
                    console.log("abort");
                },
                /*获取媒介数据出错*/
                error : function(e)
                {
                    var i = 0;
                    console.log("error");
                },
                /*媒介元素的网络状态突然变为未初始化*/
                emptied : function(e)
                {
                    var i = 0;
                    console.log("emptied");
                },
                /*浏览器获取媒介数据异常*/
                stalled : function(e)
                {
                    var i = 0;
                    console.log("stalled");
                },
                /*即将开始播放*/
                play : function(e)
                {
                    var i = 0;
                    console.log("play");
                },
                /*暂停播放*/
                pause : function(e)
                {
                    var i = 0;
                    console.log("pause");
                },
                /*浏览器获取完媒介资源的时长和尺寸*/
                loadedmetadata : function(e)
                {
                    var i = 0;
                    console.log("loadedmetadata");
                },
                /*已加载当前播放位置的媒介数据*/
                loadeddata : function(e)
                {
                    var i = 0;
                    console.log("loadeddata");
                },
                /*播放由于下一帧无效（例如未加载）而已停止（但浏览器确认下一帧会马上有效）*/
                waiting : function(e)
                {
                    var i = 0;
                    console.log("waiting");
                },
                /*已经开始播放*/
                playing : function(e)
                {
                    var i = 0;
                    console.log("playing");
                },
                /*浏览器能够开始媒介播放，但估计以当前速率播放不能直接将媒介播放完（播放期间需要缓冲）*/
                canplay : function(e)
                {
                    var i = 0;
                    console.log("canplay");
                },
                /*浏览器估计以当前速率直接播放可以直接播放完整个媒介资源（期间不需要缓冲）*/
                canplaythrough : function(e)
                {
                    var i = 0;
                    console.log("canplaythrough");
                },
                /*浏览器正在请求数据（seeking属性值为true）*/
                seeking : function(e)
                {
                    var i = 0;
                    console.log("seeking");
                },
                /*浏览器停止请求数据（seeking属性值为false）*/
                seeked : function(e)
                {
                    var i = 0;
                    console.log("seeked");
                },
                /*当前播放位置（currentTime属性）改变*/
                timeupdate : function(e)
                {
                    var i = 0;
                    console.log("timeupdate");
                },
                /*播放由于媒介结束而停止*/
                ended : function(e)
                {
                    var i = 0;
                    console.log("ended");
                },
                /*默认播放速率（defaultPlaybackRate属性）改变或播放速率（playbackRate属性）改变*/
                ratechange : function(e)
                {
                    var i = 0;
                    console.log("ratechange");
                },
                /*媒介时长（duration属性）改变*/
                durationchange : function(e)
                {
                    var i = 0;
                    console.log("durationchange");
                },
                /*音量（volume属性）改变或静音（muted属性）*/
                volumechange : function(e)
                {
                    var i = 0;
                    console.log("volumechange");
                }
            });
        }
    };

})(jQuery);