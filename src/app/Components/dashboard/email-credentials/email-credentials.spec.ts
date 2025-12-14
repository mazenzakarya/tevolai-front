import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailCredentials } from './email-credentials';

describe('EmailCredentials', () => {
  let component: EmailCredentials;
  let fixture: ComponentFixture<EmailCredentials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailCredentials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailCredentials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
