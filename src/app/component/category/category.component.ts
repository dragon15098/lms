import {Component, OnInit} from '@angular/core';
import {Category} from '../../_model/category';
import {PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl, FormGroup} from '@angular/forms';
import {CategoryService} from '../../_service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: 'category.component.html',
  styleUrls: ['category.component.css']
})
export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'actions'];
  searchForm: FormGroup;
  dataSource = new MatTableDataSource<Category>();
  submitted = false;

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      categoryName: new FormControl('')
    });
    this.onSubmit();
  }

  onSubmit(): void {
    this.submitted = true;
    this.categoryService.getAll().subscribe(value => {
      this.dataSource.data = value;
      this.submitted = false;
      console.log(value);
    });
  }

  onClickCategoryDetail(row: Category): void {
    console.log(row);
  }

  createNewCategory(): void {

  }


  public onPage(event: PageEvent): void {
    console.log(event);
  }
}
