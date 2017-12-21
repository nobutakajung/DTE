var db;
var tableNames = ['flightdata'];

angular.module('starter')
.service('SQLiteService',function($cordovaSQLite,$q){

	var service = this;

	this.OpenDB = function(){
		if (window.cordova) db = $cordovaSQLite.openDB({ name: "DTEDB.db", iosDatabaseLocation: 'default'}); //device
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
		this.CreateFlightDataTable();
	};

	this.CreateFlightDataTable = function(){
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS flightdata (id integer, FlightNo text, ACType text, ACCarrier text, ACReg text, STA text, STAValueTxt text, STD text, STDValueTxt text, GateNo text, CreateDate text)");
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

	this.DeleteAll = function(tablename){
		return this.Execute("DELETE FROM " + tablename).then(function(response){return response;},function(error){return error;});	
	};

})
.service('FlightDataSQLite', function(SQLiteService){
	this.Add = function(data){
		var result;
		var i,j,temparray,chunk = 50;
	    for (i=0,j=data.length; i<j; i+=chunk) {
	        temparray = data.slice(i,i+chunk);
	        //insert just 50 records for each round
	        var sql = "INSERT INTO flightdata (id, FlightNo, ACType, ACCarrier, ACReg, STA, STAValueTxt, STD, STDValueTxt, GateNo, CreateDate) VALUES ";
			var param = []; 
			var rowArgs = [];
			temparray.forEach(function(item){
				rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?)");
				param.push(item.id);
				param.push(item.FlightNo);
				param.push(item.ACType);
				param.push(item.ACCarrier);
				param.push(item.ACReg);
				param.push(item.STA);
				param.push(item.STAValueTxt);
				param.push(item.STD);
				param.push(item.STDValueTxt);
				param.push(item.GateNo);
				param.push(item.CreateDate);
			});
			sql += rowArgs.join(', ');
			result = SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});
	    }
	    return result;

		// var sql = "INSERT INTO flightdata (id, FlightNo, ACType, ACCarrier, ACReg, STA, STAValueTxt, STD, STDValueTxt, GateNo, CreateDate) VALUES ";
		// var param = []; 
		// var rowArgs = [];
		// data.forEach(function(item){
		// 	rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?)");
		// 	param.push(item.id);
		// 	param.push(item.FlightNo);
		// 	param.push(item.ACType);
		// 	param.push(item.ACCarrier);
		// 	param.push(item.ACReg);
		// 	param.push(item.STA);
		// 	param.push(item.STAValueTxt);
		// 	param.push(item.STD);
		// 	param.push(item.STDValueTxt);
		// 	param.push(item.GateNo);
		// 	param.push(item.CreateDate);
		// });
		// sql += rowArgs.join(', ');
		// return SQLiteService.Execute(sql,param).then(function(response){return response;},function(error){console.log(error); return error;});

	};

	this.GetFlightDatas = function(){
		return SQLiteService.Execute("SELECT * FROM flightdata").then(function(response){return response;},function(error){return error;});
	};

	this.DeleteAll = function(){
		return SQLiteService.DeleteAll("flightdata").then(function(response){return response;},function(error){return error;});	
	};
});