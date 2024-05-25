import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

const API_URL = environment.API_URL;
const API_KEY = environment.API_KEY;

interface WeatherResponse {
  main: {
    temp: number;
    temp_max?: number;
    temp_min?: number;
    humidity?: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  name: string;
  wind: {
    speed: number;
  };
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  weatherTemp: WeatherResponse | null = null;
  todayDate: string = new Date().toLocaleDateString();
  cityName: string = '';
  weatherIcon: string = '';
  isCelsius: boolean = true;
  weatherData: { [key: string]: WeatherResponse } = {};
  errorLoadingData: boolean = false;
  dailyForecastData: any[] = [];

  constructor(
    public httpClient: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) {
    this.loadData('MANILA');
    this.fetchWeatherDataForOtherCities();
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString();
  }

  isMorning(): boolean {
    const currentTime = new Date().getHours();
    return currentTime >= 7 && currentTime < 20;
  }

  async refreshData() {
    console.log('Refreshing data...');

    const alert = await this.alertController.create({
      message: 'Refreshing Data...',
      translucent: true,
      animated: true,
      backdropDismiss: false,
    });

    await alert.present();

    setTimeout(() => {
      alert.dismiss();
    }, 500);

    this.loadData(this.cityName);
  }

  toggleTemperatureUnit(unit: string) {
    this.isCelsius = unit === 'celsius';
  }

  searchCity(cityName: string | null | undefined) {
    if (cityName && cityName.trim() !== '') {
      this.loadData(cityName);
    }
  }

  loadData(cityName: string) {
    this.httpClient.get<WeatherResponse>(`${API_URL}/weather?q=${cityName}&appid=${API_KEY}`).subscribe(
      (results: WeatherResponse) => {
        this.weatherTemp = results;
        this.cityName = results.name;
        this.weatherIcon = this.getWeatherIconUrl(results.weather[0].icon);
        this.errorLoadingData = false;
        this.fetchDailyForecast(cityName);
      },
      (error) => {
        console.error('Error fetching weather data:', error);
        this.errorLoadingData = true;
      }
    );
  }

  fetchWeatherDataForOtherCities() {
    const cities = ['Tokyo', 'Seoul', 'Bangkok'];
    cities.forEach(city => {
      this.httpClient.get<WeatherResponse>(`${API_URL}/weather?q=${city}&appid=${API_KEY}`).subscribe(
        (results: WeatherResponse) => {
          this.weatherData[city] = results;
        },
        (error) => {
          console.error(`Error fetching weather data for ${city}:`, error);
        }
      );
    });
  }

  get weatherDataKeys() {
    return Object.keys(this.weatherData);
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  }

  goToDevelopersPage() {
    this.router.navigateByUrl('developers');
  }

  showWeatherDetails(city: string) {
    this.weatherTemp = this.weatherData[city];
    this.cityName = city;
    this.weatherIcon = this.getWeatherIconUrl(this.weatherTemp.weather[0].icon);
    this.fetchDailyForecast(city);
  }

  fetchDailyForecast(cityName: string) {
    this.httpClient.get<any>(`${API_URL}/forecast?q=${cityName}&cnt=8&appid=${API_KEY}`).subscribe(
      (results: any) => {
        const uniqueDates: string[] = [];
        const nextSevenDays: any[] = [];
        results.list.forEach((day: any) => {
          const date = new Date(day.dt * 1000).toDateString();
          if (!uniqueDates.includes(date)) {
            uniqueDates.push(date);
            nextSevenDays.push(day);
          }
        });

        this.dailyForecastData = nextSevenDays;
      },
      (error) => {
        console.error('Error fetching daily forecast data:', error);
        this.errorLoadingData = true;
      }
    );
  }

  getDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[date.getDay()];
    return dayOfWeek;
  }

  submitReport() {
    // Navigate to the create-report page
    this.router.navigate(['/report']);
  }
}
