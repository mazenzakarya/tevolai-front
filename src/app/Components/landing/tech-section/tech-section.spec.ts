import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechSection } from './tech-section';

describe('TechSection', () => {
  let component: TechSection;
  let fixture: ComponentFixture<TechSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
