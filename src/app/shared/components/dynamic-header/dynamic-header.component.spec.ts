import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicHeaderComponent } from './dynamic-header.component';

describe('DynamicHeaderComponent', () => {
  let component: DynamicHeaderComponent;
  let fixture: ComponentFixture<DynamicHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
