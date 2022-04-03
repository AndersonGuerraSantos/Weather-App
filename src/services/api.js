import axios from "axios";

const api = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5"
  //lat=35&lon=139&appid={API key}
});

export default api;