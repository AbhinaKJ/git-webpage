import { Component, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { SqlValue } from 'sql.js';
import { DatabaseService } from './services/database.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'gitWebPage';
  public query: string = 'SELECT * FROM tags';
  public errorMessage: string = '';
  values: SqlValue[][] = [];
  columns: string[] = [];
  // tags = [
  //   { id: 1, tags_name: ['Technology'] },
  //   { id: 2, tags_name: ['Framework'] },
  //   { id: 3, tags_name: ['Frontend'] },
  //   { id: 4, tags_name: ['UI', 'CSS'] }
  // ];
  // collections = [
  //   {
  //     id: 1,
  //     name: 'Angular',
  //     description: 'A platform for building web applications.',
  //     url: 'https://angular.io',
  //     categories: ['JavaScript', 'SPA'],
  //     tags: ['Technology', 'Framework', 'Frontend']
  //   },
  //   {
  //     id: 2,
  //     name: 'React',
  //     description: 'A JavaScript library for building UIs.',
  //     url: 'https://reactjs.org',
  //     categories: ['JavaScript', 'Library'],
  //     tags: ['Technology', 'Frontend']
  //   },
  //   {
  //     id: 3,
  //     name: 'Bootstrap',
  //     description: 'A popular CSS framework for responsive design.',
  //     url: 'https://getbootstrap.com',
  //     categories: ['CSS', 'UI'],
  //     tags: ['UI', 'CSS', 'Technology']
  //   },
  //   {
  //     id: 4,
  //     name: 'Vue.js',
  //     description: 'A progressive framework for building UIs.',
  //     url: 'https://vuejs.org',
  //     categories: ['JavaScript', 'SPA'],
  //     tags: ['Technology', 'Frontend']
  //   },
  //   {
  //     id: 5,
  //     name: 'Vue.js',
  //     description: 'A progressive framework for building UIs.',
  //     url: 'https://vuejs.org',
  //     categories: ['JavaScript', 'SPA'],
  //     tags: ['Technology', 'Frontend']
  //   },
  //   {
  //     id: 6,
  //     name: 'Vue.js',
  //     description: 'A progressive framework for building UIs.',
  //     url: 'https://vuejs.org',
  //     categories: ['JavaScript', 'SPA'],
  //     tags: ['Technology', 'Frontend']
  //   }
  // ];

  selectedTag: any = 'Technology';
  tags: any[] = [];
  collections: any[] = [];
  searchControl: FormControl = new FormControl();

  constructor(private databaseService: DatabaseService) {
    this.databaseService.initializeSqlite();
  }

  async ngOnInit() {
    setTimeout(() => {
      this.loadTags();
    }, 1000);
    this.searchControl.valueChanges
    .pipe(debounceTime(300)) // To prevent querying too often
    .subscribe(tag => {
      this.searchTag(tag);
    });
  }

  async loadTags() {
    const query = 'SELECT * FROM tags';
    this.databaseService.executeQuery(query).then(res => {
      console.log('tags**', res);
      if (res && res.length > 0) {
        this.tags = res[0].values.map((row: any) => ({
          id: row[0],
          tagName: row[1],
        }));

        if (this.tags.length > 0) {
          let firstTag = this.tags[0].tagName[0];
          const query = `SELECT * FROM collection WHERE tags LIKE '%${firstTag}%'`;
          this.databaseService.executeQuery(query).then(results => {
            console.log('collections**', results);
            if (results && results.length > 0) {
              this.collections = results[0].values.map((row: any) => ({
                id: row[0],
                name: row[1],
                description: row[2],
                url: row[3],
                categories: row[4],
                tags: row[5],
              }));
            }
          });
        }
      }
    });
  }

  async setActiveTag(tagName: string) {
    this.selectedTag = tagName;

    // Query to select collections that have the selected tag
    const query = `SELECT * FROM collection WHERE tags LIKE '%${tagName}%'`;
    this.databaseService.executeQuery(query).then(results => {
      console.log('collection**', results);
      if (results && results.length > 0) {
        this.collections = results[0].values.map((row: any) => ({
          id: row[0],
          name: row[1],
          description: row[2],
          url: row[3],
          categories: row[4],
          tags: row[5],
        }));
      } else {
        this.collections = [];
      }
    });
  }

  searchTag(tagInput: string) {
    if (!tagInput) {
      this.collections = [];
      return;
    }

    // Convert the input to lowercase
    const tagName = tagInput.toLowerCase();

    // Find a matching tag from the tags array, ignoring case
    const matchedTag = this.tags.find(tag => tag.tagName.toLowerCase() === tagName);

    if (matchedTag) {
      // Call the setActiveTag function with the matched tag
      this.setActiveTag(matchedTag.tagName);
    } else {
      // If no match is found, clear collections
      this.collections = [];
    }
  }

  getFilteredCollections() {
    if (!this.selectedTag) return [];
    return this.collections.filter(item => item.tags.includes(this.selectedTag));
  }
}
