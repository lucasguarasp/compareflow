import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-dynamic-header',
  templateUrl: './dynamic-header.component.html',
  styleUrl: './dynamic-header.component.scss'
})
export class DynamicHeaderComponent implements OnInit {

  @Input() routeData: { title: string; breadcrumb: string[] };

  title: string = '';
  // breadcrumb: string[] = [];
  breadcrumbs: Array<{ label: string, url: string }> = [];


  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    // Observe the changes in route data for the current route
    this.activatedRoute.data.subscribe(data => {      
      this.title = data['title'];
      this.breadcrumbs = [{ label: 'Home', url: '/' }, ...this.buildBreadcrumbs(this.activatedRoute)];
      // this.breadcrumbs = [...data['breadcrumb']];      
    });

    // Observe navigation events to update breadcrumbs dynamically
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.buildBreadcrumbs(this.activatedRoute.root))
    ).subscribe(breadcrumbs => {
      this.breadcrumbs = [...breadcrumbs];
      this.title = this.breadcrumbs[this.breadcrumbs.length - 1]?.label;
    });
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Array<{ label: string, url: string }> = []): Array<{ label: string, url: string }> {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      if (child.snapshot.data['breadcrumb']) {
        breadcrumbs.push({
          label: child.snapshot.data['breadcrumb'],
          url: url
        });
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

}


