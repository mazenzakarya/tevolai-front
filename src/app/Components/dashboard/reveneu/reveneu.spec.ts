import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reveneu } from './reveneu';

describe('Reveneu', () => {
  let component: Reveneu;
  let fixture: ComponentFixture<Reveneu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reveneu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reveneu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
