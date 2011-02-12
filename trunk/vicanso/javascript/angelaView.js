$(function()
{
	$("#navigation").menu({
		url : "./menu.json"
	});
	var src = jQuery.url.param("src") || "angelaExample/accordion.html";

	$("#angelaView").find("iframe").attr("src", src).end().dialog({
	    controlButton : false
	});
	$("#aboutDlg").dialog({
	    minimize : false
	});
});
