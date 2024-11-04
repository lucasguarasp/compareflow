import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataFilterService } from './providers/data-filter.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlowService } from './providers/flow.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { TypeComponentOrderPipe } from './pipes/typeComponentOrder.pipe';
import { ThemeService } from './providers/theme.service';
import { DrawComponent } from './components/draw/draw.component';
import { MenuService } from './providers/menu.service';
import { DynamicHeaderComponent } from './components/dynamic-header/dynamic-header.component';
import { NgSelect2Module } from 'ng-select2';
import { UtcToLocalPipe } from './pipes/utcToLocal.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    HttpClientModule,
    NgSelect2Module,
    DragDropModule
  ],
  declarations: [UtcToLocalPipe,  DrawComponent, DynamicHeaderComponent],
  // providers: [DataFilterService, ApiService, FlowService, HandlebarsService],
  exports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule,
    NgSelectModule, MonacoEditorModule, DrawComponent, 
    DynamicHeaderComponent, NgSelect2Module, UtcToLocalPipe, DragDropModule]
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: [
        { provide: HTTP_INTERCEPTORS, multi: true },
        DataFilterService,        
        FlowService,
        HttpClientModule,
        TypeComponentOrderPipe,
        ThemeService,
        MenuService                
      ]
    }
  }
}
