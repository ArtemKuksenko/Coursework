/**
	* требуется установить:
	* 	npm i node-fetch --save
	* 	npm install --save cryptocompare
	* 
	* документация:
	*	https://www.npmjs.com/package/cryptocompare
	*	https://min-api.cryptocompare.com/stats/rate/limit?api_key=c4ad201d6bb020c79570dd44ebd66defd1471014b87bd336c89abbc22d9c2063
	*/

global.fetch = require('node-fetch');
const cpypt = require('cryptocompare');
cpypt.setApiKey('c4ad201d6bb020c79570dd44ebd66defd1471014b87bd336c89abbc22d9c2063');
const fs = require("fs");

class Coin {

	constructor(coin,length,activation,next){
		this.coin = coin;
		this.options = {
			exchange: 'Binance',
			limit:2,//кол-во элементов
			aggregate: length
		};
		this.activation = activation;
		this.callback=next; 
	}

	calc(){
		this.timeStart = new  Date();
		cpypt.histoMinute(this.coin,"BTC",this.options)
		.then(data =>{
			console.log(data);
			this.calcPercent(data);
			
			if (this.callback!=false){
				console.log("run",this.coin);
				console.log("this.callback",this.callback)
				this.callback.calc();
			}

		},err =>{
			console.log('ошибкa:',error);
			now=new Date();
	      	FS.appendFileSync("errorParse.txt",now.toString()+
	      		'\n'+this.coin+'\n'+error+'\n');
		})
	}

	calcPercent(data){

		let percent = Math.max(
				(data[data.length-1].close-data[data.length-1].open)
				*100/data[data.length-1].close,
				(data[data.length-2].close-data[data.length-2].open)
				*100/data[data.length-2].close
			);
		console.log("%"+percent);

		// if (true){
		if (percent>this.activation){

			var now = new Date();
			var candelTime = new Date();
			candelTime.setTime(data[data.length-1].time*1000)
			
			const mailOptions = {
			  from: 'kuksenko.artem@gmail.com', // sender address
			  to: ['tema.kuxeko@yandex.ru','boba2621@yandex.ru'], 
			   // to: 'tema.kuxeko@yandex.ru', // list of receivers
			  subject: this.coin +' % :'+percent.toFixed(2).toString(),

			  html: '<p> Текущая цена: '+data[data.length-1].close+'</p>'+
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
	      	FS.appendFileSync("errorMail.txt",D.toString()+'\n'+consolelog+'\n'+err+'\n')
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

var zilCoin= new Coin("ZIL",5,1,false); 
var xvgCoin= new Coin("XVG",5,1,zilCoin); 
var xrpCoin= new Coin("XRP",5,1,xvgCoin); 
var trxCoin= new Coin("TRX",5,1,xrpCoin); 


setInterval(r3, minute*3);
	function r3(){
		trxCoin.calc();
	}
