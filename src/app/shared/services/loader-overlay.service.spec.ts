import { TestBed } from '@angular/core/testing';

import { LoaderOverlayService } from './loader-overlay.service';

describe('LoaderOverlayService', () => {
  let service: LoaderOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
