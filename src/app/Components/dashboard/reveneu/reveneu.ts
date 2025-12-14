import { Component, OnInit } from '@angular/core';
import { RevenueService } from '../../../Services/RevenueService';
import { IRevenue } from '../../../models/irevenue';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reveneu',
  imports: [CommonModule],
  templateUrl: './reveneu.html',
  styleUrl: './reveneu.css',
})
export class Reveneu implements OnInit {
    revenues: IRevenue[] = [];
    totalRevenues!: number;
/**
 *
 */
  constructor(private revenueService: RevenueService) {  
}
ngOnInit(): void {
  this.revenueService.TotalRevenues()
    .subscribe(value => {
      this.totalRevenues = value;
    });
}
}
