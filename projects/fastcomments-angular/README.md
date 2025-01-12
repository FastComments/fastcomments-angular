# ngx-fastcomments

This is an Angular library for FastComments, a live embedded commenting library.

## Installation

You will need fastcomments-typescript, which is a peer dependency. Please ensure this is included in your TypeScript compilation.

    npm install fastcomments-typescript --save
    npm install ngx-fastcomments --save

Then, add the `FastCommentsModule` to your application:

    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    
    import { AppComponent } from './app.component';
    import { FastCommentsModule } from 'ngx-fastcomments';
    
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

## Usage

To get started, we pass a config object for the demo tenant:

    <lib-fastcomments [config]="{ tenantId: 'demo' }"></lib-fastcomments>

Replace this with your own `tenantId`, like so:

    <lib-fastcomments [config]="{ tenantId: 'abc123' }"></lib-fastcomments>

Your `tenantId` is available [here](https://fastcomments.com/auth/my-account/api) in the FastComments admin area.

Since the configuration can get quite complicated, we can pass in an object reference:

    <lib-fastcomments [config]="fastcommentsConfig"></lib-fastcomments>

The widget uses change detection, so changing any properties of the configuration object will cause it to be reloaded.

This allows support for things like toggling dark mode, or pagination, simply by changing the configuration.

All configuration [in our docs](https://docs.fastcomments.com/guide-customizations-and-configuration.html) is supported. You can find
the TypeScript definitions for the configuration [on GitHub](https://github.com/FastComments/fastcomments-typescript/blob/main/src/fast-comments-comment-widget-config.ts).

### Account Region (ATTENTION: EU Customers)

If your account is located in the EU, set `region = 'eu'` in the widget configuration, for example:

    <lib-fastcomments [config]="{ tenantId: 'abc123', region: 'eu' }"></lib-fastcomments>

Otherwise, you do not have to define `region`.
