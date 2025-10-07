import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeComponent } from './theme.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,SharedModule,
    ThemeComponent
  ],
  declarations: [],
  exports:[
    ThemeComponent
  ]

})

export class ThemeModule { }
