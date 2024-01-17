const searchBtn = document.querySelector('.search-box__btn'),
      searchInput = document.querySelector('.search-box__input'),
      image = document.querySelector('.weather-box__img'),
      temperature = document.querySelector('.weather-box__value'),
      state = document.querySelector('.weather-box__description'),
      humidity = document.querySelector('.weather-info__humidity-value'),
      wind = document.querySelector('.weather-info__wind-value'),
      container = document.querySelector('.container');
      weatherBox = document.querySelector('.weather-box__wrapper'),
      weatherInfo = document.querySelectorAll('.weather-info__box'),
      notFound = document.querySelector('.not-found__wrapper');


const fetchData = async (key, location) => {

    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}&units=metric&lang=ru`);
    const data = await result.json();

    if(data.cod == '404') {
        return '404';  
    }

    if(data.cod == '200'){

        let {
            main: {
                humidity: humidityValue,
                temp: temperatureValue
        },
            weather: [{main: stateCategory, description: stateValue}],
            wind: {
                speed: windValue
            }
        } = data;

        return {temperatureValue, stateValue, humidityValue, windValue, stateCategory};
    };
};

searchInput.addEventListener('input', () => {
    if(searchInput.value.match(/[\d!@#$%^&*()_,\.\/+'">?<~]/)){
        shakeEffect(searchInput);
    }
    
   
})

searchBtn.addEventListener('click', () => {
   search();
});

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
       search();
    }
});

function search(){
    const searchValue = searchInput.value.trim();
    searchInput.value = searchValue;

    if (searchValue == '') {
        shakeEffect(searchInput);
        return;
    };

    const key = 'f6c7265c24be5a61640388c80ec53680';
    let location = searchValue;


    fetchData(key, location)
        .then(data => {
            if(data === '404') {
                showNotFound();
                return;
            };

            setWeather(data.temperatureValue, data.stateValue, data.humidityValue, data.windValue, data.stateCategory);
        })
        .catch(error => console.log(error));
};

function setWeather(temperatureValue, stateValue, humidityValue, windValue, stateCategory) {
    temperature.textContent = Math.round(temperatureValue);
    state.textContent = stateValue[0].toUpperCase() + stateValue.slice(1);
    wind.textContent = windValue;
    humidity.textContent = humidityValue;
    showWeather();
};

function showNotFound(){
    container.style.height = '400px';
    weatherBox.classList.remove('active');
    weatherInfo[0].classList.remove('active');
    weatherInfo[1].classList.remove('active');
    notFound.classList.add('active');
};

function showWeather(){
    container.style.height = '555px';
    weatherBox.classList.add('active');
    weatherInfo[0].classList.add('active');
    weatherInfo[1].classList.add('active');
    notFound.classList.remove('active');
};

function shakeEffect(element){
    element.parentNode.classList.add('shake');
    setTimeout(() => element.parentNode.classList.remove('shake'), 500);
    element.value = element.value.replace(/[\d!@#$%^&*()_,\.\/+'">?<~ ]/, '');
}

