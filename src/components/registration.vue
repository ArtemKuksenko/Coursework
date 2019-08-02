<template>
	<!-- <div class="night"> -->
		<!-- <p>РЕГИСТРАЦИЯ</p> -->
	<!-- </div> -->
	<!-- <div style="background:#64B981"> -->
	<div class="reg">
		<p>
			<h1>прошу вашу почту сэр</h1>
			<input style="z-index: 1; margin: 5px;" @input="mail = $event.target.value" type="text" name="">
			<h1>уже скоро передем с почты в telegram</h1>
			простите за неудобства
		</p>
		<p>
			<button @click="validTheMail(mail)">Отослать</button>
		</p>
		<br>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
	  name: 'Reg',
	  data(){
	  	mail:null
	  },
	  methods: {
	  	validTheMail(mail){
	  		let send = mail;
	  		mail    = mail.split('@');
	  		if (mail.length == 2 )
	  			mail[1] = mail[1].split('.');
	  		// console.log(mail,mail.length,mail.length == 2,(mail[0].length > 0));
	  		if( (mail.length == 2) && (mail[0].length > 0) &&
	  			(mail[1][0].length > 0) && (mail[1][1].length > 0) ){
	  		 	// alert('mail корректен');
	  		 	this.sendMail(send);
	  		}else{
	  			alert('email введен не корректно');
	  		}
	  	},
		  sendMail(mail){
		  	let q = `http://localhost:3000/get?mail=${mail}`;
		  	console.log(q);
		  	// let headers = {
	    //       'Access-Control-Allow-Origin': '*',
	    //       'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, Authorization',
	    //       'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
	    //       'Access-Control-Allow-Credentials': true,     
	    //       'Content-Type': 'text/html; charset=utf-8'   
	    //     };
	    //     params = {'HTTP_CONTENT_LANGUAGE': 'rus'}
		  	axios
		  		.get(q)
		  		.then(
		  			value => {alert(value.data.msg);console.log(value)},
		  			err => {alert(err);}
		  		);

		  }

		}
	  }
</script>

<style scoped> 
.reg{
	/*background: red;*/
	/*position: fixed;*/
	color: black;
  
}
</style>