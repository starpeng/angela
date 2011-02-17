$(function()
{
	$("#navigation").menu({
		url : "./menu.json"
	});


    $("#plugInList a").fancybox({
        'overlayColor'      : '#0f0f0f',

        'overlayOpacity'    : 0.7

    });
	$("#plugInList .plugInImage").click(function()
	{
	    $("#plugInList a").eq($(this).index()).click();
	});
	$("#plugInList").dialog({
	    controlButton : false
	});
	$("#hotDownloadList").accordion({
		height : 220
	});
	$("#plugDemo").dialog({
		controlButton : false
	});
	$("#welcomeMsg").dialog({
	    controlButton : false
	});
	$("#exampleContainer").dialog({
	    controlButton : false
	});
	$("h3, img", "#exampleContainer").click(function()
	{
	    var obj = $("#exampleContainer a");
        var src = obj.attr("href");
        var title = obj.attr("title");
        createIframe(src, title);
	});
	$("#plugDemo img").click(function()
	{
	    var obj = $("#plugDemo a");
	    var src = obj.attr("href");
	    var title = obj.attr("title");
	    createIframe(src, title);
	});
	function createIframe(src, title)
	{
	    var windowHeight = $(window).height();
        var html = '<div style="width:1010px;" title="' + title + '" ><div><iframe frameborder= "0" width="1000" height="' + (windowHeight - 100) + '" marginheight=0 marginwidth=0 src="' + src + '"></iframe></div></div>';
        var dlg = $(html).hide().appendTo("body");
        var iframeLoad = false;
        createMsgBox();
        dlg.find("iframe").load(function()
        {
            iframeLoad = true;
            if(dlg.is(":hidden"))
            {
                $(".messageBox").dialog("close");
                dlg.show().dialog({position : "center", destroyOnClose : true});
            }
        });
        if($.browser.msie)
        {
            var iframeLoadingTimer = setTimeout( function()
            {
                if(!iframeLoad)
                {
                    $(".messageBox").dialog("close");
                    dlg.show().dialog({position : "center", destroyOnClose : true});
                }
            }, 5000);
        }
	}
	
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
	$("#aboutDlg").dialog({
	    minimize : false
	});
});
