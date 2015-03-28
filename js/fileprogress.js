/**
 *构造函数
 *file SWFUpload中的对象
 *targetID 进度框Id
**/
function FileProgress(file, targetID) {
	this.fileProgressID = file.id;

	this.opacity = 100;
	this.height = 0;

	this.fileProgressWrapper = document.getElementById(this.fileProgressID);
	if (!this.fileProgressWrapper) {
		this.fileProgressWrapper = document.createElement("div");
		this.fileProgressWrapper.className = "progressWrapper";
		this.fileProgressWrapper.id = this.fileProgressID;

		this.fileProgressElement = document.createElement("div");
		this.fileProgressElement.className = "progressContainer";

		var progressCancel = document.createElement("a");//0
		progressCancel.className = "progressCancel";
		progressCancel.href = "#";
		progressCancel.style.visibility = "hidden";
		progressCancel.appendChild(document.createTextNode(" "));

		var progressText = document.createElement("div");//1
		progressText.className = "progressName";
		progressText.appendChild(document.createTextNode(file.name));

		var progressFileSize = document.createElement("div");//2
		progressFileSize.className = "progressFileSize";
		var size = this.calc(file.size);
		progressFileSize.appendChild(document.createTextNode(size));

		var progressStatus = document.createElement("div");//3
		progressStatus.className = "progressBarStatus";
		progressStatus.innerHTML = "&nbsp;";

		var progressBar = document.createElement("div");//4
		progressBar.className = "progressBarInProgress";

		this.fileProgressElement.appendChild(progressCancel);//0 progressCancel
		this.fileProgressElement.appendChild(progressText);//1 progressName
		this.fileProgressElement.appendChild(progressFileSize);//2 progressFileSize
		this.fileProgressElement.appendChild(progressStatus);//3 progressBarStatus
		this.fileProgressElement.appendChild(progressBar);//4 progressBarInProgress

		this.fileProgressWrapper.appendChild(this.fileProgressElement);

		document.getElementById(targetID).appendChild(this.fileProgressWrapper);
	} else {
		this.fileProgressElement = this.fileProgressWrapper.firstChild;
		this.reset();
	}

	this.height = this.fileProgressWrapper.offsetHeight;
	this.setTimer(null);


}

FileProgress.prototype.setTimer = function (timer) {
	this.fileProgressElement["FP_TIMER"] = timer;
};
FileProgress.prototype.getTimer = function (timer) {
	return this.fileProgressElement["FP_TIMER"] || null;
};

/**
 *重置
**/
FileProgress.prototype.reset = function () {
	this.fileProgressElement.className = "progressContainer";

	this.fileProgressElement.childNodes[3].innerHTML = "&nbsp;";
	this.fileProgressElement.childNodes[3].className = "progressBarStatus";
	
	this.fileProgressElement.childNodes[4].className = "progressBarInProgress";
	this.fileProgressElement.childNodes[4].style.width = "0%";
	
	this.appear();	
};

/**
 *上传进度条
**/
FileProgress.prototype.setProgress = function (percentage) {
	this.fileProgressElement.className = "progressContainer uploadProgress";
	this.fileProgressElement.childNodes[4].className = "progressBarInProgress";
	this.fileProgressElement.childNodes[4].style.width = percentage + "%";
	this.fileProgressElement.childNodes[4].innerHTML = percentage + "%";

	this.appear();	
};

/**
 *上传成功
**/
FileProgress.prototype.setComplete = function () {
	this.fileProgressElement.className = "progressContainer complete";
	this.fileProgressElement.childNodes[4].className = "progressBarComplete";
	this.fileProgressElement.childNodes[4].style.display = 'none';
	//this.fileProgressElement.childNodes[4].style.width = "";

	var oSelf = this;
	this.setTimer(setTimeout(function () {
		//oSelf.disappear();
		var uploadDialogBody = document.getElementById('uploadDialogBody');
		uploadDialogBody.style.display = 'none';
	}, 10000));
};

/**
 *上传失败
**/
FileProgress.prototype.setError = function () {
	this.fileProgressElement.className = "progressContainer error";
	this.fileProgressElement.childNodes[3].className = "progressBarError";
	this.fileProgressElement.childNodes[3].style.width = "";

	var oSelf = this;
	this.setTimer(setTimeout(function () {
		oSelf.disappear();
	}, 5000));
};

/**
 *上传被取消
**/
FileProgress.prototype.setCancelled = function () {
	this.fileProgressElement.className = "progressContainer";
	this.fileProgressElement.childNodes[3].className = "progressBarError";
	this.fileProgressElement.childNodes[3].style.width = "";

	var oSelf = this;
	this.setTimer(setTimeout(function () {
		oSelf.disappear();
	}, 2000));
};
FileProgress.prototype.setStatus = function (status) {
	this.fileProgressElement.childNodes[3].innerHTML = status;
};


/**
 *隐藏/显示取消按钮
**/
FileProgress.prototype.toggleCancel = function (show, swfUploadInstance) {
	this.fileProgressElement.childNodes[0].style.visibility = show ? "visible" : "hidden";
	if (swfUploadInstance) {
		var fileID = this.fileProgressID;
		this.fileProgressElement.childNodes[0].onclick = function () {
			swfUploadInstance.cancelUpload(fileID);
			return false;
		};
	}
};

/**
 *出现
**/
FileProgress.prototype.appear = function () {
	if (this.getTimer() !== null) {
		clearTimeout(this.getTimer());
		this.setTimer(null);
	}
	
	if (this.fileProgressWrapper.filters) {
		try {
			this.fileProgressWrapper.filters.item("DXImageTransform.Microsoft.Alpha").opacity = 100;
		} catch (e) {
			// If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
			this.fileProgressWrapper.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=100)";
		}
	} else {
		this.fileProgressWrapper.style.opacity = 1;
	}
		
	this.fileProgressWrapper.style.height = "";
	
	this.height = this.fileProgressWrapper.offsetHeight;
	this.opacity = 100;
	this.fileProgressWrapper.style.display = "";
	
};

FileProgress.prototype.calc = function (flow) { 
	var tb = 1099511627776; //1024 * 1024 * 1024*1024 定义TB的计算常量  
    var gb = 1073741824; //1024 * 1024 * 1024 定义GB的计算常量  
    var mb = 1048576; //1024 * 1024定义MB的计算常量  
    var kb = 1024; //定义TB的计算常量  

    if (flow / tb >= 1) {  
		return (Math.round(flow / tb, 2)) + " TB";  
  	} 
  	if (flow / gb >= 1)  {  
      return (Math.round(flow / gb, 2)) + " GB";  
  	}  

	if (flow / mb >= 1) {  
	    return (Math.round(flow / mb, 2)) + " MB";  
	}  
	  
	if (flow / kb >= 1) {  
	    return (Math.round(flow / kb, 2)) + " KB";  
	}
	
	return Math.round(flow, 2) + " B";  
}

/**
 * 进度条框淡出
**/
FileProgress.prototype.disappear = function () {

	var reduceOpacityBy = 15;
	var reduceHeightBy = 4;
	var rate = 30;	// 15 fps

	if (this.opacity > 0) {
		this.opacity -= reduceOpacityBy;
		if (this.opacity < 0) {
			this.opacity = 0;
		}

		if (this.fileProgressWrapper.filters) {
			try {
				this.fileProgressWrapper.filters.item("DXImageTransform.Microsoft.Alpha").opacity = this.opacity;
			} catch (e) {
				// If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
				this.fileProgressWrapper.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + this.opacity + ")";
			}
		} else {
			this.fileProgressWrapper.style.opacity = this.opacity / 100;
		}
	}

	if (this.height > 0) {
		this.height -= reduceHeightBy;
		if (this.height < 0) {
			this.height = 0;
		}

		this.fileProgressWrapper.style.height = this.height + "px";
	}

	if (this.height > 0 || this.opacity > 0) {
		var oSelf = this;
		this.setTimer(setTimeout(function () {
			oSelf.disappear();
		}, rate));
	} else {
		this.fileProgressWrapper.style.display = "none";
		this.setTimer(null);
	}
};