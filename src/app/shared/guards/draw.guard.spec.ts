import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { drawGuard } from './draw.guard';

describe('drawGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => drawGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
