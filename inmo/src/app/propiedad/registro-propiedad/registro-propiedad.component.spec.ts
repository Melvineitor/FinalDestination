import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPropiedadComponent } from './registro-propiedad.component';

describe('RegistroPropiedadComponent', () => {
  let component: RegistroPropiedadComponent;
  let fixture: ComponentFixture<RegistroPropiedadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroPropiedadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroPropiedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
