import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyIthappenComponent } from './why-ithappen.component';

describe('WhyIthappenComponent', () => {
  let component: WhyIthappenComponent;
  let fixture: ComponentFixture<WhyIthappenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyIthappenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyIthappenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
