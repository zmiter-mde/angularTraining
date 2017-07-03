import { Component, OnInit } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-deal-data',
  templateUrl: './deal-data.component.html',
  styleUrls: ['./deal-data.component.css']
})
export class DealDataComponent implements OnInit {

  openPrice : number = 1.13591;
  margin : number = 2;
  investment : number = 1000;
  tax : number = 0.22;
  closePrice : number = 0;
  curClosePrice : number = 0;
  raise : boolean = true;

  url : string = 'https://gaterest.fxclub.com/Demo/RestApi/Quotes/CurrentQuotes?version=1499111442&symbols=Litecoin%2CDIS%2CYNDX%2CAUDCAD%2CAUDCHF%2CAUDJPY%2CAUDNZD%2CAUDUSD%2CBitcoin%2CCADCHF%2CCADJPY%2CCHFJPY%2CCHFSGD%2CEURAUD%2CEURCAD%2CEURCHF%2CEURGBP%2CEURJPY%2CEURMXN%2CEURNOK%2CEURNZD%2CEURSEK%2CEURSGD%2CEURUSD%2CGBPAUD%2CGBPCAD%2CGBPCHF%2CGBPJPY%2CGBPNZD%2CGBPSEK%2CGBPUSD%2CNOKJPY%2CNZDCAD%2CNZDCHF%2CNZDJPY%2CNZDUSD%2CSGDJPY%2CUSDCAD%2CUSDCHF%2CUSDDKK%2CUSDJPY%2CUSDMXN%2CUSDNOK%2CUSDRUB%2CUSDSEK%2CUSDSGD%2CUSDCLP';

  getClosePrice() {
    return this.openPrice * (1 + this.getDirection() * this.tax / (this.investment * this.margin));
  }

  getDirection() {
    return this.raise ? 1 : -1;
  }

  constructor(private http: Http) {
    this.closePrice = this.getClosePrice();
    this.getStocks();
    setInterval(() => this.getStocks(), 10000);
  }

  getIncome() {
    var income = this.investment * this.margin * this.getDirection() * (this.curClosePrice - this.openPrice)
                                    / this.openPrice
        - this.tax;
    return income;
  }

  getStocks() {
    let stocks = [];
    return this.http.get(this.url).map((res:Response) => res.json()).subscribe(
                               result => {
                                 stocks = result.Result.QuotesTrade;
                                 for (let stock of stocks) {
                                   if (stock.s === 'EURUSD') {
                                     this.curClosePrice = stock.r;
                                   }
                                 }
                               },
                                err => {
                                    // Log errors if any
                                    console.log(err);
                                });
  }

  ngOnInit() {
  }

}
