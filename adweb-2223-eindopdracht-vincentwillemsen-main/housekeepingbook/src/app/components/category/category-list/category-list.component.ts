import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CategoryModel} from "../../../models/category.model";
import {CategoryService} from "../../../services/category.service";

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent {
  categories: CategoryModel[] = [];
  service: CategoryService;

  constructor(public activatedRoute: ActivatedRoute, service: CategoryService) {
    this.service = service;
    service.getCategories(activatedRoute).subscribe(categories => this.categories = categories)
  }

  deleteCategory(category) {
    if (confirm("Remove " + category.name)) {
      this.service.deleteCategory(category);
    }
  }
}

