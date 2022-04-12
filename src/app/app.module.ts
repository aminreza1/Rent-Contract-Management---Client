import { NgModule } from '@angular/core';

import {A11yModule} from '@angular/cdk/a11y';
import {CdkTableModule} from '@angular/cdk/table';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { 
  FormsModule, 
  ReactiveFormsModule 
} from '@angular/forms';

import { AuthGuard, AuthGuardReverse } from './infrastructure/services/auth-guard.service';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConfirmDialogComponent } from './infrastructure/shared-templates/confirm-dialog/confirm.dialog';
import { ProductComponent } from './product/product.component';
import { CreateProductComponent } from './product/create-product/create-product.component';
import { UpdateProductComponent } from './product/update-product/update-product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RentComponent, RentItemsDialogComponent } from './rent/rent.component';
import { AddRentComponent } from './rent/add-rent/add-rent.component';
import { UpdateRentComponent, ConfirmTerminateDialogComponent } from './rent/update-rent/update-rent.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { CustomerComponent } from './customer/customer.component';
import { CreateCustomerComponent } from './customer/create-customer/create-customer.component';
import { UpdateCustomerComponent } from './customer/update-customer/update-customer.component';
import { UserComponent } from './user/user.component';
import { CreateUserComponent } from './user/create-user/create-user.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { SettingComponent } from './setting/setting.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableResponsiveModule } from './infrastructure/directives/mat-table-responsive/mat-table-responsive.module';
import { SettingService } from './infrastructure/services/setting.service';
import { HttpService } from './infrastructure/services/http.service';
import { MatPaginatorIntlCro } from './infrastructure/custom-paginator';

import {NgxPersianModule} from 'ngx-persian';
import { DateLocale } from './infrastructure/pipes/dateLocale.pipe';

const appRoutes: Routes = [
  { path: '', component: DashboardComponent,canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent,canActivate: [AuthGuardReverse] },
  { path: 'signup', component: RegisterComponent,canActivate: [AuthGuardReverse] },

  { path: 'products', component: ProductComponent,canActivate: [AuthGuard] },
  { path: 'product/create', component: CreateProductComponent,canActivate: [AuthGuard] },
  { path: 'product/update/:id', component: UpdateProductComponent,canActivate: [AuthGuard] },

  { path: 'contracts/:customerQuery', component: RentComponent,canActivate: [AuthGuard] },
  { path: 'contract/add', component: AddRentComponent,canActivate: [AuthGuard] },
  { path: 'contract/update/:id', component: UpdateRentComponent,canActivate: [AuthGuard] },

  { path: 'customers', component: CustomerComponent,canActivate: [AuthGuard] },
  { path: 'customer/create', component: CreateCustomerComponent,canActivate: [AuthGuard] },
  { path: 'customer/update/:id', component: UpdateCustomerComponent,canActivate: [AuthGuard] },

  { path: 'users', component: UserComponent,canActivate: [AuthGuard] },
  { path: 'user/create', component: CreateUserComponent,canActivate: [AuthGuard] },
  { path: 'user/update/:userName', component: UpdateUserComponent,canActivate: [AuthGuard] },

  { path: 'settings', component: SettingComponent,canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' }
];

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    
    AppComponent,
    ConfirmDialogComponent,
    ProductComponent,
    RentComponent,
    DashboardComponent,
    CreateProductComponent,
    UpdateProductComponent,
    AddRentComponent,
    RentItemsDialogComponent,
    UpdateRentComponent,
    ConfirmTerminateDialogComponent,
    LoginComponent,
    RegisterComponent,
    CustomerComponent,
    CreateCustomerComponent,
    UpdateCustomerComponent,
    UserComponent,
    SettingComponent,
    CreateUserComponent,
    UpdateUserComponent,

    // Pipes
    DateLocale
  ],
  imports: [
    
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    
    A11yModule,
    CdkTableModule,
    
    NgxPersianModule,
    FlexLayoutModule,
    MatGridListModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatCardModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortModule,
    
    MatTableResponsiveModule,
   

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    SettingService,
    HttpService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro}],
  bootstrap: [AppComponent],
})
export class AppModule {}
