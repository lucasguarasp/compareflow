import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawFlowComponent } from './draw-flow.component';
import { SharedModule } from '../../shared/shared.module';
import { CompareFlowComponent } from './compare-flow/compare-flow.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [DrawFlowComponent, CompareFlowComponent]
})
export class DrawFlowModule { }
