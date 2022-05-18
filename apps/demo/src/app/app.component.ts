import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Subject } from 'rxjs';

import { rxJSDevToolsTag } from '@rxjs-devtools/core';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  sub = new Subject<string>();

  sub$ = this.sub.asObservable().pipe(rxJSDevToolsTag('sub'));

  constructor(private readonly httpClient: HttpClient) {
    this.sub.subscribe();
  }

  next() {
    this.sub.next(`random: ${Math.floor(Math.random() * 9999) + 1}`);
  }

  subscribe() {
    this.httpClient
      .get('https://jsonplaceholder.typicode.com/posts')
      .pipe(rxJSDevToolsTag('posts'))
      .subscribe();
  }
}
