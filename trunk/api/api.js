
$( function()
{
    window.globalTimer = 0;
    if(typeof console == "undefined")
    {    
        window.console = {
            debug : function(msg)
            {
                alert(msg);
            }
        }
    }
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    $("#apiDlg").width(windowWidth - 5).height(windowHeight - 5).dialog({
        dlgClass : "uiBlueBigBorder  uiCornerAll",
        controlButton : false
    });
    var contentWidth = $("#apiDlg > .content").width();
    var contentHeight = $("#apiDlg > .content").height();
    
    var serchTabsWidth = $("#searchTabs").height(contentHeight - 10).tabs({
        closableArray : [],
        tabsItemWidth : 80,
        tabsItemMargin : 10
    }).outerWidth(true);
    
    $("#demoContainer").width(contentWidth - serchTabsWidth - 30).height(contentHeight - 10).dialog({
        controlButton : false
    });
    
    $("#searchTabs >.tabItem > ul > li").click(function()
    {
        var obj = $(this).children("ul");
        if(obj.length == 0)
        {
            var src = $(this).html();
            var scrList = src.split(".");
            var type = $(this).attr("type");
            $("#demoContainer .demoContet iframe").attr("src", "./" + scrList[0] + "/" + type + "/" + scrList[1] + ".html");
        }
        else
        {
            obj.slideToggle();
        }
    });
    $("#searchTabs >.tabItem > ul > li > ul > li").click(function()
    {
        var src = $(this).html();
        var scrList = src.split(".");
        var type = $(this).attr("type");
        $("#demoContainer .demoContet iframe").attr("src", "./" + scrList[0] + "/" + type + "/" + scrList[1] + ".html");
        return false; 
    });
    $("#demoContainer .demoContet iframe").width($("#demoContainer .demoContet").width() - 5).height($("#demoContainer .demoContet").height() - 5);
});