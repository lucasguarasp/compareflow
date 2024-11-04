import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MenuService } from '../../../shared/providers/menu.service';
import { SidebarItem } from '../../../shared/models/sidebarItem';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit, OnDestroy {

  menu: Array<SidebarItem>;
  sidebarItens: Observable<Array<SidebarItem>>;

  @Output() menuItem = new EventEmitter<string>();

  // @ViewChild('mainAside', { static: true }) mainAside: ElementRef<HTMLElement>;

  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private menuService: MenuService, private cdRef: ChangeDetectorRef) {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.getSidebarItens();
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.sidebarItens = navItems;
    // setTimeout(() => {
    //   // Inicialize o AdminLTE após o atraso    
    // }, 1000); // 1000 milissegundos = 1 segundo
    $('[data-widget="treeview"]').Treeview('init');

    if (!this.sidebarItens)
      this.getSidebarItens();
  }

  private async getSidebarItens() {
    this.menu = await this.menuService.getMainMenu();
    this.cdRef.detectChanges();

    this.activateMenuItemByRoute();
  }

  private activateMenuItemByRoute() {
    const currentRoute = this.router.url;

    this.menu.forEach(parent => {
      if (parent.rota === currentRoute) {
        parent.active = true;
      } else if (parent.children) {
        parent.children.forEach(child => {
          if (child.rota === currentRoute) {
            parent.active = true;
            child.active = true;
          } else {
            child.active = false;
          }
        });
      } else {
        parent.active = false;
      }
    });
  }

  isActive(item: SidebarItem): boolean {    
    if (item.children) {
      item.children.forEach(child => {
        if (child.active) {
          item.active = true;
        } else {
          item.active = false;
        }
      });
    }
    
    if (item.children) {
      item.children.forEach(child => {
        if (this.router.url === child.rota) {
          child.active = true;
          item.active = true;
        }
      });
    } else {
      if (this.router.url === item.rota)
        item.active = true;
      else
        item.active = false;
    }
    
    return item.active || false;
  }

  toggleItemMenu(item: SidebarItem) {
    this.menuItem.emit(item?.name);

    //const elements = document.querySelectorAll('.menu-is-opening, .menu-open');
    //elements.forEach(element => {
    //  element.classList.remove('menu-is-opening', 'menu-open');
    //});

  }

}