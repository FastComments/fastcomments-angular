import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableDebugTools } from '@angular/platform-browser';
import {ApplicationRef} from '@angular/core';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule).then(module => {
  const appRef = module.injector.get(ApplicationRef);
  const compRef = appRef.components[0];
  enableDebugTools(compRef);
});
