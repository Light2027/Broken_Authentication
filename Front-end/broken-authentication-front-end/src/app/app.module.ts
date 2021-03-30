import * as appSettings from "../appsettings.json";

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms"

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {TableModule} from 'primeng/table';
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {CalendarModule} from 'primeng/calendar';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import {FileUploadModule} from 'primeng/fileupload';
import {PasswordModule} from 'primeng/password';
import {TooltipModule} from 'primeng/tooltip';

import {ChartModule} from 'primeng/chart';

import { LoginPageComponent } from './views/login-page/login-page.component';
import { ProfilePageComponent } from './views/profile-page/profile-page.component';
import { DashboardPageComponent } from './views/dashboard-page/dashboard-page.component';
import { RegisterPageComponent } from './views/register-page/register-page.component';
import { AboutPageComponent } from './views/about-page/about-page.component';
import { NotFoundPageComponent } from './views/not-found-page/not-found-page.component';

import {BackEndConnectionSettings} from "./models/back-end-connection-settings";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { HasherInterceptor } from "./interceptors/hasher.interceptor";
import { AdminPageComponent } from './views/admin-page/admin-page.component';
import { LogComponent } from './components/log/log.component';
import { SensorTableComponent } from './components/sensor-table/sensor-table.component';
import { SensorControllerComponent } from './components/sensor-controller/sensor-controller.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ProfilePageComponent,
    DashboardPageComponent,
    RegisterPageComponent,
    AboutPageComponent,
    NotFoundPageComponent,
    EditProfileComponent,
    AdminPageComponent,
    LogComponent,
    SensorTableComponent,
    SensorControllerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // PrimeNG Modules
    TableModule,
    MenubarModule,
    ButtonModule,
    DynamicDialogModule,
    CalendarModule,
    InputNumberModule,
    InputTextModule,
    ChartModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    FileUploadModule,
    PasswordModule,
    TooltipModule,
  ],
  providers: [{provide: BackEndConnectionSettings, useValue:{url: appSettings.BackEndConnectionSettings.url, port: appSettings.BackEndConnectionSettings.port}},
              {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
                multi: true
              },
              {
                provide: HTTP_INTERCEPTORS,
                useClass: HasherInterceptor,
                multi: true
              }
            ],
  bootstrap: [AppComponent],
})
export class AppModule { }
