import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FastCommentsModule} from '../../projects/fastcomments-angular/src/lib/fast-comments.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FastCommentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
