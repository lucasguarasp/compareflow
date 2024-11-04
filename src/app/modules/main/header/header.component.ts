import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../shared/providers/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isDark = false;

  constructor(private themeService: ThemeService, private router: Router) { }

  ngOnInit() {
  }

  onThemeSwitchChange() {
    document.body.classList.toggle('dark-mode'); // Class name for dark theme
    this.isDark = document.body.classList.contains('dark-mode');
    this.themeService.setTheme(this.isDark);
  } 

}
