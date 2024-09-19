import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { SqlValue } from 'sql.js';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {
  category: string | undefined;
  public query: string = 'SELECT * FROM tags';
  public errorMessage: string = '';
  values: SqlValue[][] = [];
  columns: string[] = [];
  selectedTag: any = 'Technology';
  tags: any[] = [];
  collections: any[] = [];
  searchControl: FormControl = new FormControl();
  collectionExist: boolean | undefined;

  constructor(private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Get category from the URL
    this.route.params.subscribe(params => {
      this.category = params['name'];
      console.log('Category selected:', this.category);
      if (this.category != null) {
        setTimeout(() => {
          this.loadTags();
        }, 1000);
      }
    });
    // setTimeout(() => {
    //   this.loadTags();
    // }, 1000);
    this.searchControl.valueChanges
      .pipe(debounceTime(300)) // To prevent querying too often
      .subscribe(tag => {
        this.searchTag(tag);
      });
  }

  async loadTags() {
    this.collections = [];
    this.selectedTag = 'Technology';
    const query = 'SELECT * FROM tags';
    this.databaseService.executeQuery(query).then(res => {
      console.log('tags**', res);
      if (res && res.length > 0) {
        this.tags = res[0].values.map((row: any) => ({
          id: row[0],
          tagName: row[1],
        }));
        this.cd.detectChanges();
        if (this.tags.length > 0) {
          let firstTag = this.tags[0].tagName[0];
          this.cd.detectChanges();
          const query = `SELECT * FROM collection WHERE tags LIKE '%${firstTag}%' and categories LIKE '%${this.category}%'`;
          this.databaseService.executeQuery(query).then(results => {
            console.log('collections**', results);
            if (results && results.length > 0) {
              this.collectionExist = true;
              this.collections = results[0].values.map((row: any) => ({
                id: row[0],
                name: row[1],
                description: row[2],
                url: row[3],
                categories: row[4],
                tags: row[5],
              }));
            } else {
              this.collectionExist = false;
              this.collections = [];
              console.log('nothing to show');
            }
          });
        }
      }
    });
  }

  async setActiveTag(tagName: string) {
    this.selectedTag = tagName;
    this.cd.detectChanges();
    // Query to select collections that have the selected tag
    const query = `SELECT * FROM collection WHERE tags LIKE '%${tagName}%' and categories LIKE '%${this.category}%'`;
    this.databaseService.executeQuery(query).then(results => {
      console.log('collection**', results);
      if (results && results.length > 0) {
        this.collectionExist = true;
        this.collections = results[0].values.map((row: any) => ({
          id: row[0],
          name: row[1],
          description: row[2],
          url: row[3],
          categories: row[4],
          tags: row[5],
        }));
      } else {
        this.collectionExist = false;
        this.collections = [];
        console.log('nothing to show');

      }
    });
  }

  searchTag(tagInput: string) {
    if (!tagInput) {
      this.collections = [];
      this.collectionExist = false;
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
      this.collectionExist = false;
    }
  }
}
