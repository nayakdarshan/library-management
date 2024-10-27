import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourBorrowingsComponent } from './your-borrowings.component';

describe('YourBorrowingsComponent', () => {
  let component: YourBorrowingsComponent;
  let fixture: ComponentFixture<YourBorrowingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourBorrowingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourBorrowingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
