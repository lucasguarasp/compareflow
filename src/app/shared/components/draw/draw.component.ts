import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation, AfterViewInit } from '@angular/core';
import Drawflow, { ConnectionEvent, MousePositionEvent } from 'drawflow';
import { TypeComponent, icon } from '../../models/components/type-component.enum';
import { ComponentItem } from '../../models/components/component-item';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedDataService } from '../../providers/sharedData.service';
import { ToastrService } from 'ngx-toastr';
import { Flow } from '../../models/flow';
import { FlowService } from '../../providers/flow.service';
import { NodeDefaultImport } from '../../models/components/nodeDefaultImport';


@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrl: './draw.component.scss'
})
export class DrawComponent implements OnInit {

  @Input() locked: boolean;

  @Input() drawId: string | '';

  @Input() editor: Drawflow;
  @Output() editorEmitter = new EventEmitter<Drawflow>();
  @Output() flowName = new EventEmitter<string>();

  editDivHtml: HTMLElement;
  editButtonShown: boolean = false;

  contextMenuDivHtml: HTMLElement;
  contextMenuShow: boolean = false;

  nodeModal: ElementRef;

  nodesSelected: any[] = [];
  selectedNodeId: string;
  selectedNode: any = {};

  mobile_item_selec: string;
  mobile_last_move: TouchEvent | null;

  getIconClass(type: TypeComponent): string {
    return icon.get(type) || 'fa fa-pencil'; // Pode definir uma classe padrão se não houver correspondência
  }

  constructor(private modalService: NgbModal, private sharedDataService: SharedDataService, private toastr: ToastrService, private flowService: FlowService) {
    this.setItemObservable();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initDrawingBoard();
    this.editor.editor_mode = this.locked != null && this.locked ? 'fixed' : 'edit';
  }

  private initDrawingBoard() {
    this.initDrawFlow();
    // if (!this.locked) {
    this.addEditorEvents();
    this.dragEvent();
    // }
  }

  private initDrawFlow(): void {
    if (typeof document !== 'undefined') {

      let drawFlowHtmlElement = null;

      if (this.drawId) drawFlowHtmlElement = document.querySelector(`#drawflow.${this.drawId}`);
      else drawFlowHtmlElement = document.querySelector(`#drawflow`);
      // const drawFlowHtmlElement = document.querySelectorAll('.drawflow'); 

      if (!this.editor) {
        this.editor = new Drawflow(drawFlowHtmlElement as HTMLElement);

        // this.editor.reroute = false;
        this.editor.curvature = 0.5;
        // this.editor.reroute_fix_curvature = false;
        // this.editor.reroute_curvature = 1;
        // this.editor.force_first_input = false;
        // this.editor.line_path = 1;
        this.editor.editor_mode = 'edit';
        this.editor.useuuid = true;

        this.editor.start();
        this.editor.zoom = 0.9;
        this.editor.zoom_out();

        this.editorEmitter.emit(this.editor);
      }
    }
  }

  private async addEditorEvents() {
    // Events!
    this.editor.on('nodeCreated', (id: number) => {
      console.log('Editor Event :>> Node created ' + id, this.editor.getNodeFromId(id));
    });

    this.editor.on('nodeRemoved', (id: number) => {
      console.log('Editor Event :>> Node removed ' + id);
    });

    this.editor.on('nodeSelected', (id: number) => {
      // console.log('Editor Event :>> Node selected ' + id, this.editor.getNodeFromId(id));
      // this.selectedNode = this.editor.drawflow.drawflow.Home.data[`${id}`];
      this.selectedNode = this.editor.ele_selected;
      // console.log('Editor Event :>> Node selected :>> this.selectedNode :>> ', this.selectedNode);
      // console.log('Editor Event :>> Node selected data :>> this.selectedNode :>> ', this.selectedNode.data);
    });

    this.editor.on('click', (e: any) => {
      // console.log('Editor Event :>> Click :>> ', e);      
      const altKey = e.altKey;
      if (altKey) {

      } else {
        if (e.target.closest('.drawflow_content_node') != null || e.target.classList[0] === 'drawflow-node') {
          if (e.target.closest('.drawflow_content_node') != null) {
            this.selectedNodeId = e.target.closest('.drawflow_content_node').parentElement.id;
          } else {
            this.selectedNodeId = e.target.id;
          }
          this.selectedNode = this.editor.drawflow.drawflow.Home.data[`${this.selectedNodeId.slice(5)}`];
        }

        if (e.target.closest('#editNode') != null || e.target.classList[0] === 'edit-node-button') {
          // Open modal with Selected Node   
          // this.open(this.nodeModal, this.selectedNodeId);
        }

        // const classesToHideContextMenu = ['drawflow', 'title-box', 'body-box', 'card-body'];
        // const hasClass = classesToHideContextMenu.some(className => e.target.classList.contains(className));
        // if (e.target.closest('#editNode') != null || hasClass) {
        //   this.hideContextMenu()
        // }

        // esconde context quando click for esquerdo     
        if ((e.button === 0 && e.target.offsetParent?.className != "context-menu") || e.target?.className === 'drawflow') {
          this.hideContextMenu()
        }

        if (e.target.closest('#editNode') === null) {
          // this.hideEditButton();          

        }

      }

    });

    this.editor.on('moduleCreated', (name: string) => {
      console.log('Editor Event :>> Module Created ' + name);
    });

    this.editor.on('moduleChanged', (name: string) => {
      console.log('Editor Event :>> Module Changed ' + name);
    });

    this.editor.on('connectionCreated', (connection: ConnectionEvent) => {
      document.getElementById(`node-${connection.input_id}`)?.getElementsByClassName(connection.input_class)[0]?.classList.add('inputConnected');

      this.buildDataConnection(connection, 'add');

      console.log('Editor Event :>> Connection created ', connection);
    });

    this.editor.on('connectionRemoved', (connection: ConnectionEvent) => {
      document.getElementById('node-' + connection.input_id)?.getElementsByClassName(connection.input_class)[0].classList.remove('inputConnected');

      this.buildDataConnection(connection, 'remove');

      console.log('Editor Event :>> Connection removed ', connection);
    });

    this.editor.on('contextmenu', (e: any) => {
      console.log('Editor Event :>> Context Menu :>> ', e);
      if (e.target.closest('.drawflow_content_node') != null || e.target.classList[0] === 'drawflow-node') {
        if (e.target.closest('.drawflow_content_node') != null) {
          this.selectedNodeId = e.target.closest('.drawflow_content_node').parentElement.id;
        } else {
          this.selectedNodeId = e.target.id;
        }
        this.selectedNode = this.selectNode(this.selectedNodeId);
        // this.showEditButton();        
        this.showContextMenu()
      }
    });

    this.editor.on('zoom', (zoom: any) => {
      console.log('Editor Event :>> Zoom level ' + zoom);
    });

    this.editor.on('addReroute', (id: number) => {
      console.log('Editor Event :>> Reroute added ' + id);
    });

    this.editor.on('removeReroute', (id: number) => {
      console.log('Editor Event :>> Reroute removed ' + id);
    });

    let last_x = 0;
    let last_y = 0;

    this.editor.on('mouseMove', (position: MousePositionEvent) => {
      // console.log('Editor Event :>> Position mouse x:' + position.x + ' y:' + position.y);
      if (this.editor.node_selected && this.editor.drag) {
        this.editor.node_selected.classList.add("selected");
        const nodeId = this.editor.node_selected.id.slice(5);
        const indexSelected = this.nodesSelected.indexOf(nodeId);
        if (indexSelected === -1) {
          this.nodesSelected.push(nodeId);
        }
        this.nodesSelected.forEach(eleN => {
          if (eleN != this.editor.node_selected?.id.slice(5)) {
            const node = document.getElementById(`node-${eleN}`)!;
            var xnew = (last_x - position.x) * this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom);
            var ynew = (last_y - position.y) * this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom);

            node.style.top = (node.offsetTop - ynew) + "px";
            node.style.left = (node.offsetLeft - xnew) + "px";

            this.editor.drawflow.drawflow[this.editor.module].data[eleN].pos_x = (node.offsetLeft - xnew);
            this.editor.drawflow.drawflow[this.editor.module].data[eleN].pos_y = (node.offsetTop - ynew);
            this.editor.updateConnectionNodes(`node-${eleN}`);
          }
        });
      }

      last_x = position.x;
      last_y = position.y;
    })

    this.editor.on('nodeMoved', (id: any) => {
      console.log('Editor Event :>> Node moved ' + id);
    });

    this.editor.on('translate', (position: MousePositionEvent) => {
      // console.log(
      //   'Editor Event :>> Translate x:' + position.x + ' y:' + position.y
      // );
    });

    // this.editor.on('dblclick', (e: any) => {
    //   console.log(
    //     'Editor Event :>> Translate dblclick'
    //   );
    // });


    this.editor.container.addEventListener('dblclick', (e: any) => {
      if (e.target.closest(".drawflow_content_node")?.parentElement) {
        // alert(e.target.closest(".drawflow_content_node").parentElement.id);
        this.sharedDataService.setEditor(this.editor);
        this.openModalConfig();
      }
    });

    this.editor.on("clickEnd", (e) => {
      const altKey = e.altKey;
      if (altKey) {
        if (this.editor.node_selected !== null) {
          const nodeId = this.editor.node_selected.id.slice(5);
          const indexSelected = this.nodesSelected.indexOf(nodeId);
          if (indexSelected === -1) {
            this.nodesSelected.push(nodeId);
          } else {
            this.nodesSelected.splice(indexSelected, 1);
            const nodeUnselected = document.getElementById(`node-${nodeId}`)!;
            nodeUnselected.classList.remove("selected");
          }
        } else {
          if (!altKey) {
            this.nodesSelected.forEach(eleN => {
              const node = document.getElementById(`node-${eleN}`)!;
              node.classList.remove("selected");
            });
            this.nodesSelected.splice(0, this.nodesSelected.length);
          }
        }
        this.nodesSelected.forEach(eleN => {
          const node = document.getElementById(`node-${eleN}`)!;
          node.classList.add("selected");
        });
      } else {
        this.nodesSelected.forEach(eleN => {
          const node = document.getElementById(`node-${eleN}`)!;
          node.classList.remove("selected");
        });
        this.nodesSelected.splice(0, this.nodesSelected.length);
      }
    });
  }

  private dragEvent() {
    var elements = Array.from(document.getElementsByClassName('drag-drawflow'));

    elements.forEach(element => {
      element.addEventListener('touchend', this.drop.bind(this), false);
      element.addEventListener('touchmove', this.positionMobile.bind(this), false);
      element.addEventListener('touchstart', this.drag.bind(this), false);
      // element.addEventListener("dblclick", (event) => { });
    });
  }

  private async selectNode(id: string) {
    return await this.editor.drawflow.drawflow.Home.data[`${id.slice(5)}`]
  }

  private showEditButton() {
    this.editButtonShown = true;
    this.editDivHtml = document.createElement('div');
    this.editDivHtml.id = 'editNode';
    this.editDivHtml.innerHTML = '<i class="fas fa-pen" aria-hidden="true"></i>';
    this.editDivHtml.className = 'edit-node-button';

    // já add no css
    // this.editDivHtml.style.display = 'block';
    // this.editDivHtml.style.position = 'absolute';
    // this.editDivHtml.style.right = '22px';
    // this.editDivHtml.style.top = '-15px';
    // this.editDivHtml.style.width = '30px';
    // this.editDivHtml.style.height = '30px';
    // this.editDivHtml.style.borderRadius = '50%';
    // this.editDivHtml.style.textAlign = 'center';
    // this.editDivHtml.style.fontSize = 'x-small';
    // this.editDivHtml.style.border = '2px solid #4ea9ff';
    // this.editDivHtml.style.background = 'white';
    // this.editDivHtml.style.color = '#4ea9ff';
    // // this.editDivHtml.style.boxShadow = '0 2px 20px 2px #4ea9ff';
    // this.editDivHtml.style.lineHeight = '25px';

    const selectedNodeHtml = document.getElementById(this.selectedNodeId);
    selectedNodeHtml?.append(this.editDivHtml);
  }

  private showContextMenu() {
    this.hideContextMenu();

    this.contextMenuDivHtml = document.createElement('div');
    this.contextMenuDivHtml.id = 'contextMenu';
    this.contextMenuDivHtml.className = 'context-menu';
    this.contextMenuDivHtml.innerHTML = `   
      <div class="body-context">
        <button type="button" data-toggle="tooltip" class="btn btn-tool run-node" data-slide="true" role="button">
          <i class="fa fa-play"></i>
        </button>
        <button type="button" data-toggle="tooltip" class="btn btn-tool delete-node">
          <i class="fa fa-trash"></i>
        </button>
      </div>`;

    const selectedNodeHtml = document.getElementById(this.selectedNodeId);

    if (selectedNodeHtml) {
      selectedNodeHtml?.append(this.contextMenuDivHtml);

      // Adiciona o evento click ao botão após inserir o HTML
      const removeButton = this.contextMenuDivHtml.querySelector('.delete-node');
      const runButton = this.contextMenuDivHtml.querySelector('.run-node');

      if (removeButton) {
        removeButton.addEventListener('click', () => {

        });
      }

      if (runButton) {
        runButton.addEventListener('click', () => {

        });
      }

      // Remover a classe 'hidden' para exibir o menu
      this.contextMenuDivHtml.classList.remove('hidden');
    } else {
      this.hideContextMenu();
    }
  }

  hideContextMenu() {
    // this.contextMenuShow = false;
    // this.contextMenuDivHtml = document.getElementById('contextMenu')!;
    // if (this.contextMenuDivHtml) {
    //   this.contextMenuDivHtml.remove();
    // }

    if (this.contextMenuDivHtml) {
      this.contextMenuDivHtml.remove();
      // this.contextMenuDivHtml.classList.add('hidden');
    }
  }


  waitForChatInitialization(): Promise<void> {
    return new Promise((resolve) => {
      if (this.sharedDataService.isChatInitialized) {
        resolve(); // Se já foi inicializado, resolve imediatamente
      } else {
        this.sharedDataService.chatInitialized$.subscribe(() => {
          resolve();
        });
      }
    });
  }

  private positionMobile(ev: any) {
    this.mobile_last_move = ev;
  }

  drag(ev: any) {
    if (ev.type === "touchstart") {
      this.mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
    } else {
      ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
    }
  }

  drop(ev: any) {
    if (ev.type === "touchend" && this.mobile_last_move) {
      var parentdrawflow = document.elementFromPoint(this.mobile_last_move.touches[0].clientX, this.mobile_last_move.touches[0].clientY)?.closest("#drawflow");
      if (parentdrawflow != null) {
        this.addNodeToDrawFlow(this.mobile_item_selec, this.mobile_last_move.touches[0].clientX, this.mobile_last_move.touches[0].clientY);
      }
      this.mobile_item_selec = '';

    } else {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("node");
      this.addNodeToDrawFlow(data, ev.clientX, ev.clientY);
    }
  }

  private addNodeToDrawFlow(name: string, pos_x: number, pos_y: number): false | true {
    if (this.editor.editor_mode === 'fixed' || !name) {
      return false;
    }

    pos_x = pos_x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)));
    pos_y = pos_y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)));

    var keyFromName = this.sharedDataService.getKeyByValue(name, TypeComponent)?.toString();
    let html = '';

    // this.editor.addNode(name, inputs, outputs, posx, posy, class, data, html);
    switch (name) {
      case TypeComponent.StartFlow:
      case TypeComponent.SubFlow:
        html = `<div class="title-box"><i class="${this.getIconClass(name as TypeComponent)}"></i> <span>${keyFromName}</span></div>`;
        this.editor.addNode(name, 0, 1, pos_x, pos_y, name, {}, html, false);
        break;
      case TypeComponent.EndFlow:
      case TypeComponent.BackToParent:
        html = `<div class="title-box"><i class="${this.getIconClass(name as TypeComponent)}"></i> <span>${keyFromName}</span></div>`;
        this.editor.addNode(name, 1, 0, pos_x, pos_y, name, {}, html, false);
        break;
      case TypeComponent.SendMessage:
        html = `<div class="title-box"><i class="${this.getIconClass(name as TypeComponent)}"></i> <span>${keyFromName}</span></div>`;
        this.editor.addNode(name, 1, 1, pos_x, pos_y, name, {}, html, false);
        break;
      // case TypeComponent.Request:
      //   html = `<div class="title-box"><i class="${this.getIconClass(name as TypeComponent)}"></i> <span>${keyFromName}</span></div>`;
      //   this.editor.addNode(name, 1, 1, pos_x, pos_y, name, {}, html, false);
      //   break;
      // case TypeComponent.Anotation:
      //   html = `<div class="title-box"><i class="${this.getIconClass(name as TypeComponent)}"></i> <span>${keyFromName}</span></div>`;
      //   this.editor.addNode(name, 0, 0, pos_x, pos_y, name, {}, html, false);
      //   break;
      default:
        if (name) {
          html = `<div class="title-box"><i class="${this.getIconClass(name as TypeComponent)}"></i> <span>${keyFromName}</span></div>`;
          this.editor.addNode(name, 1, 1, pos_x, pos_y, name, {}, html, false);
        }
    }

    return true;
  }

  allowDrop(ev: any) {
    ev.preventDefault();
  }

  open(content: any, nodeId: string) {
    this.hideEditButton();
    // const { inputsCount, outputsCount } = this.countInOutputsOfNode(JSON.parse(oldNodeStringified));

    this.openModalConfig()
    // const modalRef = this.modalService.open(content, { size: 'xl', backdrop: 'static', keyboard: false });
  }

  private hideEditButton() {
    this.editButtonShown = false;
    this.editDivHtml = document.getElementById('editNode')!;
    if (this.editDivHtml) {
      this.editDivHtml.remove();
    }
  }

  private openModalConfig() {
  }

  private async updateNameComponentHtml(typeComponentSelected: string, itemChanged: ComponentItem) {
    const elements = document.getElementsByClassName('drawflow-node ' + typeComponentSelected + ' selected');
    if (elements.length > 0) {
      const divElement = elements[0] as HTMLElement;
      // const spanElement = divElement.querySelector('span');

      const itemHtml = divElement.querySelector('.drawflow_content_node');
      let divCard = divElement.querySelector('.card.card-outline');
      if (itemHtml) {
        if (!divCard) {
          divCard = document.createElement('div');
          divCard.classList.add('card');
          divCard.classList.add('card-outline');
          divCard.classList.add(await this.buildTypeHtmlCard(typeComponentSelected));
          itemHtml.appendChild(divCard);
        }

        const titleBox = itemHtml.querySelector('.drawflow_content_node .title-box');
        if (titleBox && !titleBox.classList.contains('card-header')) {
          titleBox.classList.add('card-header');
          divCard.appendChild(titleBox);
        }

        const bodyBox = itemHtml.querySelector('.drawflow_content_node .body-box');
        if (!bodyBox) {
          const newBodyBox = document.createElement('div');
          newBodyBox.classList.add('body-box')
          newBodyBox.classList.add('card-body')
          newBodyBox.innerHTML = itemChanged.class != TypeComponent.Anotation ? itemChanged.name : itemChanged.data;
          divCard.appendChild(newBodyBox);
        } else {
          bodyBox.innerHTML = itemChanged.class != TypeComponent.Anotation ? itemChanged.name : itemChanged.data
        }
        // itemHtml.innerHTML = itemChanged.html;
        this.selectedNode.html = this.elementToString(itemHtml)
        await this.buildHtmlSelectedNode(this.selectedNode);
      }

      // if (spanElement) {
      //   spanElement.innerText = itemChanged.name;
      // }
    }
  }

  private async buildHtmlSelectedNode(itemSelected: ComponentItem) {
    const itemUpdated = this.editor.drawflow.drawflow.Home.data[`${itemSelected.id}`].html = itemSelected.html;
    return await itemUpdated;
  }

  private async buildTypeHtmlCard(typeComponentSelected: string): Promise<string> {
    switch (typeComponentSelected) {
      case TypeComponent.Anotation:
        return 'card-warning'
      case TypeComponent.Decision:
        return 'card-danger'
      case TypeComponent.CallApi:
        return 'card-success'
      case TypeComponent.Mapper:
      case TypeComponent.Filter:
        return 'card-secondary'
      case TypeComponent.Request:
      case TypeComponent.Response:
        return 'card-warning'
      case TypeComponent.GoToFlow:
      case TypeComponent.BackToParent:
        return 'card-dark'
      case TypeComponent.SendMessage:
        return 'card-light'
      default:
        return 'card-info'
      // return 'card-primary'
    }
  }

  private elementToString(element: Element): string {
    const children = Array.from(element.children);
    let childHTML = "";
    for (const child of children) {
      childHTML += child.outerHTML;
    }
    return childHTML;
  }

  private setItemObservable() {
    this.sharedDataService.getSelectedItemObservable().subscribe((item) => {
      if (this.selectedNodeId) {
        const id = this.selectedNodeId.slice(5);
        var teste = this.editor.drawflow.drawflow.Home.data[`${id}`];
        this.editor.drawflow.drawflow.Home.data[`${id}`] = item
      }
    });
  }

  async export() {
    // var nameModule = this.editor.changeModule('NovoNome');

    // this.editor.addModule('nameNewModule');
    // this.editor.changeModule('nameNewModule');
    // this.editor.removeModule('nameModule');
    // // Default Module is Home
    // this.editor.changeModule('Home');

    const drawFlow = await JSON.stringify(this.editor.export(), null, 4);

    let flow = new Flow('FlowNameTeste', drawFlow);

    const dataUri = await 'data:application/json;charset=utf-8,' + encodeURIComponent(flow.toJSON());

    let dateTime = new Date()
    const fileName = `${flow.id}-${flow.version}`;
    // const fileName = `${flow.id}-${dateTime.toLocaleDateString()}`;

    const linkElement = await document.createElement('a');
    await linkElement.setAttribute('href', dataUri);
    await linkElement.setAttribute('download', fileName + '.json');
    await linkElement.click();
  }

  triggerFileSelect() {
    const fileInput = this.drawId ? document.getElementById(`drawflowfile-${this.drawId}`) : document.getElementById('drawflowfile') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  async onSelectFile(event: Event) {
    let dataToImport: Flow = new Flow();
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        try {
          dataToImport = JSON.parse(await this.readFile(file));
        } catch (error) {
          dataToImport = await this.readFile(file);
        }

        const fileInput = this.drawId ? document.getElementById(`drawflowfile-${this.drawId}`) : document.getElementById('drawflowfile') as HTMLInputElement;
        if (fileInput) {
          (fileInput as HTMLInputElement).value = '';
        }
      }
    } else {
      console.log("No data selected");
    }

    try {
      //let draw = this.sharedDataService.tryParseJSON(dataToImport.desenho_estatico?.definicao_atividades || dataToImport.draw)
      //await this.editor.import(JSON.parse(dataToImport?.draw));
      let draw = dataToImport?.draw ? JSON.parse(dataToImport.draw) : NodeDefaultImport.varrerObjeto(dataToImport);

      await this.editor.import(draw);
      await this.buildArrowsConnections()
      this.toastr.success('successfully imported')
      this.flowName.emit(`${dataToImport?.definicao_atividade.flowName + "| v" + dataToImport?.definicao_atividade.flowVersionNumber}`);     
    } catch (error) {
      console.log(error);
      this.toastr.error('invalid json format');    
    }
  }

  private async readFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e: any) => {
        if (e.target.result) {
          return resolve(JSON.parse(e.target.result)); // Return parsed data
        } else {
          reject(new Error("Error reading file: No data found"));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  async buildArrowsConnections() {
    const editor = this.editor.drawflow.drawflow

    // var nodes = Array();
    // Object.keys(editor).map(function (moduleName, index) {
    //   for (var node in editor[moduleName].data) {
    //     if (editor[moduleName].data[node].inputs['input_1']?.connections.length > 0)
    //       nodes.push(editor[moduleName].data[node].id);
    //   }
    // });

    const nodes = await Object.entries(editor)
      .flatMap(([moduleName, moduleData]) =>
        Object.entries(moduleData.data)
          .filter(([nodeId, nodeData]) => nodeData.inputs['input_1']?.connections.length > 0)
          .map(([/* nodeId */, { id }]) => id)
      );

    await nodes.forEach(nodeId => {
      const inpNodes = document.getElementById(`node-${nodeId}`)?.getElementsByClassName('input_1')!;
      if (inpNodes?.length > 0) {
        inpNodes[0]?.classList.add('inputConnected');
      }
    });

    // for (var i in nodes) {
    //   var inpNodes = document.getElementById('node-' + nodes[i])?.getElementsByClassName('input_1')!
    //   if (inpNodes.length > 0) {
    //     inpNodes[0]?.classList.add('inputConnected');
    //   }
    // }
  }

  changeMode() {
    this.locked = !this.locked;
    this.editor.editor_mode = this.locked != null && this.locked == false ? 'edit' : 'fixed';
  }

  onZoomOut() {
    this.editor.zoom_out();
  }

  onZoomIn() {
    this.editor.zoom_in();
  }

  onZoomReset() {
    this.editor.zoom_reset();
  }

  async buildDataConnection(connection: ConnectionEvent, typeConnection: 'add' | 'remove') {
    let node = await this.editor.drawflow.drawflow.Home.data[`${connection.output_id}`]
    switch (node.class) {
      default:
        break;
    }
  }


}
