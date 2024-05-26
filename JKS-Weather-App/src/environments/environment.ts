// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_KEY :'dc179afa7955b3fe807e8fb2372f72e7',
  API_URL:'https://api.openweathermap.org/data/2.5/',
  firebaseConfig: {
    apiKey: "AIzaSyCg4JzROjoLXZJChoMzNTjthCWy9Nd9CQ4",
    authDomain: "jks-weather.firebaseapp.com",
    projectId: "jks-weather",
    storageBucket: "jks-weather.appspot.com",
    messagingSenderId: "736407598289",
    appId: "1:736407598289:web:4dd3e4383471939fa941f0"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
