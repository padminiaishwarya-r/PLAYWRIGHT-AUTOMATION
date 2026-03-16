export function getYesterdayPSTDateForMagento() {
  const now = new Date();

  // Convert "now" to PST date parts
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(now);

  const year = Number(parts.find(p => p.type === 'year').value);
  const month = Number(parts.find(p => p.type === 'month').value) - 1;
  const day = Number(parts.find(p => p.type === 'day').value);

  // Create PST midnight date
  const pstDate = new Date(year, month, day);

  // 🔑 Always go to yesterday PST
  pstDate.setDate(pstDate.getDate() - 1);

  const mm = String(pstDate.getMonth() + 1).padStart(2, '0');
  const dd = String(pstDate.getDate()).padStart(2, '0');
  const yyyy = pstDate.getFullYear();

  return `${mm}/${dd}/${yyyy}`; // Magento format
}
