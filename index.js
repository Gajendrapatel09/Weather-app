const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const dataNotFound = document.querySelector(".not-found");

 
// Variables needed initially

let currentTab = userTab;
const API_KEY = "1fa19b0c3e7c2bd8bca1ffc741753d5b";
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab){
   if(clickedTab != currentTab) {
       currentTab.classList.remove("current-tab");
       currentTab = clickedTab;
       currentTab.classList.add("current-tab");

       if(!searchForm.classList.contains("active")) {
           //kya search wala container is invisible ,if yes then make it visible
           userInfoContainer.classList.remove("active");
           grantAccessContainer.classList.remove("active");
           searchForm.classList.add("active");
        //    dataNotFound.classList.add("active");
       }
       else{
           //main pehle search wale tab pe tha,ab your weather tab visible karna h
           searchForm.classList.remove("active");
           userInfoContainer.classList.remove("active");
           dataNotFound.classList.remove("active");
           // ab mein your tab me aagya hu, toh weather bhi display karna padega,so let's check local storage first
           //for coordinates,if we have saved them  there
           getFromSessionStorage();
       }
   }
}

userTab.addEventListener("click",() => {
   //pass clicked tab as input parameter
   switchTab(userTab);
});

searchTab.addEventListener("click", () => {
   //pass clicked tab as input parameter
   switchTab(searchTab); 
});

//check if coordinates are already present in session storage
function getFromSessionStorage() {
   const localCoordinates = sessionStorage.getItem("user-coordinates");
   if(!localCoordinates) {
       //agar local coordinates nhi mile 
       grantAccessContainer.classList.add("active");
   }
   else {
       const  coordinates = JSON.parse(localCoordinates);
       fetchUserWeatherInfo(coordinates);  
   }
}

async function fetchUserWeatherInfo(coordinates) {
   const {lat,lon}= coordinates;
   // make grant container invisible
   grantAccessContainer.classList.remove("active");
   // make your loader visible
   loadingScreen.classList.add("active");

   // API call
   try {
       const response = await fetch (
           `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
           );
           const data = await response.json();

           loadingScreen.classList.remove("active");
           userInfoContainer.classList.add("active");
           renderWeatherInfo(data);
   }
   catch(err) {
       loadingScreen.classList.remove("active");
       alert("Error in API fetching");
   }
}

function renderWeatherInfo(weatherInfo) {
   // firstly we have to fetch the elements
   const cityName = document.querySelector("[data-cityName]");
   const countryIcon = document.querySelector("[data-countryIcon]");
   const desc = document.querySelector("[data-weatherDesc]");
   const weatherIcon = document.querySelector("[data-weatherIcon]");
   const temp = document.querySelector("[data-temp]");
   const windspeed = document.querySelector("[data-windspeed]");
   const humidity = document.querySelector("[data-humidity]");
   const cloudiness = document.querySelector("[data-cloudiness]");

   //fetch values from weatherInfo object and put it into UI element
   cityName.innerText = weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys.country.toLowerCase()}.png`;
   desc.innerText = weatherInfo?.weather?.[0]?.description;
   weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerText = `${weatherInfo?.main?.temp} °C`;
   windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
   humidity.innerText = `${weatherInfo?.main?.humidity} %`;
   cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no geolocation support available
    }
}  


function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    } 

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

console.log("welcome ");

//fetchUserWeatherInfo(userCoordinates);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        dataNotFound.classList.remove("active");
        renderWeatherInfo(data);
    }
    catch(err) {
           dataNotFound.classList.add("active");
           userInfoContainer.classList.remove("active");
        //    alert("Error in API fetching");
    }
}




 