/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SidebarsService } from './sidebars.service';

describe('Service: Sidebars', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SidebarsService]
    });
  });

  it('should ...', inject([SidebarsService], (service: SidebarsService) => {
    expect(service).toBeTruthy();
  }));
});
