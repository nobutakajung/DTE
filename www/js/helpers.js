Date.prototype.dateslashformat = function(){
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
    var yyyy = this.getFullYear();

    return [(dd>9 ? '' : '0') + dd,
            (mm>9 ? '' : '0') + mm,
            this.getFullYear()
         ].join('/');
}

function GetStartStopDateTimeValue(currentdate) {
	if(currentdate == null) return;

	var year = currentdate.getFullYear();

    var month = (1 + currentdate.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = currentdate.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    var hour = currentdate.getHours().toString();
    hour = hour.length > 1 ? hour : '0' + hour;

    var minute = currentdate.getMinutes().toString();
    minute = minute.length > 1 ? minute : '0' + minute;

    var result =  year + month + day + hour + minute + '00'; 
	return result;
}

function GetStartStopDateTimeTxt(currentdate) {
	if(currentdate == null) return;

	var year = currentdate.getFullYear();

    var month = (1 + currentdate.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = currentdate.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    var hour = currentdate.getHours().toString();
    hour = hour.length > 1 ? hour : '0' + hour;

    var minute = currentdate.getMinutes().toString();
    minute = minute.length > 1 ? minute : '0' + minute;

    var result =  day + "/" + month + "/" + year + " " + hour + ":" + minute;
    return result;
}

function DiffStartStopDate(startDate, stopDate, elemId) {
    if (startDate == null || stopDate == null) return;

    // startDate = new Date(startDate);
    // stopDate = new Date(stopDate);

    var diff = (stopDate - startDate);
    var diffMins = Math.round(diff / 60000);
    return diffMins;
}

function GetTimeFormatFromDateFormat(data) {
    var result = data.substring(8,10) + ':' + data.substring(10,12);
    return result;
}

function IonicAlert($ionicPopup,title,callback){
  var alertPopup = $ionicPopup.alert({title: title});
   alertPopup.then(function(res) {
    if(callback != null) callback();
   });
};

function ConvertQueryResultToArray(data){
    var newArr = [];
    for (var i = 0; i <= data.rows.length - 1; i++) {
        newArr.push(data.rows.item(i));
    };
    return newArr;
};

function filterFlightDatas(data,query){
  query = query.toLowerCase();
  var result = [];
  for (var i = 0; i <= data.length - 1; i++) {
    if(data[i].FlightNo.toLowerCase().indexOf(query) >= 0) result.push(data[i]);
    if(result.length == 8) break;
  };
  return result;
};

function  GetNewDateByDTEDateFormat(inputDate) {
    if(inputDate == null) return null;
    var year = inputDate.substring(0,4);
    var month = inputDate.substring(4,6);
    var day = inputDate.substring(6,8);
    var hour = inputDate.substring(8,10);
    var minute = inputDate.substring(10,12);
    return new Date(year,month,day,hour,minute,0);
}