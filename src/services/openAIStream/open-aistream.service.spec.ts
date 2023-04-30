import { TestBed } from '@angular/core/testing';

import { OpenAIStreamService } from './open-aistream.service';

describe('OpenAIStreamService', () => {
  let service: OpenAIStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenAIStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
