<?php
$ip = filter_input(INPUT_GET, 'ip', FILTER_SANITIZE_STRING);
?>
<!DOCTYPE html> 
<html lang="en"> 
    <head>
        <title>Real time <?= $ip ?> monitor</title>
        <link rel="stylesheet" href="css.css" type="text/css" media="screen" />
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>
        <script type="text/javascript">
            selectedIp = '<?= $ip ?>';
        </script>
        <script type="text/javascript" src="js.js"></script>
    </head>
    <body onload="">
        <div id="log"></div>
        <div id="toolbar">
            <ul id="status">
                <li>Socket status: <span id="socketStatus">Conecting ...</span></li>
                <li>IP: <?= $ip == '' ? 'all' : $ip . " <a href='?ip='>[all]</a>" ?>
                <li>count: <span id="count">0</span></li>
            </ul>
        </div>
    </body>
</html>

