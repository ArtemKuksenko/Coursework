/** PASSW S7EQR-lF7d8-dZnj8-ic4Y0
	* требуется установить:
	* 	npm i node-fetch --save
	* 	npm install --save cryptocompare
	*   npm install express --save
	* 
	* документация:
	*	https://www.npmjs.com/package/cryptocompare
	*	https://min-api.cryptocompare.com/stats/rate/limit?api_key=c4ad201d6bb020c79570dd44ebd66defd1471014b87bd336c89abbc22d9c2063
	*/


var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('я живой');
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

global.fetch = require('node-fetch');
const cpypt = require('cryptocompare');
cpypt.setApiKey('c4ad201d6bb020c79570dd44ebd66defd1471014b87bd336c89abbc22d9c2063');
const fs = require("fs");

 function leastSquareMethod(arr){

	function kramerMethod(A, B){
       let d  = A[0][0]*A[1][1] - A[1][0]*A[0][1];
       let d1 = B[0]*A[1][1] - B[1]*A[0][1];
       // d2 = A[0][0]*B[1][1] - A[1][0]*B[0][1]
       // alert (d); 
       return d1/d;
    }

    let sumX = 0;
    let sumY = 0;
    let sumX2 = 0;
    let sumXY = 0
  
    for (let i in arr){
      sumX += arr[i].x;
      sumX2 += arr[i].x * arr[i].x;
      sumY += arr[i].y;
      sumXY += arr[i].x * arr[i].y;
    }
    //посчитали все коэффициенты для решение системы
    let matrA = [[], []];
    matrA[0][0] = sumX2;
    matrA[0][1] = sumX;
    matrA[1][0] = sumX;
    matrA[1][1] = arr.length;
    let vectB = [sumXY, sumY];

    // alert(matrA)

    let answ = kramerMethod(matrA,vectB);
    // console.log(answ);
    return answ;
}

class Coin {

	constructor(coin,length,activation,countCandles,next){ //длина свечи - length
		this.coin = coin;
		this.options = {
			exchange: 'Binance',
			limit:countCandles,//кол-во элементов
			aggregate: length
		};
		this.activation = activation;
		this.countCandles = countCandles;
		this.callback=next; 
	}

	calc(){
		this.timeStart = new  Date();
		cpypt.histoMinute(this.coin,"BTC",this.options)
		.then(data =>{
			console.log(data);
			
			for (let i = this.countCandles; i < data.length; i++ ){
				let arr = [];
				const K = 100000000;
				for (let j=0;j<this.countCandles;j++){
					arr[j] = {x:j,y:(data[0].close - data[j].close)*K};
				}
				console.log(arr)
				this.calcPorog(data[i],arr);
			}
			
			if (this.callback!=false){
				console.log("run",this.coin);
				console.log("this.callback",this.callback)
				this.callback.calc();
			}

		},err =>{
			console.log('ошибкa:',err);
			now=new Date();
	      	fs.appendFileSync("errorParse.txt",now.toString()+
	      		'\n'+this.coin+'\n'+err+'\n');
			if (this.callback!=false){
				console.log("run",this.coin);
				console.log("this.callback",this.callback)
				this.callback.calc();
			}
		})
	}

	calcPorog(data,arr){

		// let percent = (data.close-data.open)
		// 		*100/data.close
		// console.log(data,"%"+percent);

		let porog = leastSquareMethod(arr);
		console.log('наклон - ',porog);
		// if (true){
		if (porog > this.activation){

			var now = new Date();
			var candelTime = new Date();
			candelTime.setTime(data.time*1000)
			
			const mailOptions = {
			  from: 'kuksenko.artem@gmail.com', // sender address
			  to: ['tema.kuxeko@yandex.ru','boba2621@yandex.ru'], 
			  // to: 'tema.kuxeko@yandex.ru', // list of receivers
			  subject: this.coin +' подъем :'+porog.toFixed(2).toString(),

			  html: '<p> Текущая цена: '+data.close+'</p>'+
			  		// '<p>%прироста обьема: '+Dprice.toFixed(3).toString()+
			  		'<p><h1>Служебная информация:</h1>'+
			  		'<p>Время свечи: <br>'+
			  		candelTime.toString()+'</p>'+
			  		'<p>Время письма: <br>'+
			  		now.toString()+'</p>'+
			  		'<p>Время запроса свечи: <br>'+
			  		this.timeStart.toString()+'</p>'
			};
			sendMail(mailOptions);
		}
	}
}

function sendMail(mailOptions){
	console.log('ПОЧТА')
		transporter.sendMail(mailOptions, function (err, info) {
		   if(err) {
		    D=new Date();
	      	fs.appendFileSync("errorMail.txt",D.toString()+'\n'+'\n'+err+'\n')
		   }else
		     console.log(info);
		});
	}

var nodemailer = require('nodemailer');
	var transporter = nodemailer.createTransport({
	 service: 'gmail',
	 auth: {
	        user: 'kuksenko.artem@gmail.com',
	        pass: '&789456123&'
	    }
	});

function testMess(){
	var nodemailer = require('nodemailer');
	var transporter = nodemailer.createTransport({
	 service: 'gmail',
	 auth: {
	        user: 'kuksenko.artem@gmail.com',
	        pass: '&789456123&'
	    }
	});
	const mailOptions = {
		from: 'kuksenko.artem@gmail.com', // sender address
		to: ['tema.kuxeko@yandex.ru','boba2621@yandex.ru'], // list of receivers
			   // to: 'kuksenko.artem@gmail.com', // list of receivers
		subject: 'Crypto test message', // Subject line
		html: '<p> короч я живой, а ты? </p>'// plain text body
	};
	transporter.sendMail(mailOptions, function (err, info) {
	   if(err)
	     console.log(err)
	   else
	     console.log(info);
	});
}

const minute = 60000;

var testM=true;
setInterval(r15, minute*15);
	function r15(){
		now = new Date();
		now=now.getHours();
		// console.log("сейчас - ",D,ty);
		if(now==20){
		// console.log('run test mess',T)
			if(testM==true) {
				testMess();
			}
			testM=false;
		}else{
			testM=true;  
		}
	}

//текущий конфиг - 15 минут, 4 свечиб порог 2,5
//constructor(coin,length,activation,countCandles,next)
var zilCoin= new Coin("ZIL",15,2.5,4,false); 
var xvgCoin= new Coin("XVG",15,2.5,4,zilCoin); 
var xrpCoin= new Coin("XRP",15,2.5,4,xvgCoin); 
var trxCoin= new Coin("TRX",15,2.5,4,xrpCoin); 

trxCoin.calc();
setInterval(time, minute*13);
	function time(){
		trxCoin.calc();
	}
