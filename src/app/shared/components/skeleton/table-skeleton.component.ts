import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-skeleton',
  template: `
    <div class="table-wrapper animate-pulse">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            @for (c of colRange(); track $index) {
              <th class="table-header-cell">
                <div class="h-3 w-20 rounded bg-gray-200"></div>
              </th>
            }
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 bg-white">
          @for (r of rowRange(); track $index) {
            <tr>
              @for (c of colRange(); track $index) {
                <td class="table-cell">
                  <div class="h-4 w-28 rounded bg-gray-200"></div>
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class TableSkeletonComponent {
  readonly rows = input<number>(5);
  readonly cols = input<number>(4);

  colRange(): number[] { return Array.from({ length: this.cols() }); }
  rowRange(): number[] { return Array.from({ length: this.rows() }); }
}
