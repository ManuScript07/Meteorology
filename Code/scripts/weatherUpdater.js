import { updateArcProgress } from "./arcProgress.js";
import { updateWeatherByTheHour } from "./weaterBytheHour.js";
import { updateIndicatorLevel } from "./indicatorLevel.js";
import { updateForecastForTheWeek } from "./forecastForTheWeek.js";



export function updateWeatherData(city){
    console.log(`Обновление данных для: ${city}`);
    updateArcProgress(city);
    updateWeatherByTheHour(city);
    updateIndicatorLevel(city);
    updateForecastForTheWeek(city);

}