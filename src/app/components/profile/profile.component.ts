import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subscription } from "rxjs";
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userName: string = "";
  userBalance: number = 0;
  userIsAuthenticated = false;
  private authStatusSub: Subscription = new Subscription; ///
  successMessage: string = ""; ///
  

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    console.log("Profile component initializing...");
    this.authService.getUserProfile().subscribe(
      response => {
          console.log("User profile data:", response);
          this.userName = response.name;
          this.userBalance = response.balance;
      },
      error => {
          console.log("Error fetching user profile:",error);
      }
    );

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  
  onDeposit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.depositBalance(form.value.amount).subscribe(
      () => {
        this.successMessage = "Deposit successful!";
        this.userBalance += form.value.amount;
        form.controls['amount'].setValue(0); // Reseta o valor do input
      },
      error => {
        // Lógica para lidar com erros, se necessário
      }
    );
  }

  onWithdraw(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.withdrawBalance(form.value.amount).subscribe(
      () => {
      this.successMessage = "Withdraw successful!";
      this.userBalance -= form.value.amount;
      form.controls['amount'].setValue(0); // Reseta o valor do input
      },
      error => {
        // Lógica para lidar com erros, se necessário
      }
    );
  }


  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
