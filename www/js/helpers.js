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

function IonicAlert($ionicPopup,title,callback){
  var alertPopup = $ionicPopup.alert({title: title});
   alertPopup.then(function(res) {
    if(callback != null) callback();
   });
};