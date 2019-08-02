<template>
  <div>
    <div class="app_header">
      <div>
        <img alt="Vue logo" src="../assets/pump.gif" width="100%">
      </div>

      <div class="header">
        <h1>Crypt</h1>
        <p>мы сервис информирующий вас о росте криптовалют</p>

        Курс {{base}} по отношению к {{change}}<br><br>
        
        <button  @click="showSubscribe()" >Подписаться на рассылку</button>
        <!-- <div v-if="subscribe"> -->

        <!-- </div> -->
        <!-- <div class="night"></div> -->
      </div>
    </div>

    <div class="link">
    <div class="app_grey-baground-black-text">
      
    <div class="form-group">

      <div v-if="subscribe"> <Reg /></div>

      <a href="#form-input-block"> выберите монету </a>
      <!-- <p>выберите монету</p>  -->
       <p><a name="form-input-block"></a></p>
      <select @input="newV($event.target.value)">
        <option>ethereum</option>
        <option>tron</option>
        <option>stellar</option>
        <option>verge</option>
        <option>zilliqa</option>
        <option>cardano</option>
      </select> 

      <p>или введите свою</p>
      <p><input type="text" @input="newV($event.target.value)" value=""></p> 

      <p>ищем от</p>
        <p><input type="date" @input="newTimeStart($event.target.value)"></p>
      <p>и до</p>
        <p><input class="form-control" type="date" @input="newTimeEnd($event.target.value)"></p>
      <p>свеча: {{interval}}</p>

      <input class="form-control" type="range" min="0" max="4" step="1" @input="selectTimeSet($event.target.value)">

      <p>угловой коэффициент {{alfaPorog}}</p>
      <input class="form-control" type="range" min="0" max="10" step="0.01" value="1" @input="alfaPorog = $event.target.value">

      <p>анализируем {{numberApproximating }} свечей</p>
      <input class="form-control" type="range" min="1" max="10" step="1" value="5" @input="numberApproximating = $event.target.value">

      <p>ожидание роста {{numberLooking}} свечей</p>
      <input class="form-control" type="range" min="1" max="40" step="1" value="24" @input="numberLooking = $event.target.value">

      <p> <button class="form-control" @click="main()">ПОКАЗАТЬ</button> </p>
    </div>
    </div>
    </div>

    <div class = "app_black-baground-green-text">
      <div class="center">
        <div class="card-deck">
          <div v-for="data in dataArray">
            <div class="app_wide-perpl-block" v-bind:style="data.background">
                <div class="card-header">{{data.price}} BTC</div>
                <p> угол : {{data.alfa}}</p>
                <p>Максимальный прирост %: {{data.maxInf}} </p>
                <div class="card-body">
                  <h5 class="card-title">прирост цены %:{{data.percent}}</h5>
                  <h5>объёма %:{{data.increase}}</h5>
                  <p class="card-text">
                  <p>Миллисекунды</p>
                  <p>{{data.unix}}</p>
                  <p>Время</p>
                  <p>{{data.time.hours}}:{{data.time.minutes}}</p></p>
                  <p>Дата:</p>
                  <p>{{data.date.day}}:{{data.date.month}}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
</div>


</template>

<script>

// import {GoogleCharts} from 'google-charts'
import axios from 'axios'
import DataChart from './avarageComponent.vue'
import Reg from './registration.vue'

export default {
  components:{
    Reg
  },
  data(){
    return {
      info: null,
      dataArray: [],
      change: 'bitcoin',
      interval: 'h1',
      intervalMilliseconds: 360000,
      base:'ethereum',
      timeStart:'1551599885000',
      timeEnd:'1551686584000',
      porogPercent:1,
      volume:0,
      alfaPorog:3,
      numberApproximating:5,
      numberLooking:24,
      nLastCandels:2,
      lastGoodCandelIndex:-10,
      registrationWindow:false,
      subscribe:false,
    }
  },

  name: 'Main',

  methods: {
    showSubscribe(){
      this.subscribe = true;
      // this.$emit('update:subscribe', !this.subscribe);

      // alert(this.subscribe);
    },

    inputConst(c,box){
      box = c;
    },

    leastSquareMethod(arr){
      
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

    },

    setPorogVolumePercent(p){
      this.volume=p;
    },

    newTimeStart(d){
      let year = parseInt(d[0] + d[1] + d[2] + d[3]);
      let month = parseInt(d[5] + d[6]) - 1;
      let day = parseInt(d[8] + d[9]);
      var time = new Date();
      time.setTime(0);
      time.setYear(year);
      time.setMonth(month);
      time.setDate(day);
      this.timeStart =+ time;
    },

    newTimeEnd(d){
      let year = parseInt(d[0] + d[1] + d[2] + d[3]);
      let month = parseInt(d[5] + d[6]) - 1;
      let day = parseInt(d[8] + d[9]);
      var time = new Date();
      time.setTime(0);
      time.setYear(year);
      time.setMonth(month);
      time.setDate(day);
      this.timeEnd =+ time;
    },

    selectTimeSet(timeLength){
      const minute = 60000;

      switch(timeLength){
        case "0":
          this.interval = "m1";
          this.intervalMilliseconds = 1 * minute; 
        break;
        case "1":
          this.interval = "m5";
          this.intervalMilliseconds = 5 * minute; 
        break;
        case "2":
          this.interval = "m15";
          this.intervalMilliseconds = 15 * minute;
        break;
        case "3":
          this.interval = "m30";
          this.intervalMilliseconds = 30 * minute; 
        break;
        case "4":
          this.interval = "h1";
          this.intervalMilliseconds = 60 * minute; 
        break;
      }
    },

    newV(v){
      this.base=v;
    },

    setPorogPercent(p){
      this.porogPercent=parseFloat(p);
    },

    main(){
      this.lastGoodCandelIndex = -10;
      this.calc(this.timeStart, this.timeEnd, this.porogPercent,
        this.change, this.interval, this.base, 'лог консоли');
    },

    calc(timeStart, timeEnd, porogPercent,change, interval, base, consolelog){
      const dayLenght = 86400000;
      console.log(
        'https://api.coincap.io/v2/candles?exchange=binance&interval=' +
        interval + '&baseId=' + base + '&quoteId=' + change + '&start=' 
        + timeStart + '&end=' + timeEnd
      );
      this.dataArray =[];
      
      axios
        .get('https://api.coincap.io/v2/candles?exchange=binance&interval=' +
          interval + '&baseId=' + base + '&quoteId=' + change + '&start=' +
          timeStart + '&end=' + timeEnd)
        .then(
          value => {
            let info = value.data.data;
            this.percent(info);
            console.log(info);      
          },reason => {
            let msg;
            switch(this.interval){
              case "h1":
                msg = "30 суток";
              break;
              case "m30":
                msg = "14 суток";
              break;
              case "m15":
                msg = "7 суток";
              break;
              case "m5":
                msg = "2 суток";
              break;
              case "m1":
                msg = "сутки";
              break;
            }
            alert (reason+'\nданные свечи можно смотреть не более чем за '+msg)
            // alert(reason);
          }
        );
    },

    percent(info){
      this.info = info;
      let dataArr = new Array;
      console.log("info.lenght", info.length)

      let k = this.numberApproximating -1; //смотрим 5 свечи

      ; //index последней хорошей свечи
      for(let i = k; i < info.length; i++){
        // console.log(info[i])
        
        let alfaFunction = (data, index, k)=> {
          let Arr = [];
          const K = 100000000;
          for (let i = 0; i <= k; i++ )
            Arr[i] = {x: i, y: (data[index -k +i].close - data[index].close)*K};
          // console.log(Arr);
          return (this.leastSquareMethod (Arr) );
        } 
        let p = (info[i].close - info[i].open) / info[i].close * 100;
        
        let pVolume = (info[i].volume-info[i-1].volume) /
                      info[i-1].volume * 100;
        
        let alfa = alfaFunction(info,i,k);
        // console.log(alfa,alfa > this.alfaPorog);

        // if ( (p > this.porogPercent) && (pVolume > this.volume) ){
        // if ((alfa > this.alfaPorog) && ((this.lastGoodCandelIndex+this.nLastCandels) < (i+1) ))  {
        if (alfa > this.alfaPorog){ 
          // alert(this.lastGoodCandelIndex);
          // this.lastGoodCandelIndex = i;
          // alert(this.lastGoodCandelIndex);
          //функция вычисления цвета плитки
          let color = ( k,porog ) =>{
              let p= k - porog*1.5;
              const alfa = 30 * porog;
              let g=28;
              let r=16;
              if(p > 0){
                g = g + alfa * p;
              } else {
                r = r - alfa * p;
              }

              if(r > 100 ) r = 100; 
              if(g > 100 ) g = 100;

              return("background:rgb("+r+","+g+",40)");
            }

          //функция вычисления наибольшего значения за l севчей
          let maxSpike = (data, index, l) => { //data данных
            const a = 1000;
            let max = parseFloat(data[index+1].close);
            
            if (data.length - index - l < 0)
              return " нетю ";

            for(let i = index+1; i < index+l; i++)
              max = Math.max(max, parseFloat(data[i].close));

            return (max*a - parseFloat(data[index].close)*a)/(parseFloat(data[index].close)*a)*100;
          }
          let spike = parseFloat(maxSpike(info, i, this.numberLooking)).toFixed(2);

          let d = new Date();
          d.setTime(info[i].period)
          // d = d.toString();
          dataArr.push({
            percent:p.toFixed(2),
            unix:info[i].period,
            date:{
              month:(d.getMonth()+1),
              year:d.getYear(),
              day:d.getDate()
            },
            time:{
              minutes:d.getMinutes(),
              hours:d.getHours()
            },
            increase: ( (info[i].volume-info[i-1].volume) /
                        info[i-1].volume*100 
                      ).toFixed(3),
            price: parseFloat(info[i].close).toFixed(8),
            maxInf: spike,
            background:color(spike,2),
            alfa: alfa.toFixed(2),
            // "background:rgb(16, 128, 40)"
          });
        }
      }
      // alert(this.dataArray.length)
      this.dataArray = dataArr;
    }
  },   

  mounted(){//по загрузке
  //   let Arr = [
  //     {x: 1,y: 1},
  //     {x: 2,y: 2},
  //     {x: 3,y: 4},
  //     {x: 4,y: 8},
  //     {x: 5,y: 10},
  //   ]
  //   alert(this.leastSquareMethod(Arr));
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped> -->
<style>


h1{
  margin: 0px;
  line-height:22px;
}

input[type=range] {
-webkit-appearance: none;
height: 3px;
}


/* Бегунок в Хроме */

input[type=range]::-webkit-slider-thumb {

height: 30px;
width: 30px;
border-radius: 50%/50%;
background:white; /*#2c3e50;*/
cursor: pointer;
-webkit-appearance: none;
/*margin-top: -14px;*/
}

/* Бегунок в Мозиле */

input[type=range]::-moz-range-thumb {
box-shadow: 1px 1px 1px #000;
border: 1px solid #000000;
height: 36px;
width: 16px;
border-radius: 40%/60%;
background: #ffffff;
cursor: pointer;
}

input,select,button  {
  font-size: 16px;
  height: 30px;
  width: 100%;
  text-align: center;
  border: none;
  background: white;
  text-align-last: center; 
  /*border-bottom: 1px solid #ccc;*/
}
button {
  background: #64B981;
  /*border: none;*/
  color: white;
  /*width: 100%;*/
  height: 60px;
}

.link a {
  display: block;
}

a{
  text-decoration:none;
  color: white;
}

 @media (min-device-width: 650px){
  .app_header{
    display: -webkit-flex;
    display: inline-flex; 
    flex-direction: row;
    /*display: table-column;*/
  }
  .form-group{
    font-size: 25px;
    /*line-height: 0px;*/
    /*margin:0px;*/
    width: 650px;
     display: -webkit-flex;
    display: inline-flex; 
    flex-direction: column;
  }

 }
 @media (max-device-width: 650px){
  .app_header{
    width: 100%;

    /*background: green;*/
  }
  .form-group{
    padding: 5px;
  }
  
 }
 .center{
    background: #2c3e50; 
    display: flex;
    align-items: center;
    align-content: center; 
    justify-content: center; 
 }
 .card-deck{
  /*background: yellow;*/
  display: grid;
  width: 100%;


 }

 @media (max-device-width: 450px){
   .card-deck{
    grid-template-columns: 1fr;
    width: 100%;
  }
 }
  @media (min-device-width: 450px) and (max-device-width: 600px){
   .card-deck{
    grid-template-columns: 1fr 1fr;
    max-width: 650px;
    /*width: 100%;*/
  }
 }
@media (min-device-width: 600px){
   .card-deck{
    grid-template-columns: 1fr 1fr 1fr;
    width: 660px;
  }
  .header{
     max-width: 300px;
  }
 }

  .header{
    padding: 10px;
    font-size: 15 px;
    text-align: left;
   
  }


  .app_grey-baground-black-text{
    background:#2c3e50;/*-------------*/
    color: white;
    width: 100%;
    /*min-width: 350px;*/
    /*padding-top: 5px;*/
    padding-bottom: 5px;
  }

  .app__flexDiv{
    display: -webkit-flex; 
    display: inline-flex; 
    flex-direction: column; 
  }

  .app_wide-perpl-block{
    background: #101C28;
    color: #ABC18A;
    /*width: 200px;*/
    width: 100%-10px;
    padding: 5px;
    margin:5px;
    /*position: relative;*/
    text-align: left;
  }
  
  .about{
    padding: 5px;
    background: #152D41;
    color: white;
  }
.night{
  background: black;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
