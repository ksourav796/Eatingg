import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/index";
import {Discount} from "../discount";
import {EmployeeService} from "../employee.service";
import {Router} from "@angular/router";
import {City} from "../city";

@Component({
  selector: 'app-discount-list',
  templateUrl: './discount-list.component.html',
  styleUrls: ['./discount-list.component.css']
})
export class DiscountListComponent implements OnInit {
  // Discount: Observable<Discount[]>;
  Discount: Discount = new Discount();

  public Discoun=[];
  ButtonStatus : String="InActive";
  inactiveStatus :String ="Active";
  clicked : Boolean = false;
  firstPage :Boolean = true;
  lastPage :Boolean = false;
  prevPage :Boolean = false;
  pageNo :number = 1;
  noOfPages : number;
  first : Boolean;
  last : Boolean;
  prev : Boolean;
  next : Boolean;
  page : String ='firstPage';
  constructor(private employeeService: EmployeeService,
              private router: Router) {}

  ngOnInit() {
    this.paginationList(this.page);
  }

  paginationList(page){
    switch (page){
      case 'firstPage':
        this.pageNo = 1;
        break;
      case 'lastPage':
        this.pageNo = this.noOfPages;
        break;
      case 'nextPage':
        this.pageNo = this.pageNo + 1;
        break;
      case 'prevPage':
        this.pageNo = this.pageNo - 1;
        break;
      default:
        this.pageNo=1;
        this.firstPage = true;
    }
    this.employeeService.getDiscountMethodList(this.inactiveStatus,"",(this.pageNo.toString())).subscribe(data=>
    {
      this.Discoun = data.data;
      this.noOfPages=data.no_of_paginations;
      if (this.noOfPages == 1||this.noOfPages==0) {
        this.first = true;
        this.last = true;
        this.prev = true;
        this.next = true;
      }else if(this.pageNo == this.noOfPages){
        this.first = false;
        this.last = true;
        this.prev = false;
        this.next = true;
      }else if(this.pageNo==1){
        this.first = true;
        this.last = false;
        this.prev = true;
        this.next = false;
      }else if(this.pageNo < this.noOfPages){
        this.first = false;
        this.last = false;
        this.prev = false;
        this.next = false;
      }
    })
  }
  inactiveButton(){
    if(this.clicked ==false) {
      this.inactiveStatus = "InActive";
      this.ButtonStatus = "Active";
    }
    else {
      this.inactiveStatus = "Active";
      this.ButtonStatus = "InActive";
    }
    this.clicked = !this.clicked;
    this.paginationList('');
  }



  updateDiscount(data){
    this.Discount=data;
    this.openModal(true);
  }
  private mdlSampleIsOpen : boolean = false;
  private openModal(open : boolean) : void {
    this.mdlSampleIsOpen = open;
  }
  private submitted: boolean;

  onSubmit() {
    this.submitted = true;
    this.save();
    this.openModal(false);
  }

  save() {
    this.employeeService.createDiscount(this.Discount)
      .subscribe(data => console.log(data), error => console.log(error));
    this.Discount = new Discount();
    this.paginationList(this.page);
  }
}
