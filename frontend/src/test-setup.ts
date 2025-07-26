import 'zone.js'; // required for Angular
import {
  TestBed,
  getTestBed
} from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

beforeEach(() => {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule
    ],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({}),
          queryParams: of({}),
          snapshot: { params: {}, data: {} }
        }
      }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  });
});
