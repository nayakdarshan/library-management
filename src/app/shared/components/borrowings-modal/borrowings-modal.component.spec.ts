import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowingsModalComponent } from './borrowings-modal.component';

describe('BorrowingsModalComponent', () => {
  let component: BorrowingsModalComponent;
  let fixture: ComponentFixture<BorrowingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowingsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
