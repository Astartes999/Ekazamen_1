$(function () {
    
    const ACCESS_KEY = "d26f0110b607b404c6ab58c4a721067b"; //ключ для опенвезермэп
    letsBegin();

    function createAPI(response) {  // функция заполнения сегодняшнего прогноза
        const weatherFullData =
        {
            city: response.name,
            country: response.sys.country,
            time: new Date(response.dt * 1000),
            icon: "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png",
            iconDescription: response.weather[0].description,
            temperature: response.main.temp,
            temp_max: response.main.temp_max,
            sunrise: new Date(response.sys.sunrise * 1000),
            sunset: new Date(response.sys.sunset * 1000),
            coord_lon: response.coord.lon,
            coord_lat: response.coord.lat,
        }
        $("#img_icon_we").attr("src", weatherFullData.icon); // вставка значка иконки
        $("#today_head_row_2_col_1_description").text(weatherFullData.iconDescription); // вставка подписи под значок
        $("#today_head_row_2_col_2_temp").text(Math.round(weatherFullData.temperature) + "℃");
        $("#today_head_row_2_col_2_temp_max").text(Math.round(weatherFullData.temp_max) + "℃");
        $("#today_head_row_2_col_3_sunrise_text").text("Sunrise ");
        $("#today_head_row_2_col_3_sunset_text").text("Sunset ");
        $("#today_head_row_2_col_3_duration_text").text("Duration ");
        $("#today_head_row_2_col_3_sunrise").text(getDateAPI(weatherFullData.sunrise, "HoursAndMinutes"));
        $("#today_head_row_2_col_3_sunset").text(getDateAPI(weatherFullData.sunset, "HoursAndMinutes"));
        $("#today_head_row_2_col_3_duration").text(getDuration());
        $("#today_head_row_1_date").text(getDateAPI(weatherFullData.time, "DayMonthYear")); // текущая дата - надо будет взять ее из запроса
        $("#mainHeadSearch").val(response.name); // передаем значение города найденного по координатам в строку поиска
        function getDateAPI(date, count) {
            if (count == "HoursAndMinutes") {
                let hour = date.getHours() + 1;
                let min = date.getMinutes() + 1;
                if (hour < 10) { hour = "0" + hour; }
                if (min < 10) { min = "0" + min; }
                return hour + ":" + min;
            }
            else if (count == "DayMonthYear") {
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                if (day < 10) { day = "0" + day; }
                if (month < 10) { month = "0" + month; }
                return day + "." + month + "." + year;
            }
        }
        function getDuration(){ // функция вычисления длительности дня
            let hourSr = weatherFullData.sunrise.getHours() + 1;
            let minSr = weatherFullData.sunrise.getMinutes() + 1;
            let hourSs = weatherFullData.sunset.getHours() + 1;
            let minSs = weatherFullData.sunset.getMinutes() + 1;
            let hourD = hourSs - hourSr;
            let minD = minSs - minSr;
            if (minD <= 0){
                hourD--;
                minD += 60;  
            }
            if (hourD < 10) { hourD = "0" + hourD; }
            if (minD < 10) { minD = "0" + minD; }
            return hourD + ":" + minD;
        }
    }
    function createAPI1(response)  { // функция для заполнения потрехчасового прогноза
        const weatherForecast =
        {
            countOfTd: kolvoTd(), 
            arrTr1: arrOfHours(),
            arrTr2: arrOfImage("t"),
            arrTr2f: arrOfImage("f"),
            arrTr3: arrOfMain(),
            arrTr4: arrOfTemp("temp"),
            arrTr5: arrOfTemp("temp_max"),
            arrTr6: arrOfWinds(),
            dayOfWeek: getDayOfWeek("dayOfWeek",0),
            dayAndMonth: getDayOfWeek("dayAndMonth",0),
        }
        function getDayOfWeek(marker,pos){
            if (marker == "dayOfWeek"){
                let day = new Date(response.list[pos].dt * 1000);
                x = day.getDay();
                switch (x)
                    {
                        case 0: return "Sunday"; break;
                        case 1: return "Monday"; break;
                        case 2: return "Tuesday"; break;
                        case 3: return "Wednesday"; break;
                        case 4: return "Thursday"; break;
                        case 5: return "Friday"; break;
                        case 6: return "Saturday"; break;
                        case 7: return "Sunday"; break;
                    }
            }
            if (marker == "dayAndMonth"){
                let day = new Date(response.list[pos].dt * 1000);
                date = day.getDate();
                month = day.getMonth()+1;
                return month + " " + date;
            }

        }
        function arrOfHours() // функция создания массива часов
        {
            var arrHours = [];
            for (let i = 0; i <= kolvoTd(); i++) {
                arrHours[i] = getDateAPI(new Date(response.list[i].dt * 1000), "hour");
            }
            return arrHours;
        }
        function kolvoTd() // функция определения количества оставшихся часов до конца дня
        {
            let countOfTd = 0;
            do {
                let hourApi = new Date(response.list[countOfTd].dt * 1000);
                countOfHours = hourApi.getHours();
                countOfTd++;
            }
            while (countOfHours !== 0);
            return countOfTd;
        }
        function getDateAPI(date, count) // функция определения ам или пм и возвращение текущего часа из апи
        {
            if (count == "hour") {
                let hour = date.getHours();
                pmOrAm = "pm";
                if (hour < 12) { 
                    pmOrAm = "am"; 
                    if (hour < 10) { 
                        hour = "0" + hour; 
                    }
                }
                else if (hour >= 12){
                    hour -= 12;
                    if (hour < 10) { 
                        hour = "0" + hour; 
                    } 
                }
                return hour + pmOrAm;
            }
        }
        function arrOfImage(marker) // функция создания массива картинок
        {
            var arrImage = [];
            if (marker == "t"){
                for (let i = 0; i <= kolvoTd(); i++) {
                    arrImage[i] = "<img id='img_icon_we" + i + "' src='http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png' />";
                }
                return arrImage;
            }
            else if (marker == "f"){
                for (let i = 0; i <= kolvoTd(); i++) {
                    arrImage[i] = "<img id='img_icon_wef" + i + "' src='http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png' />";
                }
                return arrImage;
            }
        }
        function arrOfMain() // функция создания массива подписей под картинками
        {
            var arrMain = [];
            for (let i = 0; i <= kolvoTd(); i++) {
                arrMain[i] = response.list[i].weather[0].main;
            }
            return arrMain;
        }
        function arrOfTemp(marker) // функция формирования массива температуры или максимальной температуры в зависимости от маркера
        {
            var arrTemp = [];
            for (let i = 0; i <= kolvoTd(); i++) {
                if (marker == "temp") {
                    arrTemp[i] = (response.list[i].main.temp).toFixed(1);
                }
                else if (marker == "temp_max") {
                    arrTemp[i] = (response.list[i].main.temp_max).toFixed(1);
                }
            }
            return arrTemp;
        }
        function arrOfWinds() // функция формирования массива скорости ветра и его направления
        {
            var arrWinds = [];
            for (let i = 0; i <= kolvoTd(); i++) {
                let winds = response.list[i].wind.speed;
                let direction = response.list[i].wind.deg;
                arrWinds[i] = Math.round(winds) + getDirection(direction);
            }
            return arrWinds;
        }
        function getDirection(deg) // функция определеия направления ветра
        {
            if ((deg <= 15) || (deg >= 345)) { return "N" }
            else if ((deg > 15) && (deg < 30)) { return "NNE" }
            else if ((deg >= 30) && (deg <= 60)) { return "NE" }
            else if ((deg > 60) && (deg < 75)) { return "NEE" }
            else if ((deg >= 75) && (deg <= 105)) { return "E" }
            else if ((deg > 105) && (deg < 120)) { return "SEE" }
            else if ((deg >= 120) && (deg <= 150)) { return "SE" }
            else if ((deg > 150) && (deg < 165)) { return "SSE" }
            else if ((deg >= 165) && (deg <= 195)) { return "S" }
            else if ((deg > 195) && (deg < 210)) { return "SSW" }
            else if ((deg >= 210) && (deg <= 240)) { return "SW" }
            else if ((deg > 240) && (deg < 255)) { return "SWW" }
            else if ((deg >= 255) && (deg <= 285)) { return "W" }
            else if ((deg > 285) && (deg < 300)) { return "NWW" }
            else if ((deg >= 300) && (deg <= 330)) { return "NW" }
            else if ((deg > 330) && (deg < 345)) { return "NNW" }
        }
        for (let i = 1; i <= 6; i++) // цикл задания id всех остальных ячеек
        {
            for (let j = 1; j <= weatherForecast.countOfTd + 1; j++) {
                $("<td id='td-" + i + "-" + j + "'>").appendTo("#tr-" + i);
                $("<td id='td-f" + i + "-" + j + "'>").appendTo("#tr-f" + i); // в прогноз для 5 дней
            }
        }
        $("#td-1-1").text("Today");
        $("#td-f1-1").text(weatherForecast.dayOfWeek);// в прогноз для 5 дней
        $("#td-2-1").text("Picture");
        $("#td-f2-1").text("Picture");// в прогноз для 5 дней
        $("#td-3-1").text("Forecast");
        $("#td-f3-1").text("Forecast");// в прогноз для 5 дней
        $("#td-4-1").text("Temp ℃");
        $("#td-f4-1").text("Temp ℃");// в прогноз для 5 дней
        $("#td-5-1").text("Max Temp");
        $("#td-f5-1").text("Max Temp");// в прогноз для 5 дней
        $("#td-6-1").text("Wind (kmp/h)");
        $("#td-f6-1").text("Wind (kmp/h)");// в прогноз для 5 дней

        for (let j = 2; j <= weatherForecast.countOfTd + 1; j++) {
            $("#td-1-" + j).text(weatherForecast.arrTr1[j - 2]).appendTo("#tr-1"); // вывод строки с часами до конца дня
            $("#td-f1-" + j).text(weatherForecast.arrTr1[j - 2]).appendTo("#tr-f1"); // вывод строки с часами до конца дня в прогноз для 5 дней
            $(weatherForecast.arrTr2[j - 2]).appendTo("#td-2-" + j); // вывод строки с картинками
            $(weatherForecast.arrTr2f[j - 2]).appendTo("#td-f2-" + j); // вывод строки с картинками в прогноз для 5 дней
            $("#td-3-" + j).text(weatherForecast.arrTr3[j - 2]).appendTo("#tr-3");
            $("#td-f3-" + j).text(weatherForecast.arrTr3[j - 2]).appendTo("#tr-f3"); // в прогноз для 5 дней
            $("#td-4-" + j).text(weatherForecast.arrTr4[j - 2]).appendTo("#tr-4");
            $("#td-f4-" + j).text(weatherForecast.arrTr4[j - 2]).appendTo("#tr-f4"); // в прогноз для 5 дней
            $("#td-5-" + j).text(weatherForecast.arrTr5[j - 2]).appendTo("#tr-5");
            $("#td-f5-" + j).text(weatherForecast.arrTr5[j - 2]).appendTo("#tr-f5"); // в прогноз для 5 дней
            $("#td-6-" + j).text(weatherForecast.arrTr6[j - 2]).appendTo("#tr-6");
            $("#td-f6-" + j).text(weatherForecast.arrTr6[j - 2]).appendTo("#tr-f6"); // в прогноз для 5 дней
        }
        for (let i = 0; i < 40; i = i+8){
            let ind = i/8+1;
            $("#day_" + ind + "_head").text(getDayOfWeek("dayOfWeek",i));
            $("#day_" + ind + "_date").text(getDayOfWeek("dayAndMonth",i));
            $("#day_" + ind + "_icon").attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png");
            $("#day_" + ind + "_temp").text((response.list[i].main.temp).toFixed(1) + " ℃");
            $("#day_" + ind + "_descript").text(response.list[i].weather[0].description);
        }
    }
    function createAPI2(response){ // функция для заполнения Nearby
        $("#town1").text(response.list[0].name);
        $("#town2").text(response.list[1].name);
        $("#town3").text(response.list[2].name);
        $("#town4").text(response.list[3].name);
        
        $("#icon_town1").attr("src","http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + "@2x.png");
        $("#icon_town2").attr("src","http://openweathermap.org/img/wn/" + response.list[1].weather[0].icon + "@2x.png");
        $("#icon_town3").attr("src","http://openweathermap.org/img/wn/" + response.list[2].weather[0].icon + "@2x.png");
        $("#icon_town4").attr("src","http://openweathermap.org/img/wn/" + response.list[3].weather[0].icon + "@2x.png");

        $("#temp_town1").text(Math.round(response.list[0].main.temp) + " ℃");
        $("#temp_town2").text(Math.round(response.list[1].main.temp) + " ℃");
        $("#temp_town3").text(Math.round(response.list[2].main.temp) + " ℃");
        $("#temp_town4").text(Math.round(response.list[3].main.temp) + " ℃");
    }
    function mistake404() // функция вывода окна 404 в случае неправильного ввода или ошибки запроса
    {
        $("div.content[data-menu='1']").hide(); // прячем меню 1
        $("div.content[data-menu='2']").hide(); // прячем меню 2
        $("#mistake404").show(); // отображаем меню 404
        let town = $("#mainHeadSearch").val(); // формируем вывод
        let msgTown = "Could not be found.\n Please enter a different location"; // формируем вывод
        $("#mistake404").text(town + msgTown); // формируем вывод
        $("#mainHeadSearch").val("Enter other town"); // в инпут вводим просьбу ввести город
        $(".menu.active").removeClass("active"); // удаляем активный класс, чтобы работало по клику то меню из которого был введен поиск, иначе оно не работает
    }
    function makeNewCall(){ // функция по клику кнопки zoom
            makeAPICall("http://api.openweathermap.org/data/2.5/weather?&q=" + $("#mainHeadSearch").val() + "&units=Metric&lang=ru&appid=" + ACCESS_KEY, "current"); // вызываем запрос для отображения текущей погоды нового города
            makeAPICall("http://api.openweathermap.org/data/2.5/weather?&q=" + $("#mainHeadSearch").val() + "&units=Metric&lang=ru&appid=" + ACCESS_KEY, "current_new"); // снова вызываем, лишь для того, чтобы вытащить координаты нового города для nearby
    }
    function createAPI3(response){ // функция апи для передачи координат города
        let lon = response.coord.lon;
        let lat = response.coord.lat;
        makeAPICall("http://api.openweathermap.org/data/2.5/find?lat=" + lat + "&lon=" + lon  + "&units=Metric&cnt=5&appid=" + ACCESS_KEY, "nearby");
        makeAPICall("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=Metric&appid=" + ACCESS_KEY, "forecast_new");
    }
    function createAPI4(response){ // функция апи для отображения погоды в nearby
        const weatherForecast =
        {
            countOfTd: kolvoTd(), 
            arrTr1: arrOfHours(),
            arrTr2: arrOfImage(),
            arrTr3: arrOfMain(),
            arrTr4: arrOfTemp("temp"),
            arrTr5: arrOfTemp("temp_max"),
            arrTr6: arrOfWinds(),
        }
        function arrOfHours() // функция создания массива часов
        {
            var arrHours = [];
            for (let i = 0; i <= kolvoTd(); i++) {
                arrHours[i] = getDateAPI(new Date(response.list[i].dt * 1000), "hour");
            }
            return arrHours;
        }
        function kolvoTd() // функция определения количества оставшихся часов до конца дня
        {
            let countOfTd = 0;
            do {
                let hourApi = new Date(response.list[countOfTd].dt * 1000);
                countOfHours = hourApi.getHours();
                countOfTd++;
            }
            while (countOfHours !== 0);
            return countOfTd;
        }
        function getDateAPI(date, count) // функция определения ам или пм и возвращение текущего часа из апи
        {
            if (count == "hour") {
                let hour = date.getHours();
                pmOrAm = "pm";
                if (hour < 12) { 
                    pmOrAm = "am"; 
                    if (hour < 10) { 
                        hour = "0" + hour; 
                    }
                }
                else if (hour >= 12){
                    hour -= 12;
                    if (hour < 10) { 
                        hour = "0" + hour; 
                    } 
                }
                return hour + pmOrAm;
            }
        }
        function arrOfImage() // функция создания массива картинок
        {
            var arrImage = [];
            for (let i = 0; i <= kolvoTd(); i++) {
                arrImage[i] = "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png";
            }
            return arrImage;
        }
        function arrOfMain() // функция создания массива подписей под картинками
        {
            var arrMain = [];
            for (let i = 0; i <= kolvoTd(); i++) {
                arrMain[i] = response.list[i].weather[0].main;
            }
            return arrMain;
        }
        function arrOfTemp(marker) // функция формирования массива температуры или максимальной температуры в зависимости от маркера
        {
            var arrTemp = [];
            for (let i = 0; i <= kolvoTd(); i++) {
                if (marker == "temp") {
                    arrTemp[i] = (response.list[i].main.temp).toFixed(1);
                }
                else if (marker == "temp_max") {
                    arrTemp[i] = (response.list[i].main.temp_max).toFixed(1);
                }
            }
            return arrTemp;
        }
        function arrOfWinds() // функция формирования массива скорости ветра и его направления
        {
            var arrWinds = [];
            for (let i = 0; i <= kolvoTd(); i++) {
                let winds = response.list[i].wind.speed;
                let direction = response.list[i].wind.deg;
                arrWinds[i] = Math.round(winds) + getDirection(direction);
            }
            return arrWinds;
        }
        function getDirection(deg) // функция определеия направления ветра
        {
            if ((deg <= 15) || (deg >= 345)) { return "N" }
            else if ((deg > 15) && (deg < 30)) { return "NNE" }
            else if ((deg >= 30) && (deg <= 60)) { return "NE" }
            else if ((deg > 60) && (deg < 75)) { return "NEE" }
            else if ((deg >= 75) && (deg <= 105)) { return "E" }
            else if ((deg > 105) && (deg < 120)) { return "SEE" }
            else if ((deg >= 120) && (deg <= 150)) { return "SE" }
            else if ((deg > 150) && (deg < 165)) { return "SSE" }
            else if ((deg >= 165) && (deg <= 195)) { return "S" }
            else if ((deg > 195) && (deg < 210)) { return "SSW" }
            else if ((deg >= 210) && (deg <= 240)) { return "SW" }
            else if ((deg > 240) && (deg < 255)) { return "SWW" }
            else if ((deg >= 255) && (deg <= 285)) { return "W" }
            else if ((deg > 285) && (deg < 300)) { return "NWW" }
            else if ((deg >= 300) && (deg <= 330)) { return "NW" }
            else if ((deg > 330) && (deg < 345)) { return "NNW" }
        }
        for (let j = 2; j <= weatherForecast.countOfTd + 1; j++) {
            $("#td-1-" + j).text(weatherForecast.arrTr1[j - 2]); // вывод строки с часами до конца дня
            $("#td-f1-" + j).text(weatherForecast.arrTr1[j - 2]); // вывод строки с часами до конца дня
            $("#img_icon_we" + (j-2)).attr("src", weatherForecast.arrTr2[j - 2]); // вывод строки с картинками
            $("#img_icon_wef" + (j-2)).attr("src", weatherForecast.arrTr2[j - 2]); // вывод строки с картинками
            $("#td-3-" + j).text(weatherForecast.arrTr3[j - 2]);
            $("#td-f3-" + j).text(weatherForecast.arrTr3[j - 2]);
            $("#td-4-" + j).text(weatherForecast.arrTr4[j - 2]);
            $("#td-f4-" + j).text(weatherForecast.arrTr4[j - 2]);
            $("#td-5-" + j).text(weatherForecast.arrTr5[j - 2]);
            $("#td-f5-" + j).text(weatherForecast.arrTr5[j - 2]);
            $("#td-6-" + j).text(weatherForecast.arrTr6[j - 2]);
            $("#td-f6-" + j).text(weatherForecast.arrTr6[j - 2]);
        } 
    }
    function getForecastDay(index){
        if (index == 1)
        {
            console.log("---Working1---");
        }
        else if (index == 2)
        {
            console.log("---Working2---");
        }
        else if (index == 3)
        {
            console.log("---Working3---");
        }
        else if (index == 4)
        {
            console.log("---Working4---");
        }
        else if (index == 5)
        {
            console.log("---Working5---");
        }
    }
    function letsBegin(){ // функция заполнения основных вкладок
        $("<div id='mainHead'>").appendTo("body"); // основной див для заголовка
        $("<div id='mainHeadDiv1'>").appendTo("#mainHead"); // Заголовок My Weather
        $("#mainHeadDiv1").text("My Weather"); // Заголовок My Weather
        $("<div id='mainHeadDiv2'>").appendTo("#mainHead"); // Строка поиска по названию города
        $("<input>", {type:'text', id:'mainHeadSearch', click: function(){this.select()}}).appendTo("#mainHeadDiv2");
        $("<img>", {src:'zoom.png',id:'zoom', click: function(){makeNewCall();}}).appendTo("#mainHeadDiv2");
        $("<div id='vkladki'>").appendTo("body");
        $("<div id='vkladka-1' class='menu'>").appendTo("#vkladki");
        $("#vkladka-1").text("Today");
        $("<div id='vkladka-2' class='menu'>").appendTo("#vkladki");
        $("#vkladka-2").text("5-day forecast");
    
        $(".menu").on("click", function () {
            if (!$(this).hasClass("active")) {
                $(".menu.active").removeClass("active");
                $(this).addClass("active");
                let id = $(this).attr("id");
                index = id.split("-").pop();
                $("div.content").hide(500);
                $("#mistake404").hide();
                $("div.content[data-menu='" + index + "']").show(500);
            }
        });
    
        $("<div class = 'content' id='today-1' data-menu='1'>").appendTo("body"); // вкладка для погоды на один день
        $("<div class = 'content' id='fiveDay-2' data-menu='2'>").appendTo("body"); // вкладка для погоды на 5 дней
        $("<div class = 'mistake404' id='mistake404'>").appendTo("body");
        $("#mistake404").hide();
        $("div.content[data-menu='1']").show(500); // делаем видимой первую вкладку

        $("<div id='today_head'>").appendTo("#today-1");
        $("<div id='today_head_row_1'>").appendTo("#today_head"); // строка для названия и текущей даты
        $("<div id='today_head_row_2'>").appendTo("#today_head"); // строка для всего остального
        $("<div id='today_head_row_1_name'>").appendTo("#today_head_row_1");
        $("#today_head_row_1_name").text("Current weather");
        $("<div id='today_head_row_1_date'>").appendTo("#today_head_row_1");
        $("#today_head_row_1_date").text("Current weather"); // текущая дата - надо будет взять ее из запроса

        $("<div id='today_head_row_2_col_1'>").appendTo("#today_head_row_2"); // солнце и надпись
        $("<div id='today_head_row_2_col_2'>").appendTo("#today_head_row_2"); // температура и температура максимум
        $("<div id='today_head_row_2_col_3'>").appendTo("#today_head_row_2"); // рассвет закат длительность
        $("<div id='today_head_row_2_col_3_1'>").appendTo("#today_head_row_2_col_3"); // надписи рассвет закат и длительность
        $("<div id='today_head_row_2_col_3_2'>").appendTo("#today_head_row_2_col_3"); //рассвет закат и длительность
    
        $("<div id='today_head_row_2_col_1_icon'>").appendTo("#today_head_row_2_col_1"); // сама иконка
        $("<img id='img_icon_we'>").appendTo("#today_head_row_2_col_1_icon"); // вставка значка иконки
        $("<div id='today_head_row_2_col_1_description'>").appendTo("#today_head_row_2_col_1"); // надпись под иконкой
    
        $("<div id='today_head_row_2_col_2_temp'>").appendTo("#today_head_row_2_col_2"); // температура
        $("<div id='today_head_row_2_col_2_temp_max'>").appendTo("#today_head_row_2_col_2"); // температура максимум
    
        $("<div id='today_head_row_2_col_3_sunrise_text'>").appendTo("#today_head_row_2_col_3_1");
        $("<div id='today_head_row_2_col_3_sunset_text'>").appendTo("#today_head_row_2_col_3_1");
        $("<div id='today_head_row_2_col_3_duration_text'>").appendTo("#today_head_row_2_col_3_1");
    
        $("<div id='today_head_row_2_col_3_sunrise'>").appendTo("#today_head_row_2_col_3_2"); // рассвет
        $("<div id='today_head_row_2_col_3_sunset'>").appendTo("#today_head_row_2_col_3_2"); // закат
        $("<div id='today_head_row_2_col_3_duration'>").appendTo("#today_head_row_2_col_3_2"); // продолжительность дня надо рассчитать
        
        $("<div id='today_main'>").appendTo("#today-1");
        $("<div id='today_main_hourly'>").appendTo("#today_main"); // заголовок hourly
        $("#today_main_hourly").text("Hourly");
        $("<table id='today_main_table'>").appendTo("#today_main"); // вставка таблицы
    
        for (let i = 1; i <= 6; i++) {
            $("<tr id='tr-" + i + "' class='tr'>").appendTo("#today_main_table"); // класс для первого столбца таблицы tr и задание первого столбца
        }

        $("<div id='today_main_nearby'>").appendTo("#today-1"); // див для ближайших мест
        $("<div id='today_main_nearby_label'>").appendTo("#today_main_nearby"); // див для заголовка
        $("#today_main_nearby_label").text("Nearby places"); // текст заголовка

        $("<div id='today_main_nearby_table'>").appendTo("#today_main_nearby"); // добавления дива таблицы
        $("<div id='today_main_nearby_col1'>").appendTo("#today_main_nearby_table"); // добавление первой колонки в таблицу
        $("<div id='today_main_nearby_col2'>").appendTo("#today_main_nearby_table"); // добавление второй колонки в таблицу
        $("<div id='today_main_nearby_col1_1'>").appendTo("#today_main_nearby_col1"); // добавление первой строки в первый столбец
        $("<div id='today_main_nearby_col1_2'>").appendTo("#today_main_nearby_col1"); // добавление второй строки в первый столбец
        $("<div id='today_main_nearby_col2_1'>").appendTo("#today_main_nearby_col2"); // добавление первой строки во второй столбец
        $("<div id='today_main_nearby_col2_2'>").appendTo("#today_main_nearby_col2"); // добавление второй строки во второй столбец

        $("<div id='town1'>").appendTo("#today_main_nearby_col1_1");
        $("<div id='town2'>").appendTo("#today_main_nearby_col1_2");
        $("<div id='town3'>").appendTo("#today_main_nearby_col2_1");
        $("<div id='town4'>").appendTo("#today_main_nearby_col2_2");
        $("<img id='icon_town1'>").appendTo("#today_main_nearby_col1_1");
        $("<img id='icon_town2'>").appendTo("#today_main_nearby_col1_2");
        $("<img id='icon_town3'>").appendTo("#today_main_nearby_col2_1");
        $("<img id='icon_town4'>").appendTo("#today_main_nearby_col2_2");
        $("<div id='temp_town1'>").appendTo("#today_main_nearby_col1_1");
        $("<div id='temp_town2'>").appendTo("#today_main_nearby_col1_2");
        $("<div id='temp_town3'>").appendTo("#today_main_nearby_col2_1");
        $("<div id='temp_town4'>").appendTo("#today_main_nearby_col2_2");

        $("<div id='fiveDay_main'>").appendTo("#fiveDay-2"); // основной див для вкладки для пяти дней
        $("<div id='fiveDay_forecast'>").appendTo("#fiveDay_main"); // основной див для вкладки для пяти дней

        for (let i = 1;i <= 5; i++){
            // $("<div id='day_" + i +"'>").appendTo("#fiveDay_forecast"); // формируем див для всего дня
            $("<div>",
            {
                id: "day_" + i,
                click: function(){getForecastDay(i)}
            }).appendTo("#fiveDay_forecast"); // формируем див для всего дня
            $("<div id='day_" + i +"_head'>").appendTo("#day_"+ i); // формируем див для заголовка
            $("<div id='day_" + i +"_date'>").appendTo("#day_"+ i); // формируем див для даты
            $("<div id='day_" + i +"_icon'>").appendTo("#day_"+ i); // формируем див для картинки
            $("<div id='day_" + i +"_temp'>").appendTo("#day_"+ i); // формируем див для температуры
            $("<div id='day_" + i +"_descript'>").appendTo("#day_"+ i); // формируем див для описания
        }

        $("<div id='fiveDay_main_hourly'>").appendTo("#fiveDay_main"); // заголовок hourly во вкладке 5day forecast
        $("#fiveDay_main_hourly").text("Hourly");
        $("<table id='fiveDay_main_table'>").appendTo("#fiveDay_main"); // вставка таблицы в hourly во вкладке 5day forecast
    
        for (let i = 1; i <= 6; i++) {
            $("<tr id='tr-f" + i + "' class='tr'>").appendTo("#fiveDay_main_table"); // класс для первого столбца таблицы tr и задание первого столбца
        }

        var geoSuccess = function(position) {
            makeAPICall("http://api.openweathermap.org/data/2.5/forecast?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&units=Metric&lang=ru&appid=" + ACCESS_KEY, "forecast");
            makeAPICall("http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&units=Metric&lang=ru&appid=" + ACCESS_KEY, "current");
            makeAPICall("http://api.openweathermap.org/data/2.5/find?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&units=Metric&cnt=5&appid=" + ACCESS_KEY, "nearby");
        };
        navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure);
        function geoFailure(positionError){
            makeAPICall("http://api.openweathermap.org/data/2.5/weather?&q=Vitebsk&units=Metric&lang=ru&appid=" + ACCESS_KEY, "current");
            makeAPICall("http://api.openweathermap.org/data/2.5/forecast?&q=Vitebsk&units=Metric&lang=ru&appid=" + ACCESS_KEY, "forecast");
            makeAPICall("http://api.openweathermap.org/data/2.5/find?lat=55.19&lon=30.21&units=Metric&cnt=5&appid=" + ACCESS_KEY, "nearby");
            $("#mainHeadSearch").val("Vitebsk");
        };
    }
    function makeAPICall(url, typeOfWeather) {
        $.ajax({
            dataType: "json",
            url: url,
            success: function (resp) {
                if (typeOfWeather == "forecast") {
                    createAPI1(resp);
                }
                else if (typeOfWeather == "current"){
                    createAPI(resp);
                }
                else if (typeOfWeather == "nearby")
                {
                    createAPI2(resp);
                }
                else if (typeOfWeather == "current_new")
                {
                    createAPI3(resp);
                }
                else if (typeOfWeather == "forecast_new")
                {
                    createAPI4(resp);
                }
            },
            error: function (err, status) 
            {
                mistake404();
            }
        });
    }
})