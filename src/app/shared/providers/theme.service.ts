import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly THEME_KEY = 'iuconverse:theme';

  constructor() { }

  setTheme(isDarkMode: boolean): void {
    localStorage.setItem(this.THEME_KEY, isDarkMode ? 'dark' : 'light');
  }

  getTheme(): 'dark' | 'light' {
    let theme = localStorage.getItem(this.THEME_KEY) as 'dark' | 'light' || 'light';    
    return theme;
  }


  applyTheme(): void {
    const theme = this.getTheme();
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

}
