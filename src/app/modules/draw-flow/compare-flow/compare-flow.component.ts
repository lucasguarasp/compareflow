import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, output, ViewChild } from '@angular/core';
import { DrawComponent } from '../../../shared/components/draw/draw.component';
import Drawflow, { ConnectionEvent } from 'drawflow';
import { ComponentItem } from '../../../shared/models/components/component-item';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from '../../../shared/providers/sharedData.service';
import moment from 'moment';

@Component({
  selector: 'app-compare-flow',
  templateUrl: './compare-flow.component.html',
  styleUrls: ['./compare-flow.component.scss']
})
export class CompareFlowComponent implements OnInit, AfterViewInit {

  @ViewChild('drawflow1') drawflow1: DrawComponent;
  @ViewChild('drawflow2') drawflow2: DrawComponent;

  editor1: Drawflow;
  originalEditor1: Drawflow;
  flowName1: string = 'Flow 1 - before';

  editor2: Drawflow;
  originalEditor2: Drawflow;
  flowName2: string = 'Flow 2 - After';

  editorComparadoVisible: boolean = false;

  changes = {
    before: Array<any>(),
    after: Array<any>()
  };

  added = {
    before: Array<any>(),
    after: Array<any>()
  };

  removed = {
    before: Array<any>(),
    after: Array<any>()
  };

  flowId: string;
  compareFlowId: string;

  constructor(private route: ActivatedRoute, private cdref: ChangeDetectorRef) { }

  ngOnInit() {
    this.cdref.detectChanges();
  }

  ngAfterViewInit(): void {
    this.originalEditor1 = this.editor1;
    this.originalEditor2 = this.editor2;
  }

  editorEmitted(editor: Drawflow) {
    this.editor1 = editor
  }

  editorEmitted2(editor: Drawflow) {
    this.editor2 = editor
  }

  setflowName1(name: string) {
    this.flowName1 = name;
    this.cdref.detectChanges();
  }

  setflowName2(name: string) {
    this.flowName2 = name;
    this.cdref.detectChanges();
  }

  private resetChanges() {
    this.changes = {
      before: [],
      after: []
    };

    this.added = {
      before: [],
      after: []
    };

    this.removed = {
      before: [],
      after: []
    };
  }

  compareFlow() {
    this.resetChanges();

    this.editor1 = this.originalEditor1;
    this.editor2 = this.originalEditor2;

    this.editorComparadoVisible = true;

    const nodes1 = this.editor1.drawflow.drawflow.Home.data;
    const nodes2 = this.editor2.drawflow.drawflow.Home.data;

    const nodes1Keys = Object.keys(nodes1);
    const nodes2Keys = Object.keys(nodes2);

    const commonNodes = nodes1Keys.filter(key => nodes2Keys.includes(key));

    //inclusao ou remoção
    const uniqueNodes1 = nodes1Keys.filter(key => !nodes2Keys.includes(key));
    const uniqueNodes2 = nodes2Keys.filter(key => !nodes1Keys.includes(key));

    console.log('Nodos comuns:', JSON.stringify(commonNodes));
    console.log('Nodos únicos no editor1:', JSON.stringify(uniqueNodes1));
    console.log('Nodos únicos no editor2:', JSON.stringify(uniqueNodes2));

    // Adiciona os nós comuns ao editorComparado
    for (const key of commonNodes) {
      const node = nodes1[key] as unknown as ComponentItem;
      const correspondingNodeInNodes2 = nodes2[key] as unknown as ComponentItem;

      this.identifyCommonNodesChanges(node, correspondingNodeInNodes2);

    }

    // Adiciona os nós únicos do editor1 ao editorComparado
    for (const key of uniqueNodes1) {
      const node = nodes1[key] as unknown as ComponentItem;

      this.updateHtmlNodeFromView(node, this.drawflow1, 'removido');

      this.removed.before.push({ name: node.name, node });
      this.removed.after.push({ name: node.name, node: null });
    }

    // Adiciona os nós únicos do editor2 ao editorComparado
    for (const key of uniqueNodes2) {
      const node = nodes2[key] as unknown as ComponentItem;

      this.updateHtmlNodeFromView(node, this.drawflow2, 'adicionado');

      this.added.before.push({ name: node.name, node: null });
      this.added.after.push({ name: node.name, node });
    }

  }

  private identifyCommonNodesChanges(node1: ComponentItem, node2: ComponentItem) {
    // Verifica as diferenças entre node1.data e node2.data
    const data1 = node1;
    const data2 = node2;

    let hasChanges = false;

    let result: { newObj: any, beforeObj: any }[] = this.compareObjects(data1, data2);

    if (result.length > 0) {

      result.forEach(result => {
        //this.buildNestedObject(beforeObjFinal, result.beforeObj);
        // this.buildNestedObject(newObjFinal, result.newObj);
        this.changes.before.push({ name: node1?.activity?.side_panel?.general?.activityName, activityId: node1?.activity?.side_panel?.general?.activityId, ...result.beforeObj });
        this.changes.after.push({ name: node2?.activity?.side_panel?.general?.activityName, activityId: node2?.activity?.side_panel?.general?.activityId, ...result.newObj });
      });
      this.updateHtmlNodeFromView(node2, this.drawflow2, 'alterado');
    }


    return hasChanges;
  }

  buildNestedObject(target: any, source: any) {
    for (let key in source) {
      const keys = key.split('.'); // Dividir a string concatenada pela chave
      let current = target;

      keys.forEach((part, index) => {
        // Cria o nível se não existir
        if (!current[part]) {
          current[part] = {};
        }

        if (index === keys.length - 1) {
          current[part] = source[key]; // No último nível, atribui o valor diretamente
        } else {
          current = current[part]; // Navega para o próximo nível do objeto
        }
      });
    }
  }


  compareObjects(obj1: any, obj2: any): any[] {
    const differences: any[] = [];

    const recurse = (o1: any, o2: any, path: string) => {
      for (const key in o1) {
        if (o1.hasOwnProperty(key)) {
          const currentPath = path ? `${path}.${key}` : key; // Mantém o caminho completo

          // Se a chave existe em ambos os objetos
          if (o2.hasOwnProperty(key)) {
            if (typeof o1[key] === 'object' && typeof o2[key] === 'object') {
              // Se ambos são objetos, continuar recursivamente
              recurse(o1[key], o2[key], currentPath);
            } else if (o1[key] !== o2[key]) {
              // Excluir alterações em pos_x ou pos_y
              if (key !== 'pos_x' && key !== 'pos_y') {
                // Se os valores são diferentes, adicionar ao array de diferenças
                differences.push({
                  newObj: { [currentPath]: o1[key] },
                  beforeObj: { [currentPath]: o2[key] }
                });
              }
            }
          } else {
            // Se a chave só existe no obj1, adicionar o valor novo
            differences.push({
              newObj: { [currentPath]: o1[key] },
              beforeObj: { [currentPath]: undefined }
            });
          }
        }
      }
    };

    recurse(obj1, obj2, '');

    return differences;
  }


  updateHtmlNodeFromView(node: ComponentItem, view: DrawComponent, type: 'adicionado' | 'removido' | 'alterado') {
    const element = view.editor.container.querySelector('#node-' + node.id);
    if (element) {
      const cardElement = element.querySelector('.card');
      if (cardElement) {
        cardElement.classList.add(type);
      } else {
        element.classList.add(type);
      }
    }
  }

  async getFlowName(editor: Drawflow): Promise<string> {
    if (!editor) return await Promise.resolve('');
    const flow = editor.drawflow.drawflow.Home.data as ComponentItem;
    return flow ? `${flow['flowName']}|${flow['status']}|v${flow['version']}|${this.utcToLocal(flow['updatedAt'])}` : '';
  }

  utcToLocal(date: string) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }

}
