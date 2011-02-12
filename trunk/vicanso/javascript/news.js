$(function()
{
	$("#navigation").menu({
		url : "./menu.json"
	});
	$("#newsList").tabs({
		click : function(content)
		{
			var obj = $(content);
            if(obj.children(":not(.loading)").length == 0)
            {
                var url = obj.attr("url");
                $.get("./active/getRss.ashx?rssUrl=" + url, function(data)
                {                	
                    var newsHTML = '<div class="news"></div>';
                    var titleHTML = '<span class="title"></span>';
                    var dateHTML = '<span class="date"></span>';
                    var newsContentHTML = '<p></p>';
                    var linkHTML = '<a>更多信息</a>';
                    var newsList = $.xml2json(data);
                    $.each(newsList.channel[0].item, function(i, item)
                    {
                        var title = $(titleHTML).text(item.title);
                        var date = $(dateHTML).text(item.pubDate);
                        var newsContent = $(newsContentHTML).html($.trim(item.description).replace("\n", "<br />")).append($(linkHTML).attr("href", item.link).attr("title", item.title));
                        obj.children(".loading").remove();
                        $(newsHTML).append(title).append(date).append(newsContent).appendTo(content);
                    });
                });
            }
		}
	});
	
	$("#newsList").click(function(e)
	{
		var target = $(e.target);
		if(target.attr("tagName").toUpperCase() == "A")
		{
			var src = target.attr("href");
			var title = target.attr("title");
			var windowHeight = $(window).height();
            var html = '<div style="width:1010px;" title="' + title + '" ><div><iframe frameborder= "0" width="1000" height="' + (windowHeight - 100) + '" marginheight=0 marginwidth=0 src="' + src + '"></div></iframe></div>';
            var dlg = $(html).hide().appendTo("body");
        
            var iframeLoad = false;
            /*dlg.children("iframe").load( function()
            {
                iframeLoad = true;
                if(dlg.is(":hidden"))
                {
                    dlg.dialog({position : "center", closeOnEscape : true, destroyOnClose : true}).show();
                }
            });
            var iframeLoadingTimer = setTimeout(function(){
                if(!iframeLoad)
                {
            	   dlg.dialog({position : "center", closeOnEscape : true, destroyOnClose : true}).show();
            	}
            }, 5000);
            */
            createMsgBox();
            dlg.find("iframe").load(function()
            {
                iframeLoad = true;
                if(dlg.is(":hidden"))
                {
                    $(".messageBox").dialog("close");
                    dlg.dialog({position : "center", destroyOnClose : true}).show();
                }
            });
            if($.browser.msie)
            {
                var iframeLoadingTimer = setTimeout( function()
                {
                    if(!iframeLoad)
                    {
                        $(".messageBox").dialog("close");
                        dlg.dialog({position : "center", destroyOnClose : true}).show();
                    }
                }, 5000);
            }
            
			return false;
		}
	});
	function createMsgBox()
    {
        var positionStr = "fixed";
        if($.browser.msie && $.browser.version == "6.0")
        {
            var positionStr = "absolute";
        }
        var html = '<div class="messageBox" style="width:200px;position:' + positionStr + ';" title="提示信息"><div><p>正在加载数据，请稍候....</p></div></div>';
        $(html).appendTo("body").dialog({
           position : "rightBottom"
        });
    }
	$("#aboutDlg").dialog();
});
