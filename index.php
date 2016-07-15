<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<title>文件上传Demo</title>
<!--<link href="css/default.css" rel="stylesheet" type="text/css" />-->
<link href="css/upload.css" rel="stylesheet" type="text/css" />
<link href="css/font-awesome.min.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="swfupload/swfupload.js"></script>
<script type="text/javascript" src="swfupload/swfupload.queue.js"></script>
<script type="text/javascript" src="js/fileprogress.js"></script>
<script type="text/javascript" src="js/handlers.js"></script>
<script type="text/javascript">
		window.onload = function() {
			var settings = {
				flash_url : "swfupload/swfupload.swf",
				flash9_url : "swfupload/swfupload_fp9.swf",
				upload_url: "upload.php",
				post_params: {"PHPSESSID" : "<?php echo session_id(); ?>"},
				file_size_limit : "10000 MB",
				file_types : "*.*",
				file_types_description : "All Files",
				file_upload_limit : 100,
				file_queue_limit : 0,
				
				button_placeholder_id: "spanButtonPlaceHolder",
			};
			new fileUpload(settings);
	     };
	</script>
</head>
<body>

<div id="content">
	<span id="spanButtonPlaceHolder">
		<span class="btn">
			浏览
		</span>
	</span>
</div>
</body>
</html>
