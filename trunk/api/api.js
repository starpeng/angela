
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
    var apiJsonData= null ;
    $.get("angela_api.xml", function(data)
    {
        apiJsonData = $.xml2json(data);
        setSearchTabsData(0);
    });
    
    function setSearchTabsData(index)
    {
        if(apiJsonData == null)
        {
            return ;
        }
        var html = "";
        if(index == 0)
        {
            $.each(apiJsonData.categories[0].category, function(i, item)
            {
                var classStr = "oddItemStyle1";
                if(i % 2 == 0)
                {
                    classStr = "evenItemStyle1";
                }
                html += ("<li class='" + classStr + "'>" + item.name + "</li>");
            });
        }
        $("#searchTabs").tabs("item", index, "<ul>" + html + "</ul>");
    }
    
    var serchTabsWidth = $("#searchTabs").height(contentHeight - 10).tabs({
        closableArray : [],
        tabsItemWidth : 80,
        tabsItemMargin : 10,
        change : function(e)
        {
            setSearchTabsData($(this).index(".tabItem"));
        }
    }).outerWidth(true);
    setSearchTabsEvent();
    $("#demoContainer").width(contentWidth - serchTabsWidth - 20).height(contentHeight - 10).dialog({
        controlButton : false
    });
    
    function setSearchTabsEvent()
    {
        $("#searchTabs > .tabItem").click(function(e)
        {
            var target = $(e.target); 
            if(target.parent().parent(".tabItem").length != 0)
            {
                target.siblings(".selected").click();
                if(target.children("ul").length == 0)
                {
                    var category = target.text();
                    var index = target.index();
                    var html = "";
                    $.each(apiJsonData.entries[0].entry, function(i, item)
                    {
                        $.each(item.category, function(j, value)
                        {
                            if(value.name == category)
                            {
                                var classStr = "oddItemStyle2";
                                if(i % 2 == 0)
                                {
                                    classStr = "evenItemStyle2";
                                }
                                html += ("<li class='" + classStr + "' index='" + i + "'>" + item.name + "</li>");
                                return false;
                            }
                        });
                    });
                    if(html.length != 0)
                    {
                        target.append($("<ul>" + html + "</ul>").hide());
                    }
                }
                else
                {
                    target.find(".selected").removeClass("selected");
                }
                target.toggleClass("selected").children("ul").slideToggle(function()
                {                    
                    target.parent().parent(".tabItem").scrollTop(0);
                });
            }
            else
            {
                target.siblings(".selected").andSelf().toggleClass("selected")
                var index = parseInt(target.attr("index"));
                var data = apiJsonData.entries[0].entry[index];
                $.each(data.example, function(i, item)
                {
                    var widgetType = data.name.split('.')[0];
                    var html = item.html;
                    if(html.length == 0)
                    {
                        html = apiJsonData.htmlsample[0][widgetType];
                    }
                    var demoHTML = "<div class='demoHTML uiBlueBigBorder uiCornerAll'>";
                    if(data.type == "attribute")
                    {
                        demoHTML += ("<h3 class='demoTitle ui30BlueGradientBG'>" + data.name + "<span class='typeDesc'>" + data.type + "</span></h3>");
                        demoHTML += ("<p><span>Version Added:</span>" + data.signature[0].added + "</p>");
                        demoHTML += ("<p><span>Type:</span>" + data.signature[0].type + "</p>");
                        demoHTML += ("<p><span>Default Value:</span>" + data.signature[0].defaultValue + "</p>");
                    }
                    else
                    {   
                        var argumentsHTML = "";                        
                        var funtionHTML = data.name + "(";
                        if(typeof data.signature[0].argument != "undefined")
                        {
                            $.each(data.signature[0].argument, function(i, item)
                            {                            
                                argumentsHTML += ("<span>" + item.name + ":</span>" + item.desc + "<br />");
                                if(item.optional == "true")
                                {
                                    funtionHTML += ("[" + item.name + "],")
                                }
                                else
                                {
                                     funtionHTML += (item.name + ",")
                                }
                                
                            });
                            
                            funtionHTML = funtionHTML.substring(0, funtionHTML.length - 1) + ")";
                        }
                        else
                        {
                            funtionHTML += ")";
                        }
                        demoHTML += ("<h3 class='demoTitle ui30BlueGradientBG'>" + funtionHTML + "<span class='typeDesc'>" + data.type + "</span></h3>");
                        demoHTML += ("<p><span>Version Added:</span>" + data.signature[0].added + "</p>");
                        
                        demoHTML += ("<p class='argumentsContainer'><span>" + funtionHTML + "</span><span class='returnContainer'>reutrn: " + data.returnValue + "</span><br />" + argumentsHTML + "</p>");
                    }
                    demoHTML += ("<p><span>Description:</span>" + data.desc + "</p>");
                    demoHTML += ("<div class='htmlContainer'><h3>HTML</h3><pre>" + html.replace(/</g, "&lt ").replace(/>/g, "&gt ").replace("\n", "<br />") + "</pre></div>");
                    
                    if(item.css.length != 0)
                    {
                        var cssData = "<style type='text/css'>" + item.css + "</style>";
                        $(cssData).appendTo("body");
                        demoHTML += ("<h3>CSS</h3><pre>" + item.css + "</pre>");
                    }
                    demoHTML += ("<h3>CODE</h3><pre><code>" + item.code.replace(/</g, "&lt ").replace(/>/g, "&gt ") + "</code></pre>");
                    demoHTML += "</div>";
                    var func = new Function(item.code);
                    var demoObj = $("#demo");
                    //clearTimeout(window.globalTimer);
                    if(demoObj.length != 0)
                    {
                        demoObj[$.angela.widget.widget.call(demoObj)]("destroy");
                    } 
                                     
                    $("#demoContainer >.demoContet").empty().scrollTop(0).html(demoHTML + html);
                    $("<img />").attr("src", "images/" + widgetType + ".png").appendTo("#demoContainer >.demoContet");
                    $("#demoContainer >.demoContet >.demoHTML >.htmlContainer h3").click(function()
                    {
                        $(this).next("pre").toggle();
                    })
                    func();
                });
            }
        });
    }

});