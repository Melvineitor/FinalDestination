import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroVentaComponent } from './registro-venta.component';

describe('RegistroVentaComponent', () => {
  let component: RegistroVentaComponent;
  let fixture: ComponentFixture<RegistroVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroVentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
