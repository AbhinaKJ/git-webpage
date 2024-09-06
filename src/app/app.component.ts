import { Component, OnInit } from '@angular/core';
import initSqlJs, { SqlValue } from 'sql.js';
import * as SQL from 'sql.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'gitWebPage';

  private db: SQL.Database | undefined;
  values: SqlValue[][] = [];
  columns: string[] = [];
  public query: string = 'SELECT * FROM test';
  public errorMessage: string = '';

  async ngOnInit() {
    initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/${file}`
     }).then(SQL => {
      this.db = new SQL.Database();

      let sqlstr = "CREATE TABLE test (id int, name char); \
      INSERT INTO test VALUES (0, 'James'); \
      INSERT INTO test VALUES (1, 'Thomas');";
      this.db.run(sqlstr);

      this.loadData();

      // const binaryArray = this.db.export();
      // console.log('binaryArray:', binaryArray);
     })
  }

  loadData() {
    if (this.db) {
      // const results = this.db.exec('SELECT * FROM test');
      // console.log('result:', results);
      // const result = results[0];
      // const {columns, values } = result;
      // this.columns = columns;
      // this.values = values;
      try {
        const results = this.db.exec(this.query); // Use the entered query
        if (results.length > 0) {
          this.errorMessage = '';
          const result = results[0];
          const { columns, values } = result;
          this.columns = columns;
          this.values = values;
        } else {
          this.errorMessage = 'No data found';
          this.columns = [];
          this.values = [];
        }
      } catch (error) {
        this.columns = [];
        this.values = [];
        this.errorMessage = 'Invalid query or execution error';
        console.error('Query execution error:', error);
      }
    }
  }
}
