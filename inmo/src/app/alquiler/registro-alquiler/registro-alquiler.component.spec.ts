import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAlquilerComponent } from './registro-alquiler.component';

describe('RegistroAlquilerComponent', () => {
  let component: RegistroAlquilerComponent;
  let fixture: ComponentFixture<RegistroAlquilerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroAlquilerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroAlquilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
