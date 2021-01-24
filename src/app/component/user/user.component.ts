import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {UseService} from '../../_service/use.service';
import {User} from '../../_model/user';

@Component({
  selector: 'app-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.css']
})
export class UserComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['position', 'firstName', 'lastName', 'email', 'phoneNumber', 'role'];
  searchForm: FormGroup;
  dataSource = new MatTableDataSource<User>();
  submitted = false;

  constructor(private userService: UseService,
              private router: Router) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      name: new FormControl('')
    });
    this.onSubmit();
  }

  onSubmit(): void {
    this.submitted = true;
    this.userService.getAllUser().subscribe(value => {
      this.dataSource.data = value;
      this.submitted = false;
    });
  }

  onClickUserDetail(row: User): void {
    this.router.navigate([`user/${row.id}`]).then();
  }

  createNewUser(): void {
    this.router.navigate(['/create-user']).then();
  }


  public onPage(event: PageEvent): void {
  }
}
