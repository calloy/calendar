//存放公共函数
function wnli(y,m,d){
	//====获取指定日期万年历
  			mui.ajax('http://japi.juhe.cn/calendar/day',{ 
					data:{
						date:y+'-'+(m+1)+'-'+d, 
						key:'f4c6703bc20366e299e4ceefab101479'
					},
					dataType:'json',//服务器返回json格式数据
					type:'get',//HTTP请求类型
					timeout:10000,//超时时间设置为10秒；
					success:function(data){
//						alert(data);
						//服务器返回响应，根据响应结果，显示数据
				//		var weather = document.getElementsByClassName('weather');
				//		weather.innerText = 
						var Obj = eval(data);
						if (Obj.reason !== 'successed!'){
							weather =  '获取天气数据失败';
						} 
						document.getElementsByClassName('nongli-date')[0].innerHTML = '农历' + Obj.result.data.lunar;
						document.getElementsByClassName('nongli-good')[0].innerText ='易： '+ Obj.result.data.suit;
						document.getElementsByClassName('nongli-bad')[0].innerText = '忌： ' +Obj.result.data.avoid
//						nongli = '<p>农历' + Obj.result.data.lunarYear + Obj.result.data.lunar + Obj.result.data.weekday +'</p><p><b class="txt-red">宜</b>'+Obj.result.data.suit+'</p><p><p><b class="txt-red">忌</b>'+Obj.result.data.avoid;
//						document.getElementsByClassName('nongli')[0].innerHTML = nongli;  
				
					},
					error:function(xhr,type,errorThrown){ 
						//异常处理；
						console.log(type);
					}
				});
  			
}
//函数说明
//点击获取当前日期的万年历状态
//s --  点击的元素节点
//day -- 当前日期
function dianji(s,day){
	//撤销所有选中状态
	l = document.getElementsByClassName('rili-box')
	for(var i = 0;i < 42;i++){
		lclassname =l[i].getAttribute('class');
		l[i].setAttribute('class',lclassname.replace('select-day',''))
		lclassname =l[i].getAttribute('class');
		l[i].setAttribute('class',lclassname.replace('today',''))
	}
	//设置当前点击对象状态
	s.childNodes[1].setAttribute('class','rili-box select-day');
	//如果是当天日期，设置当天状态
	if (s.childNodes[1].childNodes[0].innerText == day.getDate()){
		s.childNodes[1].setAttribute('class','rili-box select-day today');
	}
	
}

//软件更新思路
//发送本地应用版本号到服务器
//服务器返回是否要更新,更新地址等信息
//本地下载更新包,安装更新.


var wgtVer=null
//var checkUrl="http://demo.dcloud.net.cn/test/update/check.php";
//var wgtUrl="http://demo.dcloud.net.cn/test/update/H5EF3C469.wgt"; 
var checkUrl="http://app.yooou.cn/calendar/update/ver/";
var wgtUrl=null; 
// 获取本地应用资源版本号
function getVersion(){
	plus.runtime.getProperty(plus.runtime.appid,function(inf){
        wgtVer=inf.version;
        checkUrl = checkUrl + wgtUrl;
        console.log("当前应用版本："+wgtVer);
    });	
}

// 检测更新
function checkUpdate(){
	getVersion();
    plus.nativeUI.showWaiting("检测更新...");
    var xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        switch(xhr.readyState){
            case 4:
            plus.nativeUI.closeWaiting();
            if(xhr.status==200){
                console.log("检测更新成功："+xhr.responseText);
                var newVer=xhr.responseText;
//              if(wgtVer&&newVer&&(wgtVer!=newVer)){
//                  downWgt();  // 下载升级包
//              }else{
//                  plus.nativeUI.alert("无新版本可更新！");
//              }
				wgtUrl = newVer;
				downWgt();
            }else{
                console.log("检测更新失败！");
                plus.nativeUI.alert("检测更新失败！");
            }
            break;
            default:
            break;
        }
    }
//  xhr.responseType = 'json';
    xhr.open('POST',checkUrl);
    xhr.send();
}
// 下载wgt文件

function downWgt(){
    plus.nativeUI.showWaiting("下载wgt文件...");
    plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
        if ( status == 200 ) { 
            console.log("下载wgt成功："+d.filename);
            installWgt(d.filename); // 安装wgt包
        } else {
            console.log("下载wgt失败！");
            plus.nativeUI.alert("下载wgt失败！");
        }
        plus.nativeUI.closeWaiting();
    }).start();
}


// 更新应用资源
function installWgt(path){
    plus.nativeUI.showWaiting("安装wgt文件...");
    plus.runtime.install(path,{},function(){
        plus.nativeUI.closeWaiting();
        console.log("安装wgt文件成功！");
        plus.nativeUI.alert("应用资源更新完成！",function(){
            plus.runtime.restart();
        });
    },function(e){
        plus.nativeUI.closeWaiting();
        console.log("安装wgt文件失败["+e.code+"]："+e.message);
        plus.nativeUI.alert("安装wgt文件失败["+e.code+"]："+e.message);
    });
}