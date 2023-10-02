import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlapComponent } from './olap.component';

describe('OlapComponent', () => {
  let component: OlapComponent;
  let fixture: ComponentFixture<OlapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OlapComponent]
    });
    fixture = TestBed.createComponent(OlapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
