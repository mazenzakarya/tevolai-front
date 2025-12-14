import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstBriefSection } from './first-brief-section';

describe('FirstBriefSection', () => {
  let component: FirstBriefSection;
  let fixture: ComponentFixture<FirstBriefSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstBriefSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstBriefSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
