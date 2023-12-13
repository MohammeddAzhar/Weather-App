import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3001;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    console.error(error);
  }
});

app.post("/location", async (req, res) => {
  try {
    const city = req.body.city;
    const response_weather = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: "4e40d8fe9f01600de5a4fae14cbdd5b7",
        },
      }
    );
    const response_forecast = await axios.get(
      "http://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          lat: response_weather.data.coord.lat,
          lon: response_weather.data.coord.lon,
          appid: "4e40d8fe9f01600de5a4fae14cbdd5b7",
        },
      }
    );

    const main = [
      "Thunderstorm",
      "Drizzle",
      "Rain",
      "Snow",
      "Mist",
      "Smoke",
      "Haze",
      "Dust",
      "Fog",
      "Sand",
      "Dust",
      "Ash",
      "Squall",
      "Tornado",
      "Clear",
      "Clouds",
    ];
    const icons = [
      "sun",
      "cloud",
      "cloud-lightning",
      "cloud-rain",
      "cloud-snow",
      "cloud-drizzle",
      "wind",
    ];

    const iconSet = (main) => {
      let icon;
      switch (response_weather.data.weather[0].main) {
        case "Thunderstorm":
          icon = icons[2];
          break;
        case "Drizzle":
          icon = icons[5];
          break;
        case "Rain":
          icon = icons[3];
          break;
        case "Snow":
          icon = icons[4];
          break;
        case "Clear":
          icon = icons[0];
          break;
        case "Clouds":
          icon = icons[1];
          break;
        default:
          icon = icons[6];
      }
      return icon;
    };

    const forecastData = (n) => {
      return {
        forecastTemp: Math.round(
          parseInt(response_forecast.data.list[n].main.temp) - 273.15
        ),
        forecastIcon: iconSet(response_forecast.data.list[n].weather[0].main),
        forecastDate: response_forecast.data.list[n].dt_txt.substring(8, 10),
      };
    };

    // console.log(response_weather.data);
    // console.log(response_forecast.data);
    console.log(forecastData(9));
    console.log(forecastData(17));
    console.log(forecastData(25));
    console.log(forecastData(33));

    res.render("index", {
      location: response_weather.data.name,
      temp: Math.round(parseInt(response_weather.data.main.temp) - 273.15),
      weather: response_weather.data.weather[0].main,
      icon: iconSet(response_weather.data.weather[0].main),
      pressure: response_weather.data.main.pressure,
      humidity: response_weather.data.main.humidity,
      wind: parseInt(response_weather.data.wind.speed) * 3.6,
      icon1: forecastData(9).forecastIcon,
      icon2: forecastData(17).forecastIcon,
      icon3: forecastData(25).forecastIcon,
      icon4: forecastData(33).forecastIcon,
      temp1: forecastData(9).forecastTemp,
      temp2: forecastData(17).forecastTemp,
      temp3: forecastData(25).forecastTemp,
      temp4: forecastData(33).forecastTemp,
    });
  } catch (error) {
    res.render("index", { location: "Error!" });
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
