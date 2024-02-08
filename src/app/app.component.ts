import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Welcome to {{title}}!</h1>


    <router-outlet></router-outlet>
  `,
  styles: ['h1 { opacity: 0; } h1 {z-index: -1}'],
})
export class AppComponent {
  title = 'FakeStore';
}
