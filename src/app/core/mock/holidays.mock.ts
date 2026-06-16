export interface PublicHoliday {
  date: Date;
  name: string;
}

/** วันหยุดนักขัตฤกษ์ไทย 2026 (hardcoded) */
export const MOCK_HOLIDAYS_2026: PublicHoliday[] = [
  { date: new Date('2026-01-01'), name: 'วันขึ้นปีใหม่' },
  { date: new Date('2026-02-19'), name: 'วันมาฆบูชา' },
  { date: new Date('2026-04-06'), name: 'วันจักรี' },
  { date: new Date('2026-04-13'), name: 'วันสงกรานต์' },
  { date: new Date('2026-04-14'), name: 'วันสงกรานต์' },
  { date: new Date('2026-04-15'), name: 'วันสงกรานต์' },
  { date: new Date('2026-05-01'), name: 'วันแรงงานแห่งชาติ' },
  { date: new Date('2026-05-04'), name: 'วันฉัตรมงคล' },
  { date: new Date('2026-05-11'), name: 'วันวิสาขบูชา' },
  { date: new Date('2026-06-03'), name: 'วันเฉลิมพระชนมพรรษา สมเด็จพระนางเจ้าฯ' },
  { date: new Date('2026-07-28'), name: 'วันเฉลิมพระชนมพรรษา รัชกาลที่ 10' },
  { date: new Date('2026-08-12'), name: 'วันแม่แห่งชาติ' },
  { date: new Date('2026-10-13'), name: 'วันคล้ายวันสวรรคต รัชกาลที่ 9' },
  { date: new Date('2026-10-23'), name: 'วันปิยมหาราช' },
  { date: new Date('2026-12-05'), name: 'วันพ่อแห่งชาติ' },
  { date: new Date('2026-12-10'), name: 'วันรัฐธรรมนูญ' },
  { date: new Date('2026-12-31'), name: 'วันสิ้นปี' },
];

/** เซ็ต date string (yyyy-mm-dd) ของวันหยุด เพื่อ O(1) lookup */
export const HOLIDAY_DATE_SET = new Set<string>(
  MOCK_HOLIDAYS_2026.map(h => h.date.toISOString().slice(0, 10))
);

/** Map date string → holiday name */
export const HOLIDAY_MAP = new Map<string, string>(
  MOCK_HOLIDAYS_2026.map(h => [h.date.toISOString().slice(0, 10), h.name])
);
