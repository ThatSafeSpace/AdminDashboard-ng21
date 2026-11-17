import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { ListComponent } from './list.component';
import { ApiService } from '../../services/api.service';
import { Entry } from '../../services/api.types';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'translate', standalone: true })
class StubTranslatePipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

// Mocks
class MockApiService {
  getNewEntries() {
    const dummy: Entry[] = [
      {
        id: 1,
        date: '2024-01-01',
        language: 'english',
        tags: 'test',
        phrase: 'hello',
        email: 'a@b.com',
        comment: ''
      }
    ];
    return of(dummy);
  }
  approveOrDiscardNewEntry(entry: Entry) { return of({ success: true }); }
  sendEmailEnglish(entry: Entry) { return of({ sent: true }); }
  sendEmailGerman(entry: Entry) { return of({ sent: true }); }
}

class MockTranslateService {
  use(_lang: string) {}
  // Methods required by TranslatePipe in Angular 21
  translate(key: string | any, interpolateParams?: any) { return key; }
  instant(key: string | any, interpolateParams?: any) { return key; }
  cachedSignal(key: string | any) { return () => key; }
}

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let api: ApiService;

  beforeEach(async () => {
    TestBed.overrideComponent(ListComponent, {
      set: {
        imports: [FormsModule, CommonModule, StubTranslatePipe] // include stub pipe
      }
    });

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        { provide: ApiService, useClass: MockApiService },
        { provide: TranslateService, useClass: MockTranslateService }
      ],
      // declarations: [StubTranslatePipe], // removed
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(ApiService);
    fixture.detectChanges(); // triggers ngOnInit and loadEntries
  });

  it('should create and load entries', () => {
    expect(component).toBeTruthy();
    const compAny = component as any;
    expect(compAny.queue().length).toBe(1);
    expect(compAny.current()?.id).toBe(1);
    expect(compAny.hasLoaded()).toBe(true);
  });

  it('stub translate pipe returns input', () => {
    const pipe = new StubTranslatePipe();
    const result = pipe.transform('test-key');
    expect(result).toBe('test-key');
  });

  it('should approve entry', () => {
    const compAny = component as any;
    expect(compAny.queue().length).toBe(1);
    (component as any).approve();
    expect(compAny.queue().length).toBe(0);
    expect(compAny.current()).toBeNull();
  });
});
