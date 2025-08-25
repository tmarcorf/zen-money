import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    standalone: false
})
export class LayoutComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  isLoginClick = false;
  private subscription?: Subscription;

  constructor(
    public userService: UserService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.subscription = this.userService.isLoggedIn$.subscribe(
      (isLoggedIn) => this.isLoggedIn = isLoggedIn
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  logout() {
    this.userService.logout();
  }
}
