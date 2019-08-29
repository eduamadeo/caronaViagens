import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTripsPage } from './mytrips.page';

describe('MyTripsPage', () => {
  let component: MyTripsPage;
  let fixture: ComponentFixture<MyTripsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTripsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTripsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
