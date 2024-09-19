import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {
  category: string | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Get category from the URL
    this.route.params.subscribe(params => {
      this.category = params['name'];
      console.log('Category selected:', this.category);
    });
  }
}
