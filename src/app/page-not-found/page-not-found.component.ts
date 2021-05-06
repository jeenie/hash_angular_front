import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
            private router:Router
  ) { }

  ngOnInit(): void {
    const path = this.activatedRoute.snapshot.queryParams['path'];
          if(path){
              this.router.navigate([path]);
          }
  }

}
