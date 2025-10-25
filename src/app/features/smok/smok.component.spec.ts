import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmokComponent } from './smok.component';

describe('SmokComponent', () => {
  let component: SmokComponent;
  let fixture: ComponentFixture<SmokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmokComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
