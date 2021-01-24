import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../_model/category';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl, FormGroup} from '@angular/forms';
import {CategoryService} from '../../_service/category.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: 'category.component.html',
  styleUrls: ['category.component.css']
})
export class CategoryComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['position', 'name'];
  searchForm: FormGroup;
  dataSource = new MatTableDataSource<Category>();
  submitted = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private categoryService: CategoryService,
              private router: Router) {
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
    });
  }

  onClickCategoryDetail(row: Category): void {
  }

  createNewCategory(): void {
    this.router.navigate(['/create-category']).then();
  }


  public onPage(event: PageEvent): void {
  }
}
