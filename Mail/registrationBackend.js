const adr = '//http://85.143.172.191:4000';
const secret = ( require('./secret.js') ).obj.secret;
let CryptoJS = require("crypto-js");
let AES = CryptoJS.AES;
let DB = require('./dbQuery.js');
let db = new DB('users');

function sendMail(mail){
	let nodemailer = require('nodemailer');
	const mailOpt = require('./mailOptions.js');
	console.log(mailOpt);
	console.log("secret - ",secret);
	let transporter = nodemailer.createTransport({
	 service: 'gmail',
	 auth: mailOpt.obj
	});
	const mailOptions = {
		from: 'kuksenko.artem@gmail.com', // sender address
		to: [mail], 
		subject: 'Подписка', // Subject line
		html: '<p>Го по ссылке для подтверждения почты:</p>'+// plain text body
			  adr+'/confirm?link='+AES.encrypt(mail,secret)+
			  '<p>Отписка</p>'+adr+'/bye?link='+AES.encrypt(mail,secret)
	};
	transporter.sendMail(mailOptions, function (err, info) {
	   if(err)
	     console.log(err)
	   else
	     console.log(info);
	});

}

let express = require('express');
let app = express();

app.get('/get', function (req, res) {
  console.log(req.query);
  sendMail(req.query.mail)
  res.setHeader('Access-Control-Allow-Origin','*');
  res.send(
  {
  	msg:"глянь почту"
  }
  ) 
});

app.get('/confirm', function (req, res) {
 let q = req.query.link.replace(/ /g,'+');
  console.log(q);
  var mail = CryptoJS.AES.decrypt(q.toString(),secret);
  mail = mail.toString(CryptoJS.enc.Utf8);
  console.log(mail);
  res.setHeader('Access-Control-Allow-Origin','*');
  res.send(`Ку ${mail}, теперь ты в тиме))`); 
  db.insert(mail);
});

app.get('/byebye', function (req, res) {
 let q = req.query.link.replace(/ /g,'+');
  console.log(q);
  var mail = CryptoJS.AES.decrypt(q.toString(),secret);
  mail = mail.toString(CryptoJS.enc.Utf8);
  res.setHeader('Access-Control-Allow-Origin','*');
  db.delete(mail);
  res.send(`Был ${mail}, и вот его с нами не стало(( 
Прощай наш ласковый мишка`); 
});

app.listen(4000);
