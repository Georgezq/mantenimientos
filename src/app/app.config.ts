import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app'
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage'
import { routes } from './app.routes';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
      provideFirebaseApp(() =>
        initializeApp({
          apiKey: "AIzaSyDdQMC-XRvBfvsqXdz2Ual_5zsnWi-PRFc",
          authDomain: "gf-pro.firebaseapp.com",
          projectId: "gf-pro",
          storageBucket: "gf-pro.appspot.com",
          messagingSenderId: "666485687162",
          appId: "1:666485687162:web:a442c3e78e85d24119ccc3"
        })
      ),
      provideStorage(() => getStorage()),

  ]
};
