import { Injectable } from '@angular/core';
import { ComponentItem } from '../models/components/component-item';
import { SharedDataService } from './sharedData.service';
import { Flow } from '../models/flow';

@Injectable({
  providedIn: 'root'
})
export class FlowService {

  activities: { [key: string]: ComponentItem };

  currentFlow: any;
  currentFlowName: string;
  currentactivity: ComponentItem;

  // Declara resultados de cada atividade

  constructor(private sharedDataService: SharedDataService) { }  
 
  async onExport(flow: Flow) {
    // const exportFlow = new Flow(flow.flowName, flow.draw, flow.id, flow.version, flow.tenants, flow.description, flow.status);
    const dataUri = await 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(flow, null, 4));

    let dateTime = new Date()
    const fileName = `${flow.id}-${flow.version}`;
    // const fileName = `${flow.id}-${dateTime.toLocaleDateString()}`;

    const linkElement = await document.createElement('a');
    await linkElement.setAttribute('href', dataUri);
    await linkElement.setAttribute('download', fileName + '.json');
    await linkElement.click();
  }

}
