import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ThemeService } from '../../shared/providers/theme.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from '../../shared/providers/sharedData.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {

  messages: any[] = [];
  newMessage: string = '';

  appLoaded: boolean = false;

  sidebarChatOpen = false;

  private subscriptions: Subscription[] = [];
  constructor(private themeService: ThemeService, private modalService: NgbModal, private cdRef: ChangeDetectorRef,
    private router: Router, private activatedRoute: ActivatedRoute, private sharedDataService: SharedDataService, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.themeService.applyTheme();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    this.appLoaded = true;
    this.cdRef.detectChanges();

    // Log para verificar se o elemento está presente
    this.sharedDataService.sidebarChatOpenEmitter.subscribe(() => {
      this.onToggleSidebar();
    });
  }

  toggleMenuItem(menuName: string) {
    switch (menuName) {
      case 'Creat New':
        this.openModalCreatOrEdit();
        break;
      default:
        break;
    }
  }

  async openModalCreatOrEdit() {
  
  }


  sendMessage() {
    // Lógica para enviar a mensagem e adicioná-la ao array de mensagens
    this.messages.push({
      message: this.newMessage,
      sent: true
    });
    this.newMessage = '';
  }

  onToggleSidebar() {
    const sidebar = document.querySelector('.control-sidebar');
    if (sidebar && !sidebar.classList.contains('control-sidebar-open')) {
      // Adiciona a classe para abrir o control-sidebar
      sidebar.classList.add('control-sidebar-open');
      this.sidebarChatOpen = !this.sidebarChatOpen;
    }
  }

  onChatInitialized() {
    // Notifica o serviço que o chat foi inicializado
    this.sharedDataService.notifyChatInitialized();
  }

  closeChat() {
    this.sidebarChatOpen = false;
    const sidebar = document.querySelector('.control-sidebar');
    if (sidebar && sidebar.classList.contains('control-sidebar-open')) {
      // Remove a classe para fechar o control-sidebar
      sidebar.classList.remove('control-sidebar-open');      
      this.sharedDataService.isChatInitialized = false;
    }
  }


}
