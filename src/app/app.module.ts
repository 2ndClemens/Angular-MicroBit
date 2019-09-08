import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MicrobitComponent } from './components/microbit/microbit.component';
import { Microbit3dComponent } from './components/microbit-3d.component/microbit-3d.component';

@NgModule({
  declarations: [
    AppComponent,
    MicrobitComponent,
    Microbit3dComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
