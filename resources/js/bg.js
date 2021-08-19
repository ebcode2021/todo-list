
let getBackgroundImage = (async () => { // 이전 로그 유무에 
		
		let prevBackground = JSON.parse(localStorage.getItem('bg-Log'));
		
		if(prevBackground && (prevBackground.expiresOn > Date.now())){ // 만약에 만료됬다면 새롭게 이미지 요청
			return prevBackground.imgInfo;
		}
		
		let newBackground = await requestBackground();

		insertBackgroundLog(newBackground);
		
		return newBackground;
		//document.querySelector('body').style.backgroundImage='url('+obj.urls.full+')';
});

let requestBackground = async () => {
	
	let params = {
		orientation : 'landscape',
		query : 'landscape'
	}
	
	let queryString = createQueryString(params); 
	
	let response = await fetch('https://api.unsplash.com/photos/random?' + queryString,{
		method : 'get',
		headers : {Authorization : 'Client-ID DBaBKlX_ush6GlAhUXvNkoJqj6PrYzqG4A7wQ8iajLU'}
		});
		
		let obj = await response.json();
		
		return { // 해당 API문서보면 나와있음
			img : obj.urls.full,
			place : obj.location.title
		}
}

let insertBackgroundLog = (newBackground) => {

	let expirationDate = new Date();
		expirationDate = expirationDate.setDate(expirationDate.getDate() + 1);
		
		const backgroundLog = {
			expiresOn : expirationDate,
      		imgInfo : newBackground

		}
		
		localStorage.setItem('bg-Log',JSON.stringify(backgroundLog));	
}

/*위치정보*/
let getCoords = async() => {
	if(!navigator.geolocation) {
	    return new Promise((resolve,reject) => {
			reject();
			});
	  } else {
		  return new Promise((resolve,reject) => {
			  navigator.geolocation.getCurrentPosition((position)=>{
		 		resolve(position.coords);
	    	});
	    })
	  }
}

let getLocationTemp = async () => {
		const OPEN_WEATHER_API_KEY = '78881c2ff3c114455b2a7c5c23d762e6';
		let coords = await getCoords();
		
		let params = {
				lat : coords.latitude,
				lon : coords.longitude,
				appid : OPEN_WEATHER_API_KEY,
				units : 'metric',
				lang : 'kr'
		};
		
		let queryString = createQueryString(params);
		
		let url = `https://api.openweathermap.org/data/2.5/weather?${queryString}`;
		let response = await fetch(url);
		let obj = await response.json();
		return {
			temp : obj.main.temp,
			place : obj.name
		}	
	}

(async () =>{
	/*배경 이미지와 배경 이미지의 위치정보 랜더링*/
	let background = await getBackgroundImage();
	document.querySelector('body').style.backgroundImage = `url(${background.img})`;
	
	if(background.place){
		document.querySelector('.footer_text').innerHTML += background.place;
	}
	
	/* 지역과 기온 랜더링 */
	let locationTemp = await getLocationTemp();
	document.querySelector('.location_text').innerHTML+=locationTemp.temp + 'º ' + locationTemp.place; 
	
})();