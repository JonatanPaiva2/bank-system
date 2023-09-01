import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { User } from './user.interface';

import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name = "";
  email = "";
  password = "";

  constructor(public authService: AuthService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  onRegister(form: NgForm){
    console.log("Form submission triggered!");
    if (form.invalid) {
      console.log("Preencha todos os campos")
      return;
    }
    this.authService.createUser(form.value.name, form.value.email, form.value.password);
  }
    
}
