const FS = require("fs");
const mariadb = require('mariadb');
const pool = mariadb.createPool({ 
     user:'bot', 
     password: ' ',
     database: 'crypt'
});

var sleep = require('sleep');

//бд (id INT, open FLOAT(18,16), high FLOAT(18,16), low FLOAT(18,16), 
//close FLOAT(18,16), period BIGINT, data DATETIME)
//13 символов 1514764800000 "9999-12-31 23:59:59"

function query(info,base,interval){
	return new Promise(async function(resolve, reject){
		// var conn = pool.getConnection();
		// let query = conn.query("INSERT INTO test" + "value (kek )", [1, "mariadb"]);
	  
	  let conn;
	  try {
		conn = await pool.getConnection();
		// const rows = await conn.query("SELECT 1 as val");
		// console.log(rows); //[ {val: 1}, meta: ... ]
		let d = new Date(info.period);
		// d.setTime();
		
		let query = "INSERT INTO " + base + "_" + interval +
			" value (" + index + "," + info.open + "," + info.high + "," + 
			info.low +","+ info.close + "," + info.period + ",'" +
			d.getFullYear() +"-"+ parseInt( d.getMonth() + 1 ) + "-" + d.getDate() + " " +
			d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "')";
		
		const res = await conn.query(query, [1, "mariadb"]);
		console.log(query);

		// sleep.sleep(5);
		resolve(res);

	  } catch (err) {
		reject(err);
	  } finally {
		if (conn) return conn.end();
	  }
	});
}

function insertArray(data,callback,base,interval){

	let loop = function(i){
		console.log(i,data.length);
		if(i<data.length){
			query(data[i],base,interval)
			.then(
				// console.log("Промис не сработал")
				response => {
					console.log("ok");
					loop(i+1);
					index++;
				},
				err => {
					console.log("error");
				}
			);
		} else {
			callback();
		}
	}
	
	loop(0);	
}

function parseCoin(interval,base,change,timeStart,timeEnd,callback){
	var axios = require('axios')
	console.log('https://api.coincap.io/v2/candles?exchange=binance&interval='+
	    	interval+'&baseId='+base+'&quoteId='+change+
	    	'&start='+timeStart+'&end='+timeEnd);
	axios
	    .get('https://api.coincap.io/v2/candles?exchange=binance&interval='+
	    	interval+'&baseId='+base+'&quoteId='+change+
	    	'&start='+timeStart+'&end='+timeEnd)
	    .then(
	      value => {
	        info = value.data.data;
	        insertArray(info,callback,base,interval);
	                
	      },reason => {
	      	D=new Date();
	      	console.log('Ошибка парсера'+'\n'+reason+'\n');
	      	FS.appendFileSync("errorParse.txt",D.toString()+'\n'+'Ошибка парсера'+'\n'+reason+'\n');
	      }
	    );
}

const minute = 60000;

var timeStart = 1514764800000; // Mon, 01 Jan 2018 00:00:00 GMT
let d = new Date(timeStart); console.log(d.toString());
var timeEnd   = 1546300800000; // Mon, 01 Jan 2019 00:00:00 GMT
var step      = minute * 60 *24 *6;
var interval  = "m15";
var base      = "tron";
var change    = "bitcoin";
var time      = timeStart - step;
d.setTime(time+step);
console.log(d.toString());

// var timeEnd = timeStart + 2*step; //////////////////////////////////////////

var index=0;

function loop(){
	// kek++;console.log(kek);
	time = time + step;

	if( (time + step) < timeEnd ){
		console.log("итерация",step);
		let dt = new Date(time);
		console.log(dt.toString());
		dt.setTime(time+step);
		console.log(dt.toString());
		parseCoin(interval,base,change,time,time+step,loop)
	}
	else
		console.log('parse end');
}

loop();
