import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageExampleComponent } from './image-example.component';

describe('ImageExampleComponent', () => {
  let component: ImageExampleComponent;
  let fixture: ComponentFixture<ImageExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
