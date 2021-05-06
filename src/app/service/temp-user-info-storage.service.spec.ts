import { TestBed } from '@angular/core/testing';

import { TempUserInfoStorageService } from './temp-user-info-storage.service';

describe('TempUserInfoStorageService', () => {
  let service: TempUserInfoStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TempUserInfoStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
