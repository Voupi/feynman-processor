import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Quizzer } from './quizzer';

describe('Quizzer', () => {
  let component: Quizzer;
  let fixture: ComponentFixture<Quizzer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Quizzer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Quizzer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
