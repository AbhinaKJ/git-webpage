import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './services/database.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'gitWebPage';
  

  constructor(private databaseService: DatabaseService) {
    this.databaseService.initializeSqlite();
  }

  async ngOnInit() {
    
  }


}
