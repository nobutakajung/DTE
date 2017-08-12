var db;
var tableNames = ['userprofile'];

angular.module('starter')
.service('SQLiteService',function($cordovaSQLite,$q){

	var service = this;

	this.OpenDB = function(){
		if (window.cordova) db = $cordovaSQLite.openDB({ name: "DTEDB.db" }); //device
        else db = window.openDatabase("DTEDB.db", '1', 'my', 1024 * 1024 * 100); // browser
	};

	//data must be array eg. '[aa,bb,123]'
	this.Execute = function(sql,data){
		return $q(function(resolve,reject){
			$cordovaSQLite.execute(db, sql, data).then(
				function(response){resolve(response);},
				function(error){reject(error);});
		});
	};

	this.InitailTables = function(){
		//**Test-Sync-Code
		this.CreateTestSyncTable();
		//**Test-Sync-Code
		this.CreateUserProfileTable();
		this.CreateMedicalTable();
		this.CreateTuitionTable();
		this.CreateRoyalTable();
		this.CreateTimeAttendanceTable();
		this.CreateLeaveTable();
		this.CreateLeaveSummaryTable();
		this.CreateCircularTable();
		this.CreateNewsTable();
		this.CreatePMRoomTable();
		this.CreatePMMsgTable();
		this.CreatePMSubscribeTable();
		this.CreatePMUserInRoomTable();
		this.CreatePMSeenMessage();
		this.CreateNotiHistoryTable();
		this.CreateEmployeeTable();
		this.CreateTimeReportTable();
		//this.CreateMobileConfigTable();
	};

	//**Test-Sync-Code
	this.CreateTestSyncTable = function(){
		//$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS testsync (clientid integer primary key AUTOINCREMENT, Id int, field1 text, field2 text, field3 text, TimeStamp text,deleted boolean,dirty boolean,ts datetime) ");
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS testsync (clientid integer primary key AUTOINCREMENT, Id int, field1 text, field2 text, field3 text, TS text, DL boolean, dirty boolean) ");
	}
	//**Test-Sync-Code

	this.CreateUserProfileTable = function(){
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS userprofile (clientid integer primary key AUTOINCREMENT, UserID text, PrefixName text, Firstname text, Lastname text, Nickname text, Position text, Section text, Department text, CitizenID text, PicturePath text,PictureThumb text, posi_name_gover text, orga_gover text, changeDate text, OfficeTel text, OfficeFax text, MobilePhone text, eMailAddress text, Line text, Facebook text, DL boolean, dirty boolean, TS text)");
	};
	this.CreateMedicalTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS medical(clientid integer primary key AUTOINCREMENT, Id int,EmpID text, HospType text, HospName text, PatientType text, Family text, PatientName text, Disease text, SickGroup int, Total int, DocDate text, PaidDate text, BankName text, IsRead boolean, DL boolean,dirty boolean,TS text)");
	};
	this.CreateTuitionTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS tuition(clientid integer primary key AUTOINCREMENT, Id int,Empl_Code text, Paid_Date text, Total_Amnt int, Vat_Amnt int, Grand_Total int, BankName text, IsRead boolean, DL boolean,dirty boolean,TS text)");
	};
	this.CreateRoyalTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS royal(clientid integer primary key AUTOINCREMENT, Id int,Empl_Code text, Roya_Code text, Roya_Name int, Roya_Date text, DL boolean,dirty boolean,TS text)");
	};
	this.CreateTimeAttendanceTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS timeattendance(clientid integer primary key AUTOINCREMENT, Id int, SequenceID text, EmpID text, StampTime datetime, MachineID text, StampResult boolean, Location text, Airport text, stampdate text, stamptimeonly text, Image text, DL boolean,dirty boolean,TS text)");
	};
	this.CreateTimeReportTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS timereport(clientid integer primary key AUTOINCREMENT, Id int, WORKDATE text, STARTTIME text, OFFTIME text, NOTE text, OUT_EARLY text, OUT_LATE text, TIMECATEGORY text,REMARK text, DL boolean,dirty boolean,TS text)");
	};
	this.CreateLeaveTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS leave(clientid integer primary key AUTOINCREMENT, Id int, Empl_Code text, Empl_Name text, Leave_Code text, Leave_Day text, Leave_From text, Leave_To text, Leave_Date text, Updt_Date text, Tran_Seqe text, Leave_Timecode text, DL boolean,dirty boolean,TS text)");
	};
	this.CreateLeaveSummaryTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS leavesummary(clientid integer primary key AUTOINCREMENT, Id int, EmplCode text, LeaveCode text, LeaveName text, Bring text, YearRight text, SumRight text, Used text, Left text, FiscalYear text, DL boolean,dirty boolean,TS text)");
	};
	this.CreateCircularTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS circular(clientid integer primary key AUTOINCREMENT, Id int, DocID text, DocDate text, Link text, Description text, DocNumber text, DL boolean,dirty boolean,TS text)");	
	};

	this.CreateNewsTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS news(clientid integer primary key AUTOINCREMENT, Id int, Title text, PubDate text, FileName text, DL boolean,dirty boolean,TS text)");	
	};

	//roomtype : 1 = chat , 2 = groupchat
	this.CreatePMRoomTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS pmroom(Id text,roomType int, roomName text, roomIcon text, totalNewMsg int, lastMsg text, TS text)");
	};

	this.CreatePMUserInRoomTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS pmuserinroom(Id integer primary key AUTOINCREMENT, roomId text, userId text)");	
	};

	this.CreateNotiHistoryTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS notihistory(clientid integer primary key AUTOINCREMENT,Id int, Empl_Code text, NotiType int, NotiPriority int, Message text, MenuPath text, NotiTime text, DL boolean, dirty boolean, TS text)");	
	};

	this.CreateMobileConfigTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS mobileconfig(Id integer primary key AUTOINCREMENT, key text, value text)").then(function(response){
			//check if first time insert default configs
			$cordovaSQLite.execute(db,"select count(*) as totalConfig from mobileconfig").then(function(response){
				if(response != null){
					var count = ConvertQueryResultToArray(response)[0].totalConfig;
					if(+count == 0){
						//notification sound
						$cordovaSQLite.execute(db,"insert into mobileconfig(key,value) values('notification_sound','true') ");
						//theme
						$cordovaSQLite.execute(db,"insert into mobileconfig(key,value) values('theme','default') ");
					}
				}
			});
		},function(err){});
	};	

	//unseen : 0 = unseen(in case when message coming but user didn't active in room, for select and resend to notify sender reciver seen message) , 1 = seen
	//msgAct : 0 = normal , 1 = resend , 2 = show resend | delete button
	this.CreatePMMsgTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS pmmsg(Id integer primary key AUTOINCREMENT,MessageId text, Empl_Code text, message text, readTotal int, roomId text, TS text, unseen int, msgAct int)");
	};

	this.CreatePMSubscribeTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS pmsubscribe(clientid integer primary key AUTOINCREMENT, Empl_Code text, Firstname text, Lastname text, PictureThumb text)");
	};

	this.CreatePMSeenMessage = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS pmseenmessage(Id integer primary key AUTOINCREMENT, Empl_Code text, MessageId text, roomId text)");
	};

	this.CreateEmployeeTable = function(){
		$cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS employee(clientid integer primary key AUTOINCREMENT,Id int, EC text, NM text, DL boolean, dirty boolean, TS text)");
	};

	this.DeleteAllTables = function(){
		return $q(function(resolve,reject){
			var totalProcess = 0;
			for (var i = 0; i <= tableNames.length - 1; i++) {
				currentTableName = tableNames[i];
				$cordovaSQLite.execute(db, "DELETE FROM " + tableNames[i]).then(
					function(){
						totalProcess++;
						if(totalProcess == tableNames.length){
							return resolve();
						}
					},
					function(error){console.log(error);reject(error);});
			};
		});
	};

	this.DropAllTables = function(){
		return $q(function(resolve,reject){
			var totalProcess = 0;
			for (var i = 0; i <= tableNames.length - 1; i++) {
				if(tableNames[i] == 'userprofile') { totalProcess++; continue; }
				$cordovaSQLite.execute(db, "DROP TABLE " + tableNames[i]).then(
					function(){
						totalProcess++;
						if(totalProcess == tableNames.length){
							return resolve();
						}
					},
					function(error){console.log(error);reject(error);});
			};
		});
	};

})
.service('UserProfileSQLite', function(SQLiteService){

	this.SaveUserProfile = function(data){
		//delete previous data first
		var sql;
		sql = "DELETE FROM userprofile"
		SQLiteService.Execute(sql).then(
			function(){
				//insert new data
				sql = "INSERT INTO userprofile (userid, prefixname, firstname, lastname, nickname, position, section, department, citizenid, picturepath, picturethumb, posi_name_gover, orga_gover, changedate, officetel, officefax, mobilephone, emailaddress, line, facebook, DL, dirty, TS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
				var param = [data.UserID,data.PrefixName,data.Firstname,data.Lastname,data.Nickname,data.Position,data.Section,data.Department,data.CitizenID,data.PicturePath,data.PictureThumb,data.posi_name_gover,data.orga_gover,data.changeDate,data.ContactList[0].OfficeTel,data.ContactList[0].OfficeFax,data.ContactList[0].MobilePhone,data.ContactList[0].eMailAddress,data.ContactList[0].Line,data.ContactList[0].Facebook,false,false,data.changeDate];
				SQLiteService.Execute(sql,param).then(function(){},function(error){console.log(error);});
			},
			function(error){console.log(error);})
	};

	this.UpdateUserProfile = function(key,value){
		var sql = "UPDATE medical SET " + key + " = ?";
		var param = [value];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('userprofile',false).then(function(response){return response;},function(error){return error;});
	};

	this.GetUserProfile = function(){
		return SQLiteService.Execute('SELECT * FROM userprofile').then(function(response){return response;},function(error){return error;});	
	}
})
.service('MedicalSQLite', function(SQLiteService){
	//***Necessary-Method
	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('medical').then(function(response){return response;},function(error){return error;});
	};

	this.CountByServerId = function(serverid){
		return SQLiteService.CountByServerId(serverid,'medical').then(function(response){return response;},function(error){return error;});		
	};

	this.CountIsNotDirtyById = function(id){
		return SQLiteService.CountIsNotDirtyById(id,'medical').then(function(response){return response;},function(error){return error;});		
	};

	
	this.GetDataByTSIsNull = function(){
		return SQLiteService.GetDataByTSIsNull('medical');
	};

	this.GetDataIsDirty = function(){
		return SQLiteService.GetDataIsDirty("medical");
	};

	this.DeleteDataIsFlagDeleted = function(){
		return SQLiteService.DeleteDataIsFlagDeleted("medical");
	};

	this.Update = function(data,isDirty,clientUpdate){
		var sql;
		if(clientUpdate)
			sql = "UPDATE medical SET Id = ?,EmpID = ?, HospType = ?, HospName = ?, PatientType = ?, Family = ?, PatientName = ?, Disease = ?, SickGroup = ?, Total = ?, DocDate = ?, PaidDate = ?, BankName = ?, IsRead = ?, DL = ?,dirty = ?,TS = ? WHERE clientid = " + data.clientid;	
		else
			sql = "UPDATE medical SET Id = ?,EmpID = ?, HospType = ?, HospName = ?, PatientType = ?, Family = ?, PatientName = ?, Disease = ?, SickGroup = ?, Total = ?, DocDate = ?, PaidDate = ?, BankName = ?, IsRead = ?, DL = ?,dirty = ?,TS = ? WHERE Id = " + data.Id;
		var param = [data.Id,data.EmpID,data.HospType,data.HospName,data.PatientType,data.Family,data.PatientName,data.Disease,data.SickGroup,data.Total,data.DocDate,data.PaidDate,data.BankName,data.IsRead,data.DL,isDirty,data.TS];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.Add = function(data,createFromClient){
		var sql = "INSERT INTO medical (id, empid, hosptype, hospname, patienttype, family, patientname, disease, sickgroup, total, docdate, paiddate, bankname, isread, DL, dirty, TS) VALUES ";
		var param = []; 
		var rowArgs = [];
		data.forEach(function(item){
			rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
			param.push(item.Id);
			param.push(item.EmpID);
			param.push(item.HospType);
			param.push(item.HospName);
			param.push(item.PatientType);
			param.push(item.Family);
			param.push(item.PatientName);
			param.push(item.Disease);
			param.push(item.SickGroup);
			param.push(item.Total);
			param.push(item.DocDate);
			param.push(item.PaidDate);
			param.push(item.BankName);
			param.push(item.IsRead);
			param.push(item.DL);
			//dirty
			if(createFromClient) param.push(true);
			else param.push(false);
			//TS
			if(createFromClient) param.push(null);
			else param.push(item.TS);
		});
		sql += rowArgs.join(', ');
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});
	};

	this.CountNewItem = function(){
		return SQLiteService.Execute("SELECT count(*) AS newItem FROM medical where IsRead = 'false'").then(function(response){return response;},function(error){return error;});
	};

	this.UpdateIsRead = function(){
		return SQLiteService.Execute("UPDATE medical set IsRead = 'true'").then(function(response){return response;},function(error){return error;});
	};
	//***Necessary-Method

	this.GetSumMedicalTotal = function(fiscalYear){
		return SQLiteService.Execute("SELECT SUM(total) AS total FROM medical where SUBSTR(docdate,5,4) = '" + fiscalYear + "'").then(function(response){return response;},function(error){return error;});
	};

	this.GetDistinctSickGroup = function(){
		return SQLiteService.Execute("SELECT DISTINCT SickGroup FROM medical").then(function(response){return response;},function(error){return error;});
	};

	this.GetMedicals = function(fiscalYear){
		//return SQLiteService.Execute("SELECT * FROM medical where SUBSTR(docdate,5,4) = '" + fiscalYear + "'").then(function(response){return response;},function(error){return error;});
		return SQLiteService.Execute("SELECT * FROM medical where " + GetConditionFiscalYearStr(fiscalYear,'docdate') + " ORDER BY CAST(SUBSTR(docdate,5,4) AS INT) DESC, CAST(SUBSTR(docdate,3,2) AS INT) DESC, CAST(SUBSTR(docdate,1,2) AS INT) DESC").then(function(response){return response;},function(error){return error;});
	};

	this.GetDistinctPaidDate = function(){
		return SQLiteService.Execute("SELECT DISTINCT paiddate FROM medical ORDER BY CAST(SUBSTR(paiddate,5,4) AS INT) DESC, CAST(SUBSTR(paiddate,3,2) AS INT) DESC, CAST(SUBSTR(paiddate,1,2) AS INT) DESC").then(function(response){return response;},function(error){return error;});
	};

	this.DeleteAll = function(){
		return SQLiteService.DeleteAll("medical").then(function(response){return response;},function(error){return error;});	
	};
})
.service('TuitionSQLite', function(SQLiteService){
	//***Necessary-Method
	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('tuition').then(function(response){return response;},function(error){return error;});
	};

	this.CountByServerId = function(serverid){
		return SQLiteService.CountByServerId(serverid,'tuition').then(function(response){return response;},function(error){return error;});		
	};

	this.CountIsNotDirtyById = function(id){
		return SQLiteService.CountIsNotDirtyById(id,'tuition').then(function(response){return response;},function(error){return error;});		
	};

	this.GetDataByTSIsNull = function(){
		return SQLiteService.GetDataByTSIsNull('tuition');
	};

	this.GetDataIsDirty = function(){
		return SQLiteService.GetDataIsDirty("tuition");
	};

	this.DeleteDataIsFlagDeleted = function(){
		return SQLiteService.DeleteDataIsFlagDeleted("tuition");
	};

	this.Update = function(data,isDirty,clientUpdate){
		var sql;
		if(clientUpdate)
			sql = "UPDATE tuition SET Id = ?, Empl_Code = ?, Paid_Date = ?, Total_Amnt = ?, Vat_Amnt = ?, Grand_Total = ?, BankName = ?, IsRead = ?, DL = ?, dirty = ?, TS = ? WHERE clientid = " + data.clientid;
		else
			sql = "UPDATE tuition SET Id = ?, Empl_Code = ?, Paid_Date = ?, Total_Amnt = ?, Vat_Amnt = ?, Grand_Total = ?, BankName = ?, IsRead = ?, DL = ?, dirty = ?, TS = ? WHERE Id = " + data.Id;
		var param = [data.Id,data.Empl_Code,data.Paid_Date,data.Total_Amnt,data.Vat_Amnt,data.Grand_Total,data.BankName,data.IsRead,data.DL,isDirty,data.TS];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.Add = function(data,createFromClient){
		var sql = "INSERT INTO tuition (Id, Empl_Code, Paid_Date, Total_Amnt, Vat_Amnt, Grand_Total, BankName, IsRead, DL, dirty, TS) VALUES ";
		var param = []; 
		var rowArgs = [];
		data.forEach(function(item){
			rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?)");
			param.push(item.Id);
			param.push(item.Empl_Code);
			param.push(item.Paid_Date);
			param.push(item.Total_Amnt);
			param.push(item.Vat_Amnt);
			param.push(item.Grand_Total);
			param.push(item.BankName);
			param.push(item.IsRead);
			param.push(item.DL);
			//dirty
			if(createFromClient) param.push(true);
			else param.push(false);
			//TS
			if(createFromClient) param.push(null);
			else param.push(item.TS);
		});
		sql += rowArgs.join(', ');
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});
	};

	this.CountNewItem = function(){
		return SQLiteService.Execute("SELECT count(*) AS newItem FROM tuition where IsRead = 'false'").then(function(response){return response;},function(error){return error;});
	};

	this.UpdateIsRead = function(){
		return SQLiteService.Execute("UPDATE tuition set IsRead = 'true'").then(function(response){return response;},function(error){return error;});
	};
	//***Necessary-Method

	this.GetSumTuitionGrandTotal = function(fiscalYear){
		return SQLiteService.Execute("SELECT SUM(Grand_Total) AS Grand_Total FROM tuition where SUBSTR(Paid_Date,5,4) = '" + fiscalYear + "'").then(function(response){return response;},function(error){return error;});
	};

	this.DeleteAll = function(){
		return SQLiteService.Execute("DELETE FROM tuition").then(function(response){return response;},function(error){return error;});		
	};

	this.GetDistinctPaidDate = function(){
		return SQLiteService.Execute("SELECT DISTINCT Paid_Date FROM tuition ORDER BY CAST(SUBSTR(Paid_Date,5,4) AS INT) DESC, CAST(SUBSTR(Paid_Date,3,2) AS INT) DESC, CAST(SUBSTR(Paid_Date,1,2) AS INT) DESC").then(function(response){return response;},function(error){return error;});
	};

	this.GetTuitions = function(fiscalYear){
		//return SQLiteService.Execute("SELECT * FROM tuition where SUBSTR(Paid_Date,5,4) = '" + fiscalYear + "'").then(function(response){return response;},function(error){return error;});
		return SQLiteService.Execute("SELECT * FROM tuition where " + GetConditionFiscalYearStr(fiscalYear,'Paid_Date')).then(function(response){return response;},function(error){return error;});
	};
})
.service('RoyalSQLite', function(SQLiteService){
	//***Necessary-Method
	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('royal').then(function(response){return response;},function(error){return error;});
	};

	this.CountByServerId = function(serverid){
		return SQLiteService.CountByServerId(serverid,'royal').then(function(response){return response;},function(error){return error;});		
	};

	this.CountIsNotDirtyById = function(id){
		return SQLiteService.CountIsNotDirtyById(id,'royal').then(function(response){return response;},function(error){return error;});		
	};

	this.GetDataByTSIsNull = function(){
		return SQLiteService.GetDataByTSIsNull('royal');
	};

	this.GetDataIsDirty = function(){
		return SQLiteService.GetDataIsDirty("royal");
	};

	this.DeleteDataIsFlagDeleted = function(){
		return SQLiteService.DeleteDataIsFlagDeleted("royal");
	};

	this.Update = function(data,isDirty,clientUpdate){
		var sql;
		if(clientUpdate)
			sql = "UPDATE royal SET Id = ?, Empl_Code = ?, Roya_Code = ?, Roya_Name = ?, Roya_Date = ?, DL = ?, dirty = ?, TS = ? WHERE clientid = " + data.clientid;
		else
			sql = "UPDATE royal SET Id = ?, Empl_Code = ?, Roya_Code = ?, Roya_Name = ?, Roya_Date = ?, DL = ?, dirty = ?, TS = ? WHERE Id = " + data.Id;
		var param = [data.Id,data.Empl_Code,data.Roya_Code,data.Roya_Name,data.Roya_Date,data.DL,isDirty,data.TS];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.Add = function(data,createFromClient){
		var sql = "INSERT INTO royal (Id, Empl_Code, Roya_Code, Roya_Name, Roya_Date, DL, dirty, TS) VALUES ";
		var param = []; 
		var rowArgs = [];
		data.forEach(function(item){
			rowArgs.push("(?,?,?,?,?,?,?,?)");
			param.push(item.Id);
			param.push(item.Empl_Code);
			param.push(item.Roya_Code);
			param.push(item.Roya_Name);
			param.push(item.Roya_Date);
			param.push(item.DL);
			//dirty
			if(createFromClient) param.push(true);
			else param.push(false);
			//TS
			if(createFromClient) param.push(null);
			else param.push(item.TS);
		});
		sql += rowArgs.join(', ');
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});
	};
	//***Necessary-Method

	this.DeleteAll = function(){
		return SQLiteService.Execute("DELETE FROM royal").then(function(response){return response;},function(error){return error;});		
	};

	this.GetRoyals = function(){
		return SQLiteService.Execute("SELECT * FROM royal ORDER BY Roya_Date DESC").then(function(response){return response;},function(error){return error;});
	};	
})
.service('TimeAttendanceSQLite', function(SQLiteService){
	//***Necessary-Method
	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('timeattendance').then(function(response){return response;},function(error){return error;});
	};

	this.CountByServerId = function(serverid){
		return SQLiteService.CountByServerId(serverid,'timeattendance').then(function(response){return response;},function(error){return error;});		
	};

	this.CountIsNotDirtyById = function(id){
		return SQLiteService.CountIsNotDirtyById(id,'timeattendance').then(function(response){return response;},function(error){return error;});		
	};

	this.GetDataByTSIsNull = function(){
		return SQLiteService.GetDataByTSIsNull('timeattendance');
	};

	this.GetDataIsDirty = function(){
		return SQLiteService.GetDataIsDirty("timeattendance");
	};

	this.DeleteDataIsFlagDeleted = function(){
		return SQLiteService.DeleteDataIsFlagDeleted("timeattendance");
	};

	this.Update = function(data,isDirty,clientUpdate){
		var sql;
		var param;
		if(clientUpdate)
		{
			sql = "UPDATE timeattendance SET Id = ?, SequenceID = ?, EmpID = ?, StampTime = ?, MachineID = ?, StampResult = ?, Location = ?, Airport = ?, stampdate = ?, stamptimeonly = ?, Image = ?, DL = ?, dirty = ?, TS = ? WHERE clientid = " + data.clientid;
			param = [data.Id,data.SequenceID,data.EmpID,data.StampTime,data.MachineID,data.StampResult,data.Location,data.Airport,null,null,data.Image,data.DL,isDirty,data.TS];
		}			
		else
		{
			sql = "UPDATE timeattendance SET Id = ?, SequenceID = ?, EmpID = ?, StampTime = ?, MachineID = ?, StampResult = ?, Location = ?, Airport = ?, stampdate = ?, stamptimeonly = ?, Image = ?, DL = ?, dirty = ?, TS = ? WHERE Id = " + data.Id;		
			param = [data.Id,data.SequenceID,data.EmpID,data.StampTime,data.MachineID,data.StampResult,data.Location,data.Airport,TransformDateToddMMyyyyFormat(data.StampTime),GetTimeByStampTime(data.StampTime),data.Image,data.DL,isDirty,data.TS];
		}
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.Add = function(data,createFromClient){
		var sql = "INSERT INTO timeattendance (Id, SequenceID, EmpID, StampTime, MachineID, StampResult, Location, Airport, stampdate, stamptimeonly, Image, DL, dirty, TS) VALUES ";
		var param = []; 
		var rowArgs = [];
		data.forEach(function(item){
			rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
			param.push(item.Id);
			param.push(item.SequenceID);
			param.push(item.EmpID);
			param.push(item.StampTime);
			param.push(item.MachineID);
			param.push(item.StampResult);
			param.push(item.Location);
			param.push(item.Airport);
			//stampdate
			if(createFromClient) param.push(null);
			else param.push(TransformDateToddMMyyyyFormat(item.StampTime));
			//stamptimeonly
			if(createFromClient) param.push(null);
			else param.push(GetTimeByStampTime(item.StampTime));
			//image
			param.push(item.Image);
			//DL
			param.push(item.DL);
			//dirty
			if(createFromClient) param.push(true);
			else param.push(false);
			//TS
			if(createFromClient) param.push(null);
			else param.push(item.TS);
		});
		sql += rowArgs.join(', ');
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});
	};
	//***Necessary-Method

	this.DeleteAll = function(){
		return SQLiteService.Execute("DELETE FROM timeattendance").then(function(response){return response;},function(error){return error;});		
	};

	this.GetTimeAttendances = function(){
		return SQLiteService.Execute("SELECT * FROM timeattendance ORDER BY stamptime DESC").then(function(response){return response;},function(error){return error;});
	};

	this.GetDistinctStampDateByFromDateAndToDate = function(date){
		return SQLiteService.Execute("SELECT DISTINCT stampdate FROM timeattendance WHERE REPLACE(SUBSTR(StampTime,3,8),'.','')  = '" + date + "'  ORDER BY StampTime DESC").then(function(response){return response;},function(error){return error;});
	};

	this.GetDistinctMonthYear = function(){
		return SQLiteService.Execute("select distinct substr(stampdate,3,6) as monthyear from timeattendance order by substr(stampdate,5,4) desc, substr(stampdate,3,2) desc limit 12").then(function(response){return response;},function(error){ return error;});
	};
})
.service('LeaveSQLite',function(SQLiteService){
	//***Necessary-Method
	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('leave').then(function(response){return response;},function(error){return error;});
	};

	this.CountByServerId = function(serverid){
		return SQLiteService.CountByServerId(serverid,'leave').then(function(response){return response;},function(error){return error;});		
	};

	this.CountIsNotDirtyById = function(id){
		return SQLiteService.CountIsNotDirtyById(id,'leave').then(function(response){return response;},function(error){return error;});		
	};

	this.GetDataByTSIsNull = function(){
		return SQLiteService.GetDataByTSIsNull('leave');
	};

	this.GetDataIsDirty = function(){
		return SQLiteService.GetDataIsDirty("leave");
	};

	this.DeleteDataIsFlagDeleted = function(){
		return SQLiteService.DeleteDataIsFlagDeleted("leave");
	};

	this.Update = function(data,isDirty,clientUpdate){
		var sql;
		if(clientUpdate)
			sql = "UPDATE leave SET Id = ?, Empl_Code = ?, Empl_Name = ?, Leave_Code = ?, Leave_Day = ?, Leave_From = ?, Leave_To = ?, Leave_Date = ?, Updt_Date = ?, Tran_Seqe = ?, Leave_Timecode = ?, DL = ?, dirty = ?, TS = ? WHERE clientid = " + data.clientid;
		else
			sql = "UPDATE leave SET Id = ?, Empl_Code = ?, Empl_Name = ?, Leave_Code = ?, Leave_Day = ?, Leave_From = ?, Leave_To = ?, Leave_Date = ?, Updt_Date = ?, Tran_Seqe = ?, Leave_Timecode = ?, DL = ?, dirty = ?, TS = ? WHERE Id = " + data.Id;
		var param = [data.Id,data.Empl_Code,data.Empl_Name,data.Leave_Code,data.Leave_Day,data.Leave_From,data.Leave_To,data.Leave_Date,data.Updt_Date,data.Tran_Seqe,data.Leave_Timecode,data.DL,isDirty,data.TS];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.Add = function(data,createFromClient){
		var sql = "INSERT INTO leave (Id, Empl_Code, Empl_Name, Leave_Code, Leave_Day, Leave_From, Leave_To, Leave_Date, Updt_Date, Tran_Seqe, Leave_Timecode, DL, dirty, TS) VALUES ";
		var param = []; 
		var rowArgs = [];
		data.forEach(function(item){
			rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
			param.push(item.Id);
			param.push(item.Empl_Code);
			param.push(item.Empl_Name);
			param.push(item.Leave_Code);
			param.push(item.Leave_Day);
			param.push(item.Leave_From);
			param.push(item.Leave_To);
			param.push(item.Leave_Date);
			param.push(item.Updt_Date);
			param.push(item.Tran_Seqe);
			param.push(item.Leave_Timecode);
			param.push(item.DL);
			//dirty
			if(createFromClient) param.push(true);
			else param.push(false);
			//TS
			if(createFromClient) param.push(null);
			else param.push(item.TS);
		});
		sql += rowArgs.join(', ');
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});
	};
	//***Necessary-Method

	this.DeleteAll = function(){
		return SQLiteService.Execute("DELETE FROM leave").then(function(response){return response;},function(error){return error;});		
	};

	this.GetLeaves = function(){
		return SQLiteService.Execute("SELECT * FROM leave ORDER BY CAST(SUBSTR(Leave_From,5,4) AS INT) DESC, CAST(SUBSTR(Leave_From,3,2) AS INT) DESC, CAST(SUBSTR(Leave_From,1,2) AS INT) DESC ").then(function(response){return response;},function(error){return error;});
	};

	this.GetLeavesByLeaveCode = function(leaveCode,fiscalYear){
		return SQLiteService.Execute("SELECT * FROM leave WHERE Leave_Code = '" + leaveCode + "' and (substr(Leave_From,5)||substr(Leave_From,3,2)||substr(Leave_From,1,2) between '" + (+fiscalYear - 1) + "1001' and '" + +fiscalYear + "0930') ORDER BY CAST(SUBSTR(Leave_From,5,4) AS INT) DESC, CAST(SUBSTR(Leave_From,3,2) AS INT) DESC, CAST(SUBSTR(Leave_From,1,2) AS INT) DESC ").then(function(response){return response;},function(error){return error;});	
	};

	this.GetTotalLeave = function(leaveCode){
		return SQLiteService.Execute("select sum(leave_day) as totalLeave from leave where leave_code = " + leaveCode).then(function(response){return response;},function(error){return error;});	
	};

})
.service('LeaveSummarySQLite',function(SQLiteService){
	//***Necessary-Method
	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('leavesummary').then(function(response){return response;},function(error){return error;});
	};

	this.CountByServerId = function(serverid){
		return SQLiteService.CountByServerId(serverid,'leavesummary').then(function(response){return response;},function(error){return error;});		
	};

	this.CountIsNotDirtyById = function(id){
		return SQLiteService.CountIsNotDirtyById(id,'leavesummary').then(function(response){return response;},function(error){return error;});		
	};

	this.GetDataByTSIsNull = function(){
		return SQLiteService.GetDataByTSIsNull('leavesummary');
	};

	this.GetDataIsDirty = function(){
		return SQLiteService.GetDataIsDirty("leavesummary");
	};

	this.DeleteDataIsFlagDeleted = function(){
		return SQLiteService.DeleteDataIsFlagDeleted("leavesummary");
	};

	this.Update = function(data,isDirty,clientUpdate){
		var sql;
		if(clientUpdate)
			sql = "UPDATE leavesummary SET Id = ?, EmplCode = ?, LeaveCode = ?, LeaveName = ?, Bring = ?, YearRight = ?, SumRight = ?, Used = ?, Left = ?, FiscalYear = ?, DL = ?, dirty = ?, TS = ? WHERE clientid = " + data.clientid;
		else
			sql = "UPDATE leavesummary SET Id = ?, EmplCode = ?, LeaveCode = ?, LeaveName = ?, Bring = ?, YearRight = ?, SumRight = ?, Used = ?, Left = ?, FiscalYear = ?, DL = ?, dirty = ?, TS = ? WHERE Id = " + data.Id;
		var param = [data.Id,data.EmplCode,data.LeaveCode,data.LeaveName,data.Bring,data.YearRight,data.SumRight,data.Used,data.Left,data.FiscalYear,data.DL,isDirty,data.TS];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.Add = function(data,createFromClient){
		var sql = "INSERT INTO leavesummary (Id, EmplCode, LeaveCode, LeaveName, Bring, YearRight, SumRight, Used, Left, FiscalYear, DL, dirty, TS) VALUES ";
		var param = []; 
		var rowArgs = [];
		data.forEach(function(item){
			rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?)");
			param.push(item.Id);
			param.push(item.EmplCode);
			param.push(item.LeaveCode);
			param.push(item.LeaveName);
			param.push(item.Bring);
			param.push(item.YearRight);
			param.push(item.SumRight);
			param.push(item.Used);
			param.push(item.Left);
			param.push(item.FiscalYear);
			param.push(item.DL);
			//dirty
			if(createFromClient) param.push(true);
			else param.push(false);
			//TS
			if(createFromClient) param.push(null);
			else param.push(item.TS);
		});
		sql += rowArgs.join(', ');
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});
	};
	//***Necessary-Method

	this.GetFiscalYears = function(){
		return SQLiteService.Execute("SELECT distinct FiscalYear FROM leavesummary order by FiscalYear desc").then(function(response){return response;},function(error){return error;});	
	};

	this.GetLeaveSummaryInfos = function(fiscalYear){
		return SQLiteService.Execute("SELECT * FROM leavesummary where FiscalYear = '" + fiscalYear + "' ORDER BY CASE LeaveCode WHEN 2 THEN 0 WHEN 1 THEN 1 WHEN 4 THEN 2 END desc ").then(function(response){return response;},function(error){return error;});	
	};


})
.service('CircularSQLite',function(SQLiteService){
	//***Necessary-Method
	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('circular').then(function(response){return response;},function(error){return error;});
	};

	this.CountByServerId = function(serverid){
		return SQLiteService.CountByServerId(serverid,'circular').then(function(response){return response;},function(error){return error;});		
	};

	this.CountIsNotDirtyById = function(id){
		return SQLiteService.CountIsNotDirtyById(id,'circular').then(function(response){return response;},function(error){return error;});		
	};

	this.GetDataByTSIsNull = function(){
		return SQLiteService.GetDataByTSIsNull('circular');
	};

	this.GetDataIsDirty = function(){
		return SQLiteService.GetDataIsDirty("circular");
	};

	this.DeleteDataIsFlagDeleted = function(){
		return SQLiteService.DeleteDataIsFlagDeleted("circular");
	};

	this.Update = function(data,isDirty,clientUpdate){
		var sql;
		if(clientUpdate)
			sql = "UPDATE circular SET Id = ?, DocID = ?, DocDate = ?, Link = ?, Description = ?, DocNumber = ?, DL = ?,dirty = ?,TS = ? WHERE clientid = " + data.clientid;
		else
			sql = "UPDATE circular SET Id = ?, DocID = ?, DocDate = ?, Link = ?, Description = ?, DocNumber = ?, DL = ?,dirty = ?,TS = ? WHERE Id = " + data.Id;
		var param = [data.Id,data.DocID,data.DocDate,data.Link,data.Description,data.DocNumber,data.DL,isDirty,data.TS];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.Add = function(data,createFromClient){
		var sql = "INSERT INTO circular (Id, DocID, DocDate, Link, Description, DocNumber, DL, dirty, TS) VALUES ";
		var param = []; 
		var rowArgs = [];
		data.forEach(function(item){
			rowArgs.push("(?,?,?,?,?,?,?,?,?)");
			param.push(item.Id);
			param.push(item.DocID);
			param.push(item.DocDate);
			param.push(item.Link);
			param.push(item.Description);
			param.push(item.DocNumber);
			param.push(item.DL);
			//dirty
			if(createFromClient) param.push(true);
			else param.push(false);
			//TS
			if(createFromClient) param.push(null);
			else param.push(item.TS);
		});
		sql += rowArgs.join(', ');
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});
	};
	//***Necessary-Method

	this.GetDistinctDate = function(){
		return SQLiteService.Execute("SELECT DISTINCT DocDate FROM circular ORDER BY CAST(SUBSTR(DocDate,5,4) AS INT) DESC, CAST(SUBSTR(DocDate,3,2) AS INT) DESC, CAST(SUBSTR(DocDate,1,2) AS INT) DESC").then(function(response){return response;},function(error){return error;});
	};

	this.GetAll = function(){
		return SQLiteService.Execute("SELECT * FROM circular ORDER BY CAST(SUBSTR(DocDate,5,4) AS INT) DESC, CAST(SUBSTR(DocDate,3,2) AS INT) DESC, CAST(SUBSTR(DocDate,1,2) AS INT) DESC").then(function(response){return response;},function(error){return error;});	
	};
})
.service('NewsSQLite',function(SQLiteService){
	//***Necessary-Method
	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('news').then(function(response){return response;},function(error){return error;});
	};

	this.CountByServerId = function(serverid){
		return SQLiteService.CountByServerId(serverid,'news').then(function(response){return response;},function(error){return error;});		
	};

	this.CountIsNotDirtyById = function(id){
		return SQLiteService.CountIsNotDirtyById(id,'news').then(function(response){return response;},function(error){return error;});		
	};

	this.GetDataByTSIsNull = function(){
		return SQLiteService.GetDataByTSIsNull('news');
	};

	this.GetDataIsDirty = function(){
		return SQLiteService.GetDataIsDirty("news");
	};

	this.DeleteDataIsFlagDeleted = function(){
		return SQLiteService.DeleteDataIsFlagDeleted("news");
	};

	this.Update = function(data,isDirty,clientUpdate){
		var sql;
		if(clientUpdate)
			sql = "UPDATE news SET Id = ?, Title = ?, PubDate = ?, FileName = ?, DL = ?,dirty = ?,TS = ? WHERE clientid = " + data.clientid;
		else
			sql = "UPDATE news SET Id = ?, Title = ?, PubDate = ?, FileName = ?, DL = ?,dirty = ?,TS = ? WHERE Id = " + data.Id;
		var param = [data.Id,data.Title,data.PubDate,data.FileName,data.DL,isDirty,data.TS];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.Add = function(data,createFromClient){
		var sql = "INSERT INTO news (Id, Title, PubDate, FileName, DL, dirty, TS) VALUES ";
		var param = []; 
		var rowArgs = [];
		data.forEach(function(item){
			rowArgs.push("(?,?,?,?,?,?,?)");
			param.push(item.Id);
			param.push(item.Title);
			param.push(item.PubDate);
			param.push(item.FileName);
			param.push(item.DL);
			//dirty
			if(createFromClient) param.push(true);
			else param.push(false);
			//TS
			if(createFromClient) param.push(null);
			else param.push(item.TS);
		});
		sql += rowArgs.join(', ');
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});
	};
	//***Necessary-Method

	this.GetAll = function(){
		return SQLiteService.Execute("SELECT * FROM news order by PubDate desc").then(function(response){return response;},function(error){return error;});	
	};
})
.service('PMRoomSQLite',function(SQLiteService){
	//***Necessary-Method
	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('pmroom').then(function(response){return response;},function(error){return error;});
	};

	this.CountByServerId = function(serverid){
		return SQLiteService.CountByServerId(serverid,'pmroom').then(function(response){return response;},function(error){return error;});		
	};

	this.CountIsNotDirtyById = function(id){
		return SQLiteService.CountIsNotDirtyById(id,'pmroom').then(function(response){return response;},function(error){return error;});		
	};

	this.GetDataByTSIsNull = function(){
		return SQLiteService.GetDataByTSIsNull('pmroom');
	};

	this.GetDataIsDirty = function(){
		return SQLiteService.GetDataIsDirty("pmroom");
	};

	this.DeleteDataIsFlagDeleted = function(){
		return SQLiteService.DeleteDataIsFlagDeleted("pmroom");
	};

	this.Update = function(data){
		var sql;
		if(clientUpdate)
			sql = "UPDATE pmroom SET roomType = ?, roomName = ?, roomIcon = ?, totalNewMsg = ?, lastMsg = ?, TS = ? WHERE Id = " + data.Id;	
		var param = [data.roomType,data.roomName,data.roomIcon,data.totalNewMsg,data.lastMsg,data.TS];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.Add = function(data){
		var sql = "INSERT INTO pmroom (Id, roomType, roomName, roomIcon, totalNewMsg, lastMsg, TS) VALUES (?,?,?,?,?,?,?);";
		return SQLiteService.Execute(sql,data).then(function(response){return response;},function(error){return error;});	
	};
	//***Necessary-Method
	this.GetAll = function(){
		return SQLiteService.Execute("SELECT * FROM pmroom ORDER BY CAST(SUBSTR(ts,5,4) AS INT) DESC, CAST(SUBSTR(ts,3,2) AS INT) DESC, CAST(SUBSTR(ts,1,2) AS INT) DESC, CAST(SUBSTR(ts,9,2) AS INT) DESC, CAST(SUBSTR(ts,11,2) AS INT) DESC, CAST(SUBSTR(13,2) AS INT) DESC, Id DESC").then(function(response){return response;},function(error){return error;});	
	};

	this.GetRoomNameById = function(id){
		return SQLiteService.Execute("SELECT roomName FROM pmroom WHERE Id = '" + id + "'").then(function(response){return response;},function(error){return error;});	
	};

	this.UpdateReadAllMsg = function(id){
		return SQLiteService.Execute("UPDATE pmroom SET totalNewMsg = 0 WHERE Id = '" + id + "'").then(function(response){return response;},function(error){return error;});	
	};

	this.GetRoomIdTypeChat = function(empId){
		return SQLiteService.Execute("SELECT pmroom.Id FROM pmroom inner join pmuserinroom on pmroom.Id = pmuserinroom.roomId WHERE pmroom.roomType = 1 and  pmuserinroom.userId = " + empId).then(function(response){return response;},function(error){return error;});	
	};

	this.GetRoomById = function(roomId){
		return SQLiteService.Execute("SELECT * FROM pmroom WHERE Id = '" + roomId + "'").then(function(response){return response;},function(error){return error;});		
	};
	this.UpdateIncrementTotalNewMessage = function(roomId){
		return SQLiteService.Execute("UPDATE pmroom SET totalNewMsg = (totalNewMsg + 1) WHERE Id = '" + roomId + "'").then(function(response){return response;},function(error){return error;});
	};

	this.UpdateLastMsg = function(roomId,lastMsg){
		return SQLiteService.Execute("UPDATE pmroom SET lastMsg = '" + lastMsg + "' WHERE Id = '" + roomId + "'").then(function(response){return response;},function(error){return error;});
	};

	this.CheckRoomIdIsExist = function(roomId){
		return SQLiteService.Execute("SELECT count(*) as totalCount FROM pmroom WHERE Id = '" + roomId + "'").then(function(response){return response;},function(error){return error;});
	};
})
.service('PMMsgSQLite',function(SQLiteService){
	//***Necessary-Method
	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('pmmsg').then(function(response){return response;},function(error){return error;});
	};

	this.CountByServerId = function(serverid){
		return SQLiteService.CountByServerId(serverid,'pmmsg').then(function(response){return response;},function(error){return error;});		
	};

	this.CountIsNotDirtyById = function(id){
		return SQLiteService.CountIsNotDirtyById(id,'pmmsg').then(function(response){return response;},function(error){return error;});		
	};

	this.GetDataByTSIsNull = function(){
		return SQLiteService.GetDataByTSIsNull('pmmsg');
	};

	this.GetDataIsDirty = function(){
		return SQLiteService.GetDataIsDirty("pmmsg");
	};

	this.DeleteDataIsFlagDeleted = function(){
		return SQLiteService.DeleteDataIsFlagDeleted("pmmsg");
	};

	this.Update = function(data){
		var sql;
		sql = "UPDATE pmmsg SET MessageId = ?, Empl_Code = ?, message = ?, readTotal = ?, roomId = ?, TS = ?, unseen = ?, msgAct = ? WHERE Id = " + data.Id;	
		var param = [data.MessageId,data.Empl_Code,data.message,data.readTotal,data.roomId,data.TS,data.unseen,data.msgAct];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.Add = function(data){
		var sql = "INSERT INTO pmmsg (MessageId,Empl_Code, message, readTotal, roomId, TS, unseen, msgAct) VALUES (?,?,?,?,?,?,?,?);";
		return SQLiteService.Execute(sql,data).then(function(response){return response;},function(error){console.log(error); return error;});
	};
	//***Necessary-Method
	
	this.GetAllMsgByRoomId = function(roomId){
		//return SQLiteService.Execute("select * FROM pmmsg WHERE roomId = '" + roomId + "' ORDER BY CAST(SUBSTR(ts,5,4) AS INT), CAST(SUBSTR(ts,3,2) AS INT), CAST(SUBSTR(ts,1,2) AS INT), CAST(SUBSTR(ts,9,2) AS INT), CAST(SUBSTR(ts,11,2) AS INT), CAST(SUBSTR(ts,13,2) AS INT), Id").then(function(response){return response;},function(error){return error;});	
		return SQLiteService.Execute("select * FROM pmmsg WHERE roomId = '" + roomId + "' ORDER BY Id").then(function(response){return response;},function(error){return error;});	
	};

	this.GetAllUnSeenMessageByRoomId = function(roomId){
		return SQLiteService.Execute("select * FROM pmmsg WHERE unseen = 0 and roomId = '" + roomId + "' ORDER BY CAST(SUBSTR(ts,5,4) AS INT), CAST(SUBSTR(ts,3,2) AS INT), CAST(SUBSTR(ts,1,2) AS INT), CAST(SUBSTR(ts,9,2) AS INT), CAST(SUBSTR(ts,11,2) AS INT), CAST(SUBSTR(ts,13,2) AS INT), Id").then(function(response){return response;},function(error){return error;});	
	};

	this.GetEmpIdByMessageAndRoomId = function(msgId,roomId){
		return SQLiteService.Execute("SELECT Empl_Code FROM pmmsg  WHERE MessageId = '" + msgId + "' and roomId = '" + roomId + "'").then(function(response){return response;},function(error){return error;});			
	};

	this.GetReadTotalByMsgId = function(msgId){
		return SQLiteService.Execute("select readTotal FROM pmmsg WHERE MessageId = '" + msgId + "'").then(function(response){return response;},function(error){return error;});		
	};

	this.UpdateReadTotal = function(msgId){
		sql = "UPDATE pmmsg SET readTotal = (readTotal + 1) WHERE MessageId = '" + msgId + "'";
		return SQLiteService.Execute(sql,null).then(function(response){return response;},function(error){return error;});	
	};

	this.UpdateSeenMessageInRoom = function(roomId){
		return SQLiteService.Execute("UPDATE pmmsg SET unseen = 1 WHERE roomId = '" + roomId + "'").then(function(response){return response;},function(error){return error;});		
	};

	this.CheckMessageIdIsExsit = function(MessageId){
		return SQLiteService.Execute("SELECT count(*) as totalCount FROM pmmsg  WHERE MessageId = '" + MessageId + "'").then(function(response){return response;},function(error){return error;});			
	};

	this.GetAllResendMessage = function(){
		return SQLiteService.Execute("SELECT * FROM pmmsg  WHERE msgAct = 1 ORDER BY CAST(SUBSTR(ts,5,4) AS INT), CAST(SUBSTR(ts,3,2) AS INT), CAST(SUBSTR(ts,1,2) AS INT), CAST(SUBSTR(ts,9,2) AS INT), CAST(SUBSTR(ts,11,2) AS INT), CAST(SUBSTR(ts,13,2) AS INT), Id").then(function(response){return response;},function(error){return error;});			
	};

	this.UpdateMsgAct = function(msgId,msgAct){
		return SQLiteService.Execute("UPDATE pmmsg SET msgAct = " + msgAct + " WHERE MessageId = '" + msgId + "'").then(function(response){return response;},function(error){return error;});		
	};

	this.DeleteMessage = function(msgId,roomId){
		return SQLiteService.Execute("DELETE from pmmsg WHERE MessageId = '" + msgId + "' and roomId = '" + roomId + "'").then(function(response){return response;},function(error){return error;});			
	};
})
.service('PMSubscribeSQLite',function(SQLiteService){

	this.CountSubscribeByEmpId = function(empid){
		return SQLiteService.Execute("SELECT COUNT(*) as totalCount FROM pmsubscribe WHERE Empl_Code = " + empid).then(function(response){return response;},function(error){return error;});	
	};

	this.Add = function(data){
		var sql = "INSERT INTO pmsubscribe (Empl_Code, Firstname, Lastname, PictureThumb) VALUES ";
		var param = []; 
		var rowArgs = [];
		data.forEach(function(item){
			rowArgs.push("(?,?,?,?)");
			param.push(item.Empl_Code);
			param.push(item.Firstname);
			param.push(item.Lastname);
			param.push(item.PictureThumb);
		});
		sql += rowArgs.join(', ');
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});
	};

	this.GetAllSubScribe = function(){
		return SQLiteService.Execute("select * FROM pmsubscribe").then(function(response){return response;},function(error){return error;});	
	};

})
.service('PMUserInRoomSQLite',function(SQLiteService){
	this.Add = function(data){
		var sql = "INSERT INTO pmuserinroom (roomId, userId) VALUES (?,?);";
		return SQLiteService.Execute(sql,data).then(function(response){return response;},function(error){return error;});	
	};
	this.GetUserIdInRoom = function(roomId){
		return SQLiteService.Execute("SELECT userId FROM pmuserinroom WHERE roomId = '" + roomId + "'").then(function(response){return response;},function(error){return error;});
	};
	this.GetRoomIdByUserId = function(userId){
		return SQLiteService.Execute('SELECT roomId FROM pmuserinroom WHERE userId = ' + userId).then(function(response){return response;},function(error){return error;});
	};
})
.service('PMSeenMessageSQLite',function(SQLiteService){

	this.Add = function(data){
		var sql = "INSERT INTO pmseenmessage (Empl_Code, MessageId, roomId) VALUES (?,?,?)";
		return SQLiteService.Execute(sql,data).then(function(response){return response;},function(error){console.log(error); return error;});
	};

	this.CheckUserSeenMessage = function(empId,messageId,roomId){
		return SQLiteService.Execute("select count(*) as totalCount FROM pmseenmessage where Empl_Code = '" + empId + "' and MessageId = '" + messageId + "' and roomId = '" + roomId + "'").then(function(response){return response;},function(error){return error;});	
	};

})
.service('MobileConfigSQLite',function(SQLiteService){

	this.Add = function(data){
		var sql = "INSERT INTO mobileconfig (key, value) VALUES (?,?)";
		return SQLiteService.Execute(sql,data).then(function(response){return response;},function(error){console.log(error); return error;});
	};

	this.Update = function(data){
		var sql;
		sql = "UPDATE mobileconfig SET key = ?, value = ? WHERE Id = " + data.Id;	
		var param = [data.key,data.value];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.GetValueByKey = function(key){
		return SQLiteService.Execute("SELECT value FROM mobileconfig WHERE key = '" + key + "'").then(function(response){return response;},function(error){return error;});
	};

})
.service('NotiHistorySQLite',function(SQLiteService){
	//***Necessary-Method
	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('notihistory').then(function(response){return response;},function(error){return error;});
	};

	this.CountByServerId = function(serverid){
		return SQLiteService.CountByServerId(serverid,'notihistory').then(function(response){return response;},function(error){return error;});		
	};

	this.CountIsNotDirtyById = function(id){
		return SQLiteService.CountIsNotDirtyById(id,'notihistory').then(function(response){return response;},function(error){return error;});		
	};

	this.GetDataByTSIsNull = function(){
		return SQLiteService.GetDataByTSIsNull('notihistory');
	};

	this.GetDataIsDirty = function(){
		return SQLiteService.GetDataIsDirty("notihistory");
	};

	this.DeleteDataIsFlagDeleted = function(){
		return SQLiteService.DeleteDataIsFlagDeleted("notihistory");
	};

	this.Update = function(data,isDirty,clientUpdate){
		var sql;
		if(clientUpdate)
			sql = "UPDATE notihistory SET Id = ?, Empl_Code = ?, NotiType = ?, NotiPriority = ?, Message = ?, MenuPath = ?, NotiTime = ?, DL = ?, dirty = ?, TS = ? WHERE clientid = " + data.clientid;
		else
			sql = "UPDATE notihistory SET Id = ?, Empl_Code = ?, NotiType = ?, NotiPriority = ?, Message = ?, MenuPath = ?, NotiTime = ?, DL = ?, dirty = ?, TS = ? WHERE Id = " + data.Id;
		var param = [data.Id,data.Empl_Code,data.NotiType,data.NotiPriority,data.Message,data.MenuPath,data.NotiTime,data.DL,isDirty,data.TS];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.Add = function(data,createFromClient){
		var sql = "INSERT INTO notihistory (Id, Empl_Code, NotiType, NotiPriority, Message, MenuPath, NotiTime, DL, dirty, TS) VALUES ";
		var param = []; 
		var rowArgs = [];
		data.forEach(function(item){
			rowArgs.push("(?,?,?,?,?,?,?,?,?,?)");
			param.push(item.Id);
			param.push(item.Empl_Code);
			param.push(item.NotiType);
			param.push(item.NotiPriority);
			param.push(item.Message);
			param.push(item.MenuPath);
			param.push(item.NotiTime);
			param.push(item.DL);
			//dirty
			if(createFromClient) param.push(true);
			else param.push(false);
			//TS
			if(createFromClient) param.push(null);
			else param.push(item.TS);
		});
		sql += rowArgs.join(', ');
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});
	};
	//***Necessary-Method

	this.GetNotiHistories = function(){
		return SQLiteService.Execute("SELECT * FROM notihistory ORDER BY Id DESC").then(function(response){return response;},function(error){return error;});
	};
})

.service('EmployeeSQLite',function(SQLiteService){
	//***Necessary-Method
	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('employee').then(function(response){return response;},function(error){return error;});
	};

	this.CountByServerId = function(serverid){
		return SQLiteService.CountByServerId(serverid,'employee').then(function(response){return response;},function(error){return error;});		
	};

	this.CountIsNotDirtyById = function(id){
		return SQLiteService.CountIsNotDirtyById(id,'employee').then(function(response){return response;},function(error){return error;});		
	};

	this.GetDataByTSIsNull = function(){
		return SQLiteService.GetDataByTSIsNull('employee');
	};

	this.GetDataIsDirty = function(){
		return SQLiteService.GetDataIsDirty("employee");
	};

	this.DeleteDataIsFlagDeleted = function(){
		return SQLiteService.DeleteDataIsFlagDeleted("employee");
	};

	this.Update = function(data,isDirty,clientUpdate){
		var sql;
		if(clientUpdate)
			sql = "UPDATE employee SET Id = ?, EC = ?, NM = ?, DL = ?, dirty = ?, TS = ? WHERE clientid = " + data.clientid;
		else
			sql = "UPDATE employee SET Id = ?, EC = ?, NM = ?, DL = ?, dirty = ?, TS = ? WHERE Id = " + data.Id;
		var param = [data.Id,data.EC,data.NM,data.DL,isDirty,data.TS];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.Add = function(data,createFromClient){
		var sql = "INSERT INTO employee (Id, EC, NM, DL, dirty, TS) VALUES ";
		var param = []; 
		var rowArgs = [];
		data.forEach(function(item){
			rowArgs.push("(?,?,?,?,?,?)");
			param.push(item.Id);
			param.push(item.EC);
			param.push(item.NM);
			param.push(item.DL);
			//dirty
			if(createFromClient) param.push(true);
			else param.push(false);
			//TS
			if(createFromClient) param.push(null);
			else param.push(item.TS);
		});
		sql += rowArgs.join(', ');
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});
	};
	//***Necessary-Method
	this.GetEmplooyees = function(){
		return SQLiteService.Execute("SELECT * FROM employee").then(function(response){return response;},function(error){return error;});
	};
})
.service('TimeReportSQLite',function(SQLiteService){
	//Id int, SeqID text, Date text, TimeIn text, LocIn text, TimeOut text, LocOut text, Status text, EarlyOut text boolean, EarlyIn boolean, WorkType text, LeaveStatus text, Remark text, DL boolean,dirty boolean,TS text
	//***Necessary-Method
	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('timereport').then(function(response){return response;},function(error){return error;});
	};

	this.CountByServerId = function(serverid){
		return SQLiteService.CountByServerId(serverid,'timereport').then(function(response){return response;},function(error){return error;});		
	};

	this.CountIsNotDirtyById = function(id){
		return SQLiteService.CountIsNotDirtyById(id,'timereport').then(function(response){return response;},function(error){return error;});		
	};

	this.GetDataByTSIsNull = function(){
		return SQLiteService.GetDataByTSIsNull('timereport');
	};

	this.GetDataIsDirty = function(){
		return SQLiteService.GetDataIsDirty("timereport");
	};

	this.DeleteDataIsFlagDeleted = function(){
		return SQLiteService.DeleteDataIsFlagDeleted("timereport");
	};

	this.Update = function(data,isDirty,clientUpdate){
		var sql;
		if(clientUpdate)
			sql = "UPDATE timereport SET Id = ?, WORKDATE = ?, STARTTIME = ?, OFFTIME = ?, NOTE = ?, OUT_EARLY = ?, OUT_LATE = ?, TIMECATEGORY = ?,REMARK = ?, DL = ?, dirty = ?, TS = ? WHERE clientid = " + data.clientid;
		else
			sql = "UPDATE timereport SET Id = ?, WORKDATE = ?, STARTTIME = ?, OFFTIME = ?, NOTE = ?, OUT_EARLY = ?, OUT_LATE = ?, TIMECATEGORY = ?,REMARK = ?, DL = ?, dirty = ?, TS = ? WHERE Id = " + data.Id;
		var param = [data.Id,data.WORKDATE,data.STARTTIME,data.OFFTIME,data.NOTE,data.OUT_EARLY,data.OUT_LATE,data.TIMECATEGORY,data.REMARK,data.DL,isDirty,data.TS];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});	
	};

	this.Add = function(data,createFromClient){
		var sql = "INSERT INTO timereport (Id, WORKDATE, STARTTIME, OFFTIME, NOTE, OUT_EARLY, OUT_LATE, TIMECATEGORY, REMARK, DL, dirty, TS) VALUES ";
		var param = []; 
		var rowArgs = [];
		data.forEach(function(item){
			rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?)");
			param.push(item.Id);
			param.push(item.WORKDATE);
			param.push(item.STARTTIME);
			param.push(item.OFFTIME);
			param.push(item.NOTE);
			param.push(item.OUT_EARLY);
			param.push(item.OUT_LATE);
			param.push(item.TIMECATEGORY);
			param.push(item.REMARK);
			param.push(item.DL);
			//dirty
			if(createFromClient) param.push(true);
			else param.push(false);
			//TS
			if(createFromClient) param.push(null);
			else param.push(item.TS);
		});
		sql += rowArgs.join(', ');
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});
	};
	//***Necessary-Method
	this.GetDistinctMonthYear = function(){
		return SQLiteService.Execute("select distinct substr(WORKDATE,3,6) as monthyear from timereport order by substr(WORKDATE,5,4) desc, substr(WORKDATE,3,2) desc limit 12").then(function(response){return response;},function(error){ return error;});
	};
	this.GetTimeReports = function(){
		return SQLiteService.Execute("SELECT * FROM timereport order by substr(WORKDATE,3,6) desc").then(function(response){return response;},function(error){ return error;});
	};
	this.GetTimeReportsBySelectedMonthYear = function(monthyear){
		return SQLiteService.Execute("SELECT * FROM timereport WHERE substr(WORKDATE,3,6)  = '" + monthyear + "'  ORDER BY CAST(SUBSTR(WORKDATE,5,4) AS INT) DESC, CAST(SUBSTR(WORKDATE,3,2) AS INT) DESC, CAST(SUBSTR(WORKDATE,1,2) AS INT) DESC").then(function(response){return response;},function(error){return error;});
	};
})

//***Test-Sync-Code
.service('TestSyncSQLite',function(SQLiteService){
	//***Necessary-Method
	this.GetLatestTS = function(){
		return SQLiteService.BaseGetLatestTS('testsync').then(function(response){return response;},function(error){return error;});
	};

	this.CountByServerId = function(serverid){
		return SQLiteService.CountByServerId(serverid,'testsync').then(function(response){return response;},function(error){return error;});		
	};

	this.CountIsNotDirtyById = function(id){
		return SQLiteService.CountIsNotDirtyById(id,'testsync').then(function(response){return response;},function(error){return error;});		
	};

	
	this.GetDataByTSIsNull = function(){
		return SQLiteService.GetDataByTSIsNull('testsync');
	};

	this.GetDataIsDirty = function(){
		return SQLiteService.GetDataIsDirty("testsync");
	};

	this.DeleteDataIsFlagDeleted = function(){
		return SQLiteService.DeleteDataIsFlagDeleted("testsync");
	};

	this.Update = function(data,isDirty,clientUpdate){
		var sql;
		if(clientUpdate)
			sql = "UPDATE testsync SET Id = ?, field1 = ?, field2 = ?, field3 = ?,TS = ?, DL = ?, dirty = ? WHERE clientid = " + data.clientid;
		else
			sql = "UPDATE testsync SET Id = ?, field1 = ?, field2 = ?, field3 = ?,TS = ?, DL = ?, dirty = ? WHERE Id = " + data.Id;
		var param = [data.Id,data.field1,data.field2,data.field3,data.TS,data.DL,isDirty];
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){return error;});			
	};

	this.Add = function(data,createFromClient){
		var sql = "INSERT INTO testsync (Id, field1, field2, field3, TS, DL, dirty) VALUES ";
		var param = []; 
		var rowArgs = [];
		data.forEach(function(item){
			rowArgs.push("(?,?,?,?,?,?,?)");
			param.push(item.Id);
			param.push(item.field1);
			param.push(item.field2);
			param.push(item.field3);
			//TS
			if(createFromClient) param.push(null); 
			else param.push(item.TS); 
			//DL
			param.push(item.DL);
			//dirty
			if(createFromClient) param.push(true); 
			else param.push(false);
		});
		sql += rowArgs.join(', ');
		return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});
	};
	//***Necessary-Method

	this.DeleteAll = function(){
		return SQLiteService.Execute("DELETE FROM testsync").then(function(response){return response;},function(error){return error;});		
	};

	this.GetAll = function(){
		return SQLiteService.Execute("SELECT * FROM testsync").then(function(response){return response;},function(error){return error;});
	};

	this.GetByClientId = function(clientid){
		return SQLiteService.Execute("SELECT * FROM testsync WHERE clientid = " + clientid).then(function(response){return response;},function(error){return error;});	
	};

	// this.DeleteByServerId = function(serverid){
	// 	return SQLiteService.DeleteByServerId('testsync',serverid).then(function(response){return response;},function(error){return error;});
	// };
})
//***Test-Sync-Code

function GetConditionFiscalYearStr (fiscalYear,fieldName) {
	return "(SUBSTR(" + fieldName + ",5,4) || '-' || SUBSTR(" + fieldName + ",3,2) || '-' || SUBSTR(" + fieldName + ",1,2)) between '" + (fiscalYear-1) + "-10-01' and '" + fiscalYear + "-09-30'"
}