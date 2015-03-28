function fileUpload(cfg) { 
	var swfu = null;
	var uploadDialogWrapper = null;
	var config = cfg || {};
	this.get = function(n){ 
		return config[n];
	}

	this.set = function(n,v){ 
		config[n] = v;
	}

	this.init();
}

fileUpload.prototype = { 
	init : function() { 
		this.creatUploadDialogBox();
		var settings = { 
			flash_url : "swfupload/swfupload.swf",
			flash9_url : "swfupload/swfupload_fp9.swf",
			upload_url: this.get('upload_url'),
			post_params: this.get('post_params'),
			file_size_limit : this.get('file_size_limit'),
			file_types : this.get('file_types'),
			file_types_description : this.get('file_types_description'),
			file_upload_limit : this.get('file_upload_limit'),
			file_queue_limit : this.get('file_queue_limit'),
			custom_settings : {
				progressTarget : "fsUploadProgress",
				//cancelButtonId : "btnCancel"
			},
			debug: false,

			// Button settings
			button_image_url: this.get('button_image_url'),
			button_width: this.get('button_width'),
			button_height: this.get('button_height'),
			button_placeholder_id: this.get('button_placeholder_id'),
			button_text: this.get('button_text'),
			button_text_style: this.get('button_text_style'),
			button_text_left_padding: this.get('button_text_left_padding'),
			button_text_top_padding: this.get('button_text_top_padding'),
			
			
			swfupload_preload_handler : this.preLoad,
			swfupload_load_failed_handler : this.loadFailed,
			file_queued_handler : this.fileQueued,
			file_queue_error_handler : this.fileQueueError,
			file_dialog_complete_handler : this.fileDialogComplete,
			upload_start_handler : this.uploadStart,
			upload_progress_handler : this.uploadProgress,
			upload_error_handler : this.uploadError,
			upload_success_handler : this.uploadSuccess,
			upload_complete_handler : this.uploadComplete,
			//queue_complete_handler : this.queueComplete
		}
		this.swfu = new SWFUpload(settings);
	},
	creatUploadDialogBox : function () { 
		var uploadDialogBox = document.getElementById('uploadDialogBox');
		if (uploadDialogBox === null|| uploadDialogBox === undefined) { 
			uploadDialogWrapper = document.createElement('div');
			uploadDialogWrapper.className = 'uploadDialog';
			uploadDialogWrapper.id = 'uploadDialogBox';
			uploadDialogWrapper.style.visibility = 'hidden';
			
			var uploadDialogHeader = document.createElement('div');
			uploadDialogHeader.className = 'uploadDialogHeader';

			uploadDialogHeader.onclick = function() { 
				var uploadDialogBody = document.getElementById('uploadDialogBody');
				if (uploadDialogBody.style.display === 'none') { 
					uploadDialogBody.style.display = 'block';
				}else { 
					uploadDialogBody.style.display = 'none';
				}
			}

			var uploadDialogHeaderTitle = document.createElement('span');
			uploadDialogHeaderTitle.className = 'uploadDialogHeaderTitle';
			uploadDialogHeaderTitle.innerHTML = '上传完成';
			uploadDialogHeader.appendChild(uploadDialogHeaderTitle);

			var uploadDialogHeaderSignOut = document.createElement('span');
			uploadDialogHeaderSignOut.className = 'icon-signout icon-1x uploadDialogsignout';

			uploadDialogHeader.appendChild(uploadDialogHeaderSignOut);
			
			uploadDialogWrapper.appendChild(uploadDialogHeader);

			var uploadDialogBody = document.createElement('div');
			uploadDialogBody.className = 'uploadDialogBody';
			uploadDialogBody.id = 'uploadDialogBody';

			var fsUploadProgress = document.createElement('div');
			fsUploadProgress.id = 'fsUploadProgress';
			uploadDialogBody.appendChild(fsUploadProgress);

			uploadDialogWrapper.appendChild(uploadDialogBody);
			document.body.appendChild(uploadDialogWrapper);
		}
	},

	preLoad : function () {
		if (!this.support.loading) {
			alert("你需要Flash Player 9.028或以上版本使用swfupload");
			return false;
		}
	},
	loadFailed : function () {
		alert("加载swfupload文件失败");
	},

	fileQueued : function (file) {
		try {
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setStatus("准备上传");
			//progress.toggleCancel(true, this);

		} catch (ex) {
			this.debug(ex);
		}

	},

	fileQueueError : function (file, errorCode, message) {
		try {
			if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
				alert("上传队列中文件过多\n" + (message === 0 ? "到达最大限制" : "你可以上传" + (message > 1 ? message + "个文件" : "一个文件")));
				return;
			}

			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setError();
			progress.toggleCancel(false);

			switch (errorCode) {
			case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
				progress.setStatus("文件过大");
				this.debug("错误码: 文件过大, 文件名: " + file.name + ", 文件大小: " + file.size + ", 信息: " + message);
				break;
			case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
				progress.setStatus("零字节文件或不能被访问的文件");
				this.debug("错误码: 零字节文件或不能被访问的文件, 文件名: " + file.name + ", 文件大小: " + file.size + ", 信息: " + message);
				break;
			case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
				progress.setStatus("文件类型错误");
				this.debug("错误码: 文件类型错误, 文件名: " + file.name + ", 文件大小: " + file.size + ", 信息: " + message);
				break;
			default:
				if (file !== null) {
					progress.setStatus("未知错误");
				}
				this.debug("错误码: " + errorCode + ", 文件名: " + file.name + ", 文件大小: " + file.size + ", 信息: " + message);
				break;
			}
		} catch (ex) {
	        this.debug(ex);
	    }
	},

	fileDialogComplete : function (numFilesSelected, numFilesQueued) {
		try {
			if (this.customSettings.cancelButtonId !== undefined && numFilesSelected > 0) {
				document.getElementById(this.customSettings.cancelButtonId).disabled = false;
			}
			
			this.startUpload();
		} catch (ex)  {
	        this.debug(ex);
		}
	},

	uploadStart : function (file) {
		try {
			var uploadDialogBox = document.getElementById('uploadDialogBox');
			uploadDialogBox.style.visibility = 'visible';
			var uploadDialogBody = document.getElementById('uploadDialogBody');
			if (uploadDialogBody.style.display === 'none'){ 
				uploadDialogBody.style.display = 'block';
			}
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setStatus("上传中");
			progress.toggleCancel(true, this);
		}
		catch (ex) {}
		
		return true;
	},

	uploadProgress : function (file, bytesLoaded, bytesTotal) {
		try {
			var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);

			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setProgress(percent);
			progress.setStatus("上传中");
		} catch (ex) {
			this.debug(ex);
		}
	},

	uploadSuccess : function (file, serverData) {
		try {
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setComplete(file);
			progress.setStatus("完成");
			progress.toggleCancel(false);

		} catch (ex) {
			this.debug(ex);
		}
	},

	uploadError : function (file, errorCode, message) {
		try {
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setError();
			progress.toggleCancel(false);

			switch (errorCode) {
			case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
				progress.setStatus("上传失败: " + message);
				this.debug("错误码: HTTP Error, 文件名: " + file.name + ", 信息: " + message);
				break;
			case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
				progress.setStatus("上传失败");
				this.debug("错误码: 上传失败, 文件名: " + file.name + ", 文件大小: " + file.size + ", 信息: " + message);
				break;
			case SWFUpload.UPLOAD_ERROR.IO_ERROR:
				progress.setStatus("服务(IO)错误");
				this.debug("错误码: IO错误, 文件名: " + file.name + ", 信息: " + message);
				break;
			case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
				progress.setStatus("证书错误");
				this.debug("错误码: 证书错误, 文件名: " + file.name + ", 信息: " + message);
				break;
			case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
				progress.setStatus("文件大小超出限制");
				this.debug("错误码: 文件大小超出限制, 文件名: " + file.name + ", 文件大小: " + file.size + ", 信息: " + message);
				break;
			case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
				progress.setStatus("验证失败");
				this.debug("错误码: 文件验证失败, 文件名: " + file.name + ", 文件大小: " + file.size + ", 信息: " + message);
				break;
			case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
				// If there aren't any files left (they were all cancelled) disable the cancel button
				if (this.customSettings.cancelButtonId !== undefined && this.getStats().files_queued === 0) {
					document.getElementById(this.customSettings.cancelButtonId).disabled = true;
				}
				progress.setStatus("取消");
				progress.setCancelled();
				break;
			case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
				progress.setStatus("停止");
				break;
			default:
				progress.setStatus("未知错误: " + errorCode);
				this.debug("错误码: " + errorCode + ", 文件名: " + file.name + ", 文件大小: " + file.size + ", 信息: " + message);
				break;
			}
		} catch (ex) {
	        this.debug(ex);
	    }
	},

	uploadComplete : function (file) {
		if (this.customSettings.cancelButtonId !== undefined && this.getStats().files_queued === 0) {
			document.getElementById(this.customSettings.cancelButtonId).disabled = true;
		}
	},

	queueComplete : function (numFilesUploaded) {
		var status = document.getElementById("divStatus");
		status.innerHTML = numFilesUploaded + " 文件" + (numFilesUploaded === 1 ? "" : "s") + " 被上传";
	}
}

