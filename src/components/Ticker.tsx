const ITEMS = [
  'Birthdays', 'Anniversaries', 'Proposals', 'Weddings', 'Roasts',
  'Farewells', "Mother's Day", 'Reunions', 'Just Because',
];

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="ticker">
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} className="tick">
            <span className="tick-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
