;(function($)
{
    var $$ = $.MusicPlayer = {
        opts : {
            player : null,
            musicList : [],
            playingIndex : 0,
            play : null,
            progressChange : null,
            playMode : "normal"
        },

        init : function(options)
        {
            $.extend($$.opts, options);
            $("<div />").attr("id", (new Date).getTime()).appendTo("body").jPlayer({
                ready: function ()
                {
                    $$.opts.player = this.element;
                    $$.playByIndex(0);
                },
                volume: 50,
                swfPath : "../../plugIn/jqplayer",
                customCssIds: true
            })
            .jPlayer("onProgressChange", function(loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime)
            {
                if(totalTime > 0)
                {
                    totalTime = Math.max(totalTime, 120*1000);
                    var playedTimeStr = $.jPlayer.convertTime(playedTime);
                    var totalTimeStr = $.jPlayer.convertTime(totalTime);
                    var start = true;
                    if(playedTime > 0)
                    {
                        start = false;
                    }
                    $$.opts.progressChange(playedTimeStr, totalTimeStr, playedTime / totalTime * 100, start);
                }
            })
            .jPlayer("load", function()
            {
                alert('load');  
            })
            .jPlayer("onSoundComplete", function()
            {
                $$.playNext();
            });
        },
        playByIndex : function(index)
        {
            if($$.opts.player == null)
            {
                return ;
            }
            if(index >= $$.opts.musicList.length)
            {
                index = 0;
            }
            else if(index < 0)
            {
                index = $$.opts.musicList.length - 1;
            }
            $$.opts.player.jPlayer("setFile", $$.opts.musicList[index].url).jPlayer("play");
            $$.opts.playingIndex = index;
            if($.isFunction($$.opts.play))
            {
                $$.opts.play(index);
            }
        },
        playNext : function()
        {
            var index = $$.opts.playingIndex + 1;
            if($$.opts.playMode == "random")
            {
                var index = Math.floor(Math.random() * $$.opts.musicList.length);
            }
            else if($$.opts.playMode == "repeatOne")
            {
                var index = $$.opts.playingIndex;
            }
            $$.playByIndex(index);
        },
        playPrev : function()
        {
            var index = $$.opts.playingIndex - 1;
            if($$.opts.playMode == "random")
            {
                var index = Math.floor(Math.random() * $$.opts.musicList.length);
            }
            else if($$.opts.playMode == "repeatOne")
            {
                var index = $$.opts.playingIndex;
            }
            $$.playByIndex(index);
        },
        setVolume : function(value)
        {
            if($$.opts.player === null)
            {
                return ;
            }
            $$.opts.player.jPlayer("volume", value);
        },
        play : function()
        {
            if($$.opts.player === null)
            {
                return ;
            }
            $$.opts.player.jPlayer("play");
        },
        pause : function()
        {
            if($$.opts.player === null)
            {
                return ;
            }
            $$.opts.player.jPlayer("pause");
        },
        stop : function()
        {
            if($$.opts.player === null)
            {
                return ;
            }
            $$.opts.player.jPlayer("stop");
        },
        addMusic : function(musicObj)
        {
            $$.opts.musicList.push(musicObj);
        },
        delMusic : function(indexArr)
        {
            indexArr.reverse();
            var len = indexArr.length;
            for(var i = 0; i < len; i++)
            {
                $$.opts.musicList.splice(indexArr[i], 1);
            }
        },
        setPlayMode : function(mode)
        {
            $$.opts.playMode = mode;
        }
    }
})(jQuery);