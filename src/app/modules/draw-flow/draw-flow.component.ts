import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import Drawflow from 'drawflow';
import { TypeComponent, icon } from '../../shared/models/components/type-component.enum';
import { DrawComponent } from '../../shared/components/draw/draw.component';
import { Flow } from '../../shared/models/flow';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from '../../shared/providers/sharedData.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import moment from 'moment';


@Component({
  selector: 'app-draw-flow',
  templateUrl: './draw-flow.component.html',
  styleUrls: ['./draw-flow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawFlowComponent implements OnInit, AfterViewInit {
 
  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {  
  }  

}
