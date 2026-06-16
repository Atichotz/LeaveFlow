import { Component } from '@angular/core';

@Component({
  selector: 'app-stat-card-skeleton',
  template: `
    <div class="card flex animate-pulse items-center gap-4 p-5">
      <div class="h-12 w-12 flex-shrink-0 rounded-xl bg-gray-200"></div>
      <div class="flex-1 space-y-2">
        <div class="h-3 w-24 rounded bg-gray-200"></div>
        <div class="h-8 w-16 rounded bg-gray-200"></div>
      </div>
    </div>
  `,
})
export class StatCardSkeletonComponent {}
