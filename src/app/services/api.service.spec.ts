import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { Entry } from './api.types';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const dummyEntries: Entry[] = [
    {
      id: 1,
      date: '2024-01-01',
      language: 'english',
      tags: 'test',
      phrase: 'hello',
      email: 'a@b.com',
      comment: ''
    },
    {
      id: 2,
      date: '2024-01-02',
      language: 'german',
      tags: '',
      phrase: 'hallo',
      email: '',
      comment: ''
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve new entries', () => {
    service.getNewEntries().subscribe(entries => {
      expect(entries.length).toBe(2);
      expect(entries).toEqual(dummyEntries);
    });
    const req = httpMock.expectOne(`${environment.apiBase}/backend/api/admin/getNewEntries.php`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyEntries);
  });

  it('should approve an entry', () => {
    const entry = dummyEntries[0];
    service.approveOrDiscardNewEntry(entry).subscribe(res => {
      expect(res).toEqual({ success: true });
    });
    const req = httpMock.expectOne(`${environment.apiBase}/backend/api/admin/approveOrDiscardNewEntry.php`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(entry);
    req.flush({ success: true });
  });

  it('should send English email', () => {
    const entry = dummyEntries[0];
    service.sendEmailEnglish(entry).subscribe(res => {
      expect(res).toEqual({ sent: true });
    });
    const req = httpMock.expectOne(`${environment.apiBase}/backend/api/admin/emailer/sendEmailEnglish.php`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(entry);
    req.flush({ sent: true });
  });

  it('should send German email', () => {
    const entry = dummyEntries[1];
    service.sendEmailGerman(entry).subscribe(res => {
      expect(res).toEqual({ sent: true });
    });
    const req = httpMock.expectOne(`${environment.apiBase}/backend/api/admin/emailer/sendEmailGerman.php`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(entry);
    req.flush({ sent: true });
  });
});

