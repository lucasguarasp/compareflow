import { Injectable } from '@angular/core';
import { Badge, SidebarItem } from '../models/sidebarItem';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() { }

  public getMainMenu(): Array<SidebarItem> {
    let menu = new Array<SidebarItem>();

    menu.push(new SidebarItem('Compare Flows', 'nav-icon fas fa-exchange-alt', '/compare'));

    return menu;
  }
}
