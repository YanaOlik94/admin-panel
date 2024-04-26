import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpService} from "../../services/http.service";
import {UtilsService} from "../../services/utils.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'lastName', 'dateOfBirth', 'education', 'position', 'role'];
  token: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpService,
              private utils: UtilsService) {
    this.token = this.http.userRole.getValue().token;
  }

  ngOnInit() {
    this.getUsers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private getUsers(): void {
    this.http.getUsers(this.token).subscribe({
      next: (res: any) => {
        const arr: any[] = [];
        Object.keys(res).forEach(key => arr.push({key, ...res[key]}));
        this.dataSource = new MatTableDataSource(arr);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        return arr;
      },
      error: this.utils.errorHandler
    })
  }

  updateUser(row: any) {
    console.log('to do')
  }

  deleteUser(key: any) {
    console.log('to do')
  }
}
