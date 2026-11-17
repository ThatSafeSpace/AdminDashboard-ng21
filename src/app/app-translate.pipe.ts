import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'translate', standalone: true })
export class AppTranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}
  transform(key: any, params?: any): any {
    // Use the real TranslateService instant method for production.
    // This keeps translations functional while allowing us to stub it in tests.
    return this.translate.instant(key, params);
  }
}
