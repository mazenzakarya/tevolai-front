import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesOnMain } from './services-on-main';

describe('ServicesOnMain', () => {
  let component: ServicesOnMain;
  let fixture: ComponentFixture<ServicesOnMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesOnMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesOnMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
