import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-component',
  templateUrl: './footer-component.component.html',
  styleUrls: ['./footer-component.component.css'],
})
export class FooterComponentComponent implements OnInit {
  year: number;

  constructor() {}

  ngOnInit(): void {
    this.year = new Date().getFullYear();
  }

  x;
}
