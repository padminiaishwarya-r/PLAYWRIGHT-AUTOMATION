const WIDTH = 70;
const COL1 = 30;
const COL2 = 34;

const border = (char = '=') =>
  `+${char.repeat(WIDTH - 2)}+`;

const pad = (text, width) =>
  String(text).padEnd(width, ' ');

const row = (left, right = '') =>
  `| ${pad(left, COL1)} | ${pad(right, COL2)} |`;

const center = (text) => {
  const space = WIDTH - 2 - text.length;
  const left = Math.floor(space / 2);
  const right = space - left;
  return `|${' '.repeat(left)}${text}${' '.repeat(right)}|`;
};

export function buildMagentoOrdersReport({ executedOn, datePST, rows }) {
  const total = rows.reduce((s, r) => s + r.count, 0);

  return [
    border('='),
    center('MAGENTO DAILY ORDERS REPORT'),
    border('='),
    row('Executed On', executedOn),
    row('Date (PST)', datePST),
    border('-'),
    row('Status', 'Orders Count'),
    border('-'),
    ...rows.map(r => row(r.status, r.count)),
    border('-'),
    row('TOTAL ORDERS', total),
    border('=')
  ].join('\n');
}
