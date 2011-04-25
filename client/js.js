var timeout = 5000;
var wsServer = '192.168.2.2:8880';
var unread = 0;
var focus = false;

var count = 0;
function updateCount() {
    count++;
    $("#count").text(count);
}

function cleanString(string) {
    return string.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function updateUptime () {
    var now = new Date();
    $("#uptime").text(now.toRelativeTime());
}

function updateTitle(){
    if (unread) {
        document.title = "(" + unread.toString() + ") Real time " + selectedIp + " monitor";
    } else {
        document.title = "Real time " + selectedIp + " monitor";
    }
}

function pad(n) {
    return ("0" + n).slice(-2);
}

function startWs(ip) {
    try {
        ws = new WebSocket("ws://" + wsServer + "?ip=" + ip);
        $('#toolbar').css('background', '#65A33F');
        $('#socketStatus').html('Connected to ' + wsServer);
        //console.log("startWs:" + ip);
        //listen for browser events so we know to update the document title
        $(window).bind("blur", function() {
            focus = false;
            updateTitle();
        });

        $(window).bind("focus", function() {
            focus = true;
            unread = 0;
            updateTitle();
        });
    } catch (err) {
        //console.log(err);
        setTimeout(startWs, timeout);
    }

    ws.onmessage = function(event) {
        unread++;
        updateTitle();
        var now = new Date();
        var hh = pad(now.getHours());
        var mm = pad(now.getMinutes());
        var ss = pad(now.getSeconds());

        var timeMark = '[' + hh + ':' + mm + ':' + ss + '] ';
        logString = eval(event.data);
        var host = logString[0];
        var line = "<table class='message'><tr><td width='1%' class='date'>" + timeMark + "</td><td width='1%' valign='top' class='host'><a href=?ip=" + host + ">" + host + "</a></td>";
        line += "<td class='msg-text' width='98%'>" + logString[1]; + "</td></tr>";
        if (logString[2]) {
            line += "<tr><td>&nbsp;</td><td colspan='3' class='msg-text'>" + logString[2] + "</td></tr>";
        }

        $('#log').append(line);
        updateCount();
        window.scrollBy(0, 100000000000000000);
    };

    ws.onclose = function(){
        //console.log("ws.onclose");
        $('#toolbar').css('background', '#933');
        $('#socketStatus').html('Disconected');
        setTimeout(function() {startWs(selectedIp)}, timeout);
    }
}

$(document).ready(function() {
    startWs(selectedIp);
});