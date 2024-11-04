import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedDataService } from '../providers/sharedData.service';

export const drawGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {

  const sharedDataService: SharedDataService = inject(SharedDataService);
  return !sharedDataService.getFlow()
    ? inject(Router).createUrlTree(['/'])
    : true;
};



