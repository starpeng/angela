
$( function()
{
    window.globalTimer = 0;
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
            var type = $(this).attr("widgetType");
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
        var type = $(this).attr("widgetType");
        $("#demoContainer .demoContet iframe").attr("src", "./" + scrList[0] + "/" + type + "/" + scrList[1] + ".html");
        return false; 
    });
    $("#demoContainer .demoContet iframe").width($("#demoContainer .demoContet").width() - 5).height($("#demoContainer .demoContet").height() - 5);
    $("#searchTabs  .indexContainer ul").height($("#searchTabs .tabItem").height() - $("#searchTabs .tabItem .search").outerHeight(true) - 30);
    var indexList = $("#searchTabs  .indexContainer ul li");
    var ulObj = $("#searchTabs  .indexContainer ul");
    var listItemHeight = 0;
    $("#searchTabs .tabItem .search input").bind("input", function()
    {
        var key = $(this).val();
        indexList.each(function(n, item)
        {
            if($(this).html().indexOf(key) != -1)
            {
                $(this).addClass("selectIndex").siblings(".selectIndex").removeClass("selectIndex");
                if(listItemHeight == 0)
                {
                     listItemHeight = indexList.outerHeight(true);
                }
                ulObj.scrollTop(n * listItemHeight);
                return false;
            }
        });
    })
    .bind("keypress", function(e)
    {
        if(e.keyCode == 13)
        {
            ulObj.children(".selectIndex:first").click();
        }
    });
    
});