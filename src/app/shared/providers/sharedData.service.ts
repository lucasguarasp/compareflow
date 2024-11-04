import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Flow } from '../models/flow';
import Drawflow from 'drawflow';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private selectedItemSubject = new BehaviorSubject<any>(null);

  private flow: Flow;
  private compareFlow: Flow;

  private editor: Drawflow;

  private request = new EventEmitter<any>();
  private response = new BehaviorSubject<any>(null);
  // ou usar responseEmitter = new EventEmitter<any>(); // EventEmitter para emitir a resposta

  sidebarChatOpenEmitter = new EventEmitter<void>();

  isChatInitialized = false;
  private chatInitializedSubject = new Subject<void>();
  // Observable que o DrawComponent vai ouvir
  chatInitialized$ = this.chatInitializedSubject.asObservable();

  // private flowSubject = new Subject<Flow>();
  // flowEmitted$ = this.flowSubject.asObservable();

  constructor() { }

  getRequest() {
    return this.request;
  }

  setRequest(request: any) {
    return this.request.emit(request);
  }

  getResponseObservable() {
    return this.response.asObservable();
  }

  clearResponse() {
    this.response.next(null); // Reseta o BehaviorSubject para null
  }

  setResponseObservable(reponse: any) {
    this.response.next(reponse);
  }

  getSelectedItemObservable() {
    return this.selectedItemSubject.asObservable();
  }

  updateSelectedItem(item: any) {
    this.selectedItemSubject.next(item);
  }

  tryParseJSON(jsonString: string): any {
    try {
      const jsonStringCleaned = jsonString.replace(/\n/g, '').replace(/\s\s+/g, ' ');
      return JSON.parse(jsonStringCleaned);
    } catch (error) {
      return {};
    }
  }

  getKeyByValue(value: string, enumObject: any): string | null {
    const keys = Object.keys(enumObject).filter(key => enumObject[key] === value);
    return keys.length > 0 ? keys[0] : null;
  }

  // emitFlow(flow: Flow): void {
  //   this.flowSubject.next(flow);
  // }

  setFlow(flow: Flow): void {
    this.flow = flow;
  }

  setCompareFlow(flow: Flow): void {
    this.compareFlow = flow;
  }

  getFlow(): Flow {
    return this.flow;
  }

  getCompareFlow(): Flow {
    return this.compareFlow;
  }

  getEditor(): Drawflow {
    return this.editor;
  }

  setEditor(editor: Drawflow) {
    this.editor = editor;
  }

  toggleSidebar() {
    this.sidebarChatOpenEmitter.emit();
  }

  notifyChatInitialized() {
    this.isChatInitialized = true;
    this.chatInitializedSubject.next();
  }

  async addConnection(outputId: string, inputId: string) {
    await this.editor.addConnection(outputId, inputId, 'output_1', 'input_1')
  }

  async removeConnection(outputId: string, inputId: string) {
    await this.editor.removeSingleConnection(outputId, inputId, 'output_1', 'input_1')
  }


}
