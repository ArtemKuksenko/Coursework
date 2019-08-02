const mariadb = require('mariadb');
const pool = mariadb.createPool({ 
     user:'bot', 
     password: ' ',
     database: 'crypt'
});

const minute = 60000;

var arrGlobalOfGoodIndex = [];
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var deltaCandelsCount = 15; //игнор подряд идущих свечей

//run this aplication
lastIdex("ripple_m15_2018y",15+1,2.5); //таблица, кол-во рассматр свечей(k -> k+1),активация

// ////////////////////////////////////////////////////////////////////////////////////////////
let oldP = 0;
const delta   = 0.1;
const eps     = 0.002;
let porogAlpha = 10;
let oldPorogAlpha =0;
let alfaArr = [];

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	const penalty = 1; //при невыгодном прогнозе - наказываем бота
	const porogPenalty = 0.5; //при росте 0.5
	let   timeWatingProfit = minute*60*2;//миллисек 

function leastSquareMethod(arr){
	function kramerMethod(A, B){
       let d  = A[0][0]*A[1][1] - A[1][0]*A[0][1];
       let d1 = B[0]*A[1][1] - B[1]*A[0][1]; 
       return d1/d;
    }

    let sumX  = 0;
    let sumY  = 0;
    let sumX2 = 0;
    let sumXY = 0;

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

    let answ = kramerMethod(matrA,vectB);
    // console.log(answ);
    return answ;
}

//arr = [{x:,y:},{x:,y:}, ... {x:,y:}]
//длина arr - количество анализируемых свечей
//data - сама свеча
function calcPorog(data,activation){ 
	let arr = [];
	const K = 100000000;
	for (let i = 0; i < data.length;i++)
		arr[i]={x:i,y:(data[0].close-data[i].close)*K};

	let calcPorog = leastSquareMethod(arr);
	// console.log('наклон - ',calcPorog,arr);
	return (calcPorog > activation);		
}


function query(sql){

	return new Promise(async function(resolve, reject){
	  let conn;
	  try {
		conn = await pool.getConnection();
		const res = await conn.query(sql);
		resolve(res);
	  } catch (err) {
		reject(err);
	  } finally {
		if (conn) return conn.end();
	  }
	});
}


//select max(id) from tron_m15;
function lastIdex(tableName,countCandles,activation){
	query("select max(id) AS id from " + tableName)
	.then(
		res => {
			console.log("Last Index",res[0].id);
			loop(tableName,countCandles,countCandles,res[0].id,activation)

		},
		err => {
			console.log(err);
		}
	);
}

function loop(tableName,index,countCandles,end,activation){
	if(index<end){
		query("select close from " + tableName + 
			" where id > " + (index - countCandles) +
			" and id < "+index)
		.then(
			res =>{
				console.log("read the ",index)
				if ( calcPorog(res,activation) &&
				   ( arrGlobalOfGoodIndex[arrGlobalOfGoodIndex.length-1] == undefined ||
				   index - arrGlobalOfGoodIndex[arrGlobalOfGoodIndex.length-1]>=deltaCandelsCount	) ){
				   		console.log('=(^.^)=');
				   		arrGlobalOfGoodIndex.push(index);
				   }

				loop(tableName,index+1,countCandles,end,activation);
			},
			err => {
				console.log(err);
			}
		);
	}
	else{
		console.log("END",arrGlobalOfGoodIndex);
		calcProfit(arrGlobalOfGoodIndex,tableName,end,countCandles);
	}
}

function whatPeriodCloseOnthisIdCandle(id,tableName){
	let q = " select period, close from " +
		tableName + " where id = " + id;
	return (query(q)
		.then(
			res => {
				// console.log()
				return(res);
			},
			err => {
				console.log(err);
			}
		));

}
function calcMaxProfit(arr){
	let max = arr[0].close;
	for (let i =0;i<arr.length -1; i++)
		max = Math.max(max, arr[i].close);
	return max; 
}
function calcProfit(arr,tableName,end,countCandles){
	console.log("run the calc profit");
	let   profit = 0;

	loop(0);

	function loop(i){
		if(i< arr.length){
			whatPeriodCloseOnthisIdCandle(arr[i],tableName)
				.then(
					res => {
						// console.log(res[0].period);

						let q = "select close from " + tableName +
						" where period between " +( parseInt(res[0].period) + 1 )+
						" and " + ( parseInt(res[0].period) + timeWatingProfit );
						console.log(q);
						query(q)
							.then(
								r =>{
									let max = calcMaxProfit(r);
									max = ((max-res[0].close)/res[0].close)*100;
									max -= 0.02;
									// console.log("max- ",max);
									if(max >porogPenalty)
										profit += max;
									else
										profit -=penalty;
									loop(i+1);
								},
								err => {
									console.log("err");
									loop(i+1);
								}
						);
					},
					err => {
						console.log("err нет такого id");
						loop(i+1);	
					}
			);
		}
		else{
			console.log("profit - ",profit);
			gradient(profit,arr.length,end,countCandles,tableName);
		}
	}
}
//delete run of this module

// let oldP = 0;

function gradient(prof,length,end,countCandles,tableName){
	console.log(oldP,prof,end)
	if (porogAlpha > 0) {
		porogAlpha -= delta; 
		
		alfaArr.push({
			alfa: porogAlpha,
			profit: prof,
			signals: length,

		}); 
		// alfaArr.push(prof); 

		arrGlobalOfGoodIndex = [];
		profit = 0;
		lastIdex(tableName,countCandles,porogAlpha);
	} else {
		alfaArr.sort(compareProfit);
		makeReport(alfaArr,tableName,countCandles);
		console.log("УРААААА ",porogAlpha,alfaArr)
	}
}

function compareProfit(a, b) {
  return - a.profit + b.profit;
}

function makeReport(arr,tableName,countCandles){
	const fs = require("fs");
	let dt = new Date();
	fs.appendFileSync(`Report_${tableName}.txt`,
		`отчет :${dt.toString()}
		количество рассматримуемых свечей - ${countCandles}
		служебная инфа
		при невыгодном прогнозе - наказываем бота на ${penalty}%
		невыгодным считаем - ${porogPenalty} "угол"
		ожидание дохода - ${timeWatingProfit/minute/60} минут(ы)
		игнорим подряд хороших свечей - ${deltaCandelsCount}
		
`);
	for (let i =1; i<6;i++)
		fs.appendFileSync(`Report_${tableName}.txt`,
			`${arr[i].alfa} - угол
			${arr[i].profit} - дохода
			${arr[i].signals} - кол-во сигналов
			
`);
}