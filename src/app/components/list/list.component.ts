import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { effect } from '@angular/core';

import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { Entry } from '../../services/api.types';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [FormsModule, TranslatePipe, CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  constructor() {
    effect(() => {
      const entry = this.current();
      if (entry) {
        const lang = entry.language === 'english' ? 'en' : 'de';
        this.translate.use(lang);
      }
    });
  }

  private translate = inject(TranslateService);
  private api = inject(ApiService);

  // reactive state
  protected hasLoaded = signal(false);
  protected queue = signal<Entry[]>([]);
  protected current = signal<Entry | null>(null);
  protected comment = signal('');

  // icons
  protected readonly faHashtag = '#';
  protected readonly faPen = '✎';
  protected readonly faAt = '@';

  ngOnInit(): void {
    this.translate.use('en');
    this.loadEntries();
  }

  // returns 'len-green' | 'len-yellow' | 'len-red'
  protected get lengthClass(): string {
    const len = this.current()?.phrase?.length ?? 0;
    if (len <= 200) return 'len-green';
    if (len <= 400) return 'len-yellow';
    return 'len-red';
  }

  protected updateLanguage(lang: 'english' | 'german') {
    const entry = this.current();
    if (entry) {
      this.current.set({ ...entry, language: lang });
    }
  }

  protected updateTags(tags: string) {
    const entry = this.current();
    if (entry) {
      this.current.set({ ...entry, tags });
    }
  }

  protected updatePhrase(phrase: string) {
    const entry = this.current();
    if (entry) {
      this.current.set({ ...entry, phrase });
    }
  }

  protected updateComment(comment: string) {
    const entry = this.current();
    if (entry) {
      this.current.set({ ...entry, comment });
    }
  }

  private loadEntries(): void {
    this.api
      .getNewEntries()
      .pipe(
        map((entries) =>
          entries
            .map((e) => ({
              id: e.id ?? 0,
              date: e.date ?? '',
              language: e.language ?? 'english',
              tags: e.tags ?? '',
              phrase: e.phrase ?? '',
              email: e.email,
              comment: e.comment ?? '',
            }))
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date)),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((sorted) => {
        this.queue.set(sorted);
        this.current.set(sorted[0] ?? null);
        this.hasLoaded.set(true);
      });
  }

  protected approve(): void {
    const entry = this.current();
    if (!entry) return;
    this.approveOrDiscardNewEntry({ ...entry, isApproved: true }).subscribe(() => this.nextEntry());
  }

  protected discard(): void {
    const entry = this.current();
    if (!entry) return;
    this.approveOrDiscardNewEntry({ ...entry, isApproved: false }).subscribe(() =>
      this.nextEntry(),
    );
  }

  protected get hasEmail(): boolean {
    return !!this.current()?.email;
  }

  private nextEntry(): void {
    const updated = [...this.queue()];
    updated.shift();
    this.queue.set(updated);
    this.current.set(updated[0] ?? null);
    this.comment.set('');
  }

  protected approveOrDiscardNewEntry(entry: Entry) {
    const res = this.api.approveOrDiscardNewEntry(entry);
    if (entry.language == 'english') {
      this.api.sendEmailEnglish(entry).subscribe();
    } else if (entry.language == 'german') {
      this.api.sendEmailGerman(entry).subscribe();
    }
    return res;
  }
}
