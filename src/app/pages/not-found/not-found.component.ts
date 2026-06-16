import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <div class="select-none text-9xl font-black text-gray-200">404</div>
      <h1 class="mt-2 text-2xl font-bold text-gray-800">ไม่พบหน้าที่คุณต้องการ</h1>
      <p class="mt-2 text-sm text-gray-500">ลิงก์นี้ไม่มีอยู่ในระบบ หรืออาจถูกย้ายไปแล้ว</p>
      <a routerLink="/" class="btn-primary mt-8 inline-block">กลับหน้าแรก</a>
    </div>
  `,
})
export class NotFoundComponent {}
