import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MicrobitComponent } from './components/microbit/microbit.component';
import { ThreeComponent } from './components/three/three.component';

@NgModule({
  declarations: [
    AppComponent,
    MicrobitComponent,
    ThreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
