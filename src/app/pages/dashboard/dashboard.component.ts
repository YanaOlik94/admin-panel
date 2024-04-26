import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpService} from "../../services/http.service";
import * as d3 from "d3";
import {UtilsService} from "../../services/utils.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['name', 'users_resolved', 'active', 'image_url'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  token: string;
  data: any;
  id!: number;
  private svg: any;
  private margin = 50;
  private width = 650 - (this.margin * 2);
  private height = 300 - (this.margin * 2);


  dataSource!: MatTableDataSource<any>;
  isChartOpened: boolean = false;

  constructor(private http: HttpService,
              private utils: UtilsService) {
    this.token = this.http.userRole.getValue().token;
  }

  ngOnInit() {
    this.getReport();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private getReport(): void {
    this.http.getReport(this.token).subscribe({
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

   openReport(id: number) {
    this.isChartOpened = true;
    this.id = id;
    this.getGraphData();
  }

  private getGraphData() {
    this.http.getGraphData(this.token,  this.id).subscribe((data) => {
      this.data = data;
      this.createSvg();
      this.drawBars(this.data)
    }, error => this.utils.errorHandler(error)
    )
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: any): void {

    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(Object.keys(data))
      .padding(0.6);


    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(10,0)")
      .style("text-anchor", "end");


    const y = d3.scaleLinear()
      .domain([0, 25])
      .nice()
      .range([this.height, 0]);


    this.svg.append("g")
      .call(d3.axisLeft(y).ticks(5));

    const makeYLines = () => d3.axisLeft(y).scale(y)

    this.svg.append('g')
      .attr('class', 'grid')
      .call(makeYLines()
        .ticks(5)
        .tickSize(-this.width)
        .tickFormat(function () {
          return '';
        }))

    this.svg.selectAll('.grid')
      .style('color', '#EDEDED')

    this.svg.selectAll('.domain')
      .attr('stroke', '#F5F5F5')

    this.svg.selectAll("bars")
      .data(Object.entries(data))
      .enter().append("rect")
      .attr("x", (d: any) => x(d[0]))
      .attr("y", (d: any) => y(d[1]))
      .attr("width", x.bandwidth())
      .attr("height", (d: any) => this.height - y(d[1]))
      .attr("fill", "#2f4e75");
  }

  goBack() {
    this.isChartOpened = false;
  }
}
