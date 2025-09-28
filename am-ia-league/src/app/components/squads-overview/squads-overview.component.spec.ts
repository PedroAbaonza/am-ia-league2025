import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadsOverviewComponent } from './squads-overview.component';

describe('SquadsOverviewComponent', () => {
  let component: SquadsOverviewComponent;
  let fixture: ComponentFixture<SquadsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SquadsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SquadsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
