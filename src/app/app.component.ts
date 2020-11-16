import { Component } from '@angular/core';
import { DictionaryService } from './services/dictionary.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'micronutrient-support-tool';

  constructor(
    dictionaryService: DictionaryService,
  ) {
    
  }
}

// comment with treally long long long line to test linting in action error comment with treally long long long line to test linting in action error comment with treally long long long line to test linting in action errordddddddddddddd
