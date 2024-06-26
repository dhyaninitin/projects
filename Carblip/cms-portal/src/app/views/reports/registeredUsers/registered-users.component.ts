import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ReportsService } from 'app/shared/services/apis/reports.service';
import * as moment from 'moment-timezone';
import { ChartViewGenerateService } from 'app/shared/services/chart-view-generate.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { ApexOptions } from '@vex/components/chart/chart.component';
import { defaultChartOptions } from '@vex/utils/default-chart-options';
import {checkAllSource, formatDropdown} from 'app/shared/helpers/multiselect.helper'
@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.scss', '../reports.component.scss'],
  animations: [
    fadeInRight400ms,
  ]
})
export class RegisteredUsersComponent implements OnInit {

  @Input() view:any = [];
  @Input() sources: [] = [];
  public barChartData: { data: any[]; name: string; }[];
  public chartOptions: ApexOptions = null;

  public daterrange = {
    begin: null,
    end: null,
  };
  viewType = 'D';
  total: number;
  public selectedSource: any = [0];
  regUsers: any = [];
  contactOwnersList: any = [];
  public selectedOwner: any = [0];

  public single = [];
  showCalendar: boolean = false;
  requestFilter: { start_date: string; end_date: string; source: any; contact_owner: any; };
  timeout: any;
  noDataMessage: string = '';

  constructor(
    private reportService: ReportsService,
    private chartViewGenerateService: ChartViewGenerateService,
    private _cdr: ChangeDetectorRef,
    private loader$: AppLoaderService,
    private snack$: MatSnackBar,
  ) { }

  ngOnInit() { }

  getRegUsers() {
    this.noDataMessage = ''
    this.requestFilter = {
      start_date: moment(this.daterrange.begin).format('yyyy/MM/DD'),
      end_date: moment(this.daterrange.end).add(1, 'days').format('yyyy/MM/DD'),
      source: this.selectedSource.toString(),
      contact_owner: this.selectedOwner.toString()
    };
    this.reportService.getRegisteredUsersReport(this.requestFilter).subscribe( res => {
     if(res.statusCode == 200 && res.data.length > 0){
      this.regUsers = res.data[0].chartdata;
      this.contactOwnersList = formatDropdown(res.data[0].contactowner);
      this.regUsers = this.chartViewGenerateService.createChartData(this.regUsers, this.requestFilter.start_date, this.requestFilter.end_date);
      this.total = this.chartViewGenerateService.sum(this.regUsers);
      this.changeViewType(this.viewType);
      this._cdr.detectChanges();
    } else {
      this.regUsers = [];
      this.contactOwnersList = [];
      this.total = 0;
      this.noDataMessage = 'No Data Available'
      this._cdr.detectChanges();
    }
    }, error => {
      console.log("There are some errors. Please Check!",error);
    })
  }

  getSelectedDates(event) {
    this.daterrange = event;
    this.getRegUsers();
  }

  onSourceChange(){
    if(this.selectedSource.includes(0)){
      this.selectedSource.splice(0,1)
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getRegUsers();
    }, 1200);
  }

  checkAllSources(event, type?:string){
    if(event === 0 && !type) this.selectedSource = [0];
    if(event === 0 && type) this.selectedOwner = [0]
  }

  onContactOwnerChange() {
    if(this.selectedOwner.includes(0)){
      this.selectedOwner.splice(0,1)
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getRegUsers();
    }, 1200);
  }

  changeViewType(event) {
    if(this.regUsers.length > 0){
      if(event === 'D') {
        this.single = this.chartViewGenerateService.generateDayView(this.regUsers);
      } else if(event === 'W') {
        this.single = this.chartViewGenerateService.generateWeekView(this.regUsers);
      } else {
        this.single = this.chartViewGenerateService.generateMonthView(this.regUsers);
      }
      this.createSingleChartData(this.single);  
    }
    this.viewType = event;
  }


  createSingleChartData(data: any) {
    let fetchLabels = [];
    let set1 = [];
    data.map(item=> {
      fetchLabels.push(item.name);
      set1.push(item.series[0].value.toFixed(2))

    });
    this.initializeChart(fetchLabels);
    const array = [
      {data: set1, name: 'Value'},
    ]
    this.barChartData = array;
  }

  initializeChart(fetchLabels: Array<string>) {
    this.chartOptions = defaultChartOptions({
      grid: {
        show: true,
        strokeDashArray: 3,
        padding: {
          left: 16
        }
      },
      chart: {
        type: 'bar',
        height: 384,
        sparkline: {
          enabled: false
        },
        zoom: {
          enabled: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: fetchLabels,
        type: 'category',
        labels: {
          show: true
        }
      },
      yaxis: {
          labels: {
          show: true,
          formatter: function(val) {
            let dollarUSLocale = Intl.NumberFormat('en-US');
            return dollarUSLocale.format(Number(val)); 
          }
        },
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        x:{
          show: true
        },
        y: {
          formatter: function(val) {
            let dollarUSLocale = Intl.NumberFormat('en-US');
            return dollarUSLocale.format(Number(val)); 
          }
        },
        theme: 'dark'
      },
      legend: {
        show: true,
        itemMargin: {
          horizontal: 4,
          vertical: 4
        }
      }
    });
  }

  onExportRegisteredUsers(){
    let payload = {
      type: 'registered-user',
      order_by: 'created_at',
      order_dir: 'desc',
      filter: JSON.stringify(this.requestFilter),
    };
    this.loader$.open();
    this.reportService.exportReportCharts(payload).subscribe( res => {
      this.loader$.close();
        if (res.data) {
          window.open(
            environment.apiUrl + '/export/download?token=' + res.data.token
          );
        } else {
          this.snack$.open('Something went wrong, Try again.', 'OK', {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: ['snack-warning'],
          });
        }

    }, error => {
      console.log("There are some errors. Please Check!",error);
    });
  }
}
