import { Injectable } from '@angular/core';
import initSqlJs, { SqlValue } from 'sql.js';
import * as SQL from 'sql.js';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: SQL.Database | undefined;


  constructor() { }

  initializeSqlite() {
    initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/${file}`
    }).then(SQL => {
      this.db = new SQL.Database();
      let tbCollection = "CREATE TABLE collection (id INTEGER PRIMARY KEY AUTOINCREMENT, \
        name char, description char, URL char, \
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), \
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), \
        categories TEXT, tags TEXT) ";
      this.db.run(tbCollection);

      let tbCategories = "CREATE TABLE categories (id INTEGER PRIMARY KEY AUTOINCREMENT, \
          category_name char, \
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), \
          updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))) ";
      this.db.run(tbCategories);

      let tbTags = "CREATE TABLE tags (id INTEGER PRIMARY KEY AUTOINCREMENT, \
        tags_name char, \
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), \
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))) ";
      this.db.run(tbTags);

      let insertCollection = `INSERT INTO collection (id, name, description, url, categories, tags, created_at, updated_at)
      VALUES 
      (1, 'Angular', 'A platform for building web applications.', 'https://angular.io', '["JavaScript", "SPA"]', '["Technology", "Framework", "Frontend"]', '2024-09-11', '2024-09-11'),
      (2, 'React', 'A JavaScript library for building UIs.', 'https://reactjs.org', '["JavaScript", "Library"]', '["Technology", "Frontend"]', '2024-09-11', '2024-09-11'),
      (3, 'Bootstrap', 'A popular CSS framework for responsive design.', 'https://getbootstrap.com', '["CSS", "UI"]', '["UI", "CSS", "Technology"]', '2024-09-11', '2024-09-11'),
      (4, 'Vue.js', 'A progressive framework for building UIs.', 'https://vuejs.org', '["JavaScript", "SPA"]', '["Technology", "Frontend"]', '2024-09-11', '2024-09-11'),
      (5, 'Vue.js', 'A progressive framework for building UIs.', 'https://vuejs.org', '["JavaScript", "SPA"]', '["Technology", "Frontend"]', '2024-09-11', '2024-09-11'),
      (6, 'Vue.js', 'A progressive framework for building UIs.', 'https://vuejs.org', '["JavaScript", "SPA"]', '["Technology", "Frontend"]', '2024-09-11', '2024-09-11');
      `;

      this.db.run(insertCollection);

      let insertCategories = `INSERT INTO categories (id, category_name, created_at, updated_at) VALUES 
      (1, 'JavaScript', '2024-09-11', '2024-09-11'),
      (2, 'SPA', '2024-09-11', '2024-09-11'),
      (3, 'Library', '2024-09-11', '2024-09-11'),
      (4, 'CSS', '2024-09-11', '2024-09-11'),
      (5, 'UI', '2024-09-11', '2024-09-11');`

      this.db.run(insertCategories);

      let insertTags = `INSERT INTO tags (id, tags_name, created_at, updated_at) VALUES 
      (1, 'Technology', '2024-09-11', '2024-09-11'),
      (2, 'Framework', '2024-09-11', '2024-09-11'),
      (3, 'Frontend', '2024-09-11', '2024-09-11'),
      (4, 'CSS', '2024-09-11', '2024-09-11'),
      (5, 'UI', '2024-09-11', '2024-09-11');`

      this.db.run(insertTags);
    })
  }

  async executeQuery(query: string) {
    const results = await this.db?.exec(query);
    return results;
  }
}
