import { useState, useMemo } from 'react';

export function SeatMap({ showing, onConfirmPurchase }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const soldSeatsSet = useMemo(() => new Set(showing.soldSeats), [showing.soldSeats]);
  const { rowsCount, rowsLayout, name: auditoriumName } = showing.auditorium;

  const toggleSeat = (seatNumber) => {
    if (soldSeatsSet.has(seatNumber)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((n) => n !== seatNumber)
        : [...prev, seatNumber].sort((a, b) => a - b)
    );
  };

  // Agregamos "0.5fr" al inicio para la columna de etiqueta de fila (R1, R2...)
  const gridTemplateColumns = useMemo(() => {
    const seatsAndAisles = rowsLayout
      .map((blockSize) => `repeat(${blockSize}, minmax(0, 1fr))`)
      .join(' 0.35fr ');
    return `0.5fr ${seatsAndAisles}`;
  }, [rowsLayout]);

const seatsPerRow = useMemo(
  () => rowsLayout.reduce((acc, seats) => acc + seats, 0),
  [rowsLayout]
);

  let seatCounter = 1;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        padding: '0 8px',
        boxSizing: 'border-box',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <h3>Sala {auditoriumName}</h3>

      {/* Color legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '20px',
          fontSize: '0.9rem'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i style={{ width: '14px', height: '14px', backgroundColor: '#3498db', borderRadius: '3px' }} />
          Available
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i style={{ width: '14px', height: '14px', backgroundColor: '#2ecc71', borderRadius: '3px' }} />
          Selected
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i style={{ width: '14px', height: '14px', backgroundColor: '#bdc3c7', borderRadius: '3px' }} />
          Sold
        </span>
      </div>

      {/* Curved screen */}
      <div
        style={{
          width: '90%',
          margin: '0 auto 28px auto',
          padding: '8px',
          backgroundColor: '#ecf0f1',
          borderTop: '4px solid #95a5a6',
          borderRadius: '50% 50% 0 0 / 14px 14px 0 0',
          color: '#7f8c8d',
          fontSize: '0.85rem',
          letterSpacing: '4px',
          fontWeight: 'bold'
        }}
      >
        SCREEN
      </div>

      {/* Responsive seat grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.5vw, 10px)' }}>
        {Array.from({ length: rowsCount }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: 'grid',
              gridTemplateColumns,
              gap: 'clamp(4px, 1.2vw, 8px)',
              alignItems: 'center',
              width: '100%'
            }}
          >
            {/* Row label integrated into the grid */}
            <span
              style={{
                fontSize: 'clamp(0.7rem, 2.2vw, 0.9rem)',
                fontWeight: 'bold',
                color: '#7f8c8d',
                textAlign: 'right',
                paddingRight: '4px',
                userSelect: 'none'
              }}
            >
              R{(rowIndex + 1).toString().padStart(2, 0)}
            </span>

            {rowsLayout.map((seatsInBlock, blockIndex) => (
              <div key={blockIndex} style={{ display: 'contents' }}>
                {Array.from({ length: seatsInBlock }).map(() => {
                  const currentSeat = seatCounter++;
                  const isSold = soldSeatsSet.has(currentSeat);
                  const isSelected = selectedSeats.includes(currentSeat);

                  return (
                    <button
                      key={currentSeat}
                      type="button"
                      disabled={isSold}
                      onClick={() => toggleSeat(currentSeat)}
                      title={`Row ${rowIndex + 1} - Seat ${currentSeat}`}
                      style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        padding: 0,
                        borderRadius: '18% 18% 8% 8%',
                        border: 'none',
                        fontSize: 'clamp(0.75rem, 2.8vw, 1.05rem)',
                        fontWeight: 'bold',
                        backgroundColor: isSold
                          ? '#bdc3c7'
                          : isSelected
                          ? '#2ecc71'
                          : '#3498db',
                        color: '#fff',
                        cursor: isSold ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isSold ? 'none' : '0 2px 4px rgba(0,0,0,0.12)'
                      }}
                    >
                      {((currentSeat - 1) % seatsPerRow) + 1}
                    </button>
                  );
                })}

                {/* Aisle spacer between blocks */}
                {blockIndex < rowsLayout.length - 1 && <div aria-hidden="true" />}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Summary and action button */}
      <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
        <p style={{ marginBottom: '12px', fontSize: '1rem' }}>
          {selectedSeats.length > 0 ? (
            <>
              Selected seats: <strong>{selectedSeats.join(', ')}</strong> ({selectedSeats.length})
            </>
          ) : (
            <span style={{ color: '#777' }}>Presione las butacas que desee seleccionar</span>
          )}
        </p>

        <button
          type="button"
          disabled={selectedSeats.length === 0}
          onClick={() => onConfirmPurchase(showing.id, selectedSeats)}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '1.05rem',
            fontWeight: 'bold',
            backgroundColor: selectedSeats.length > 0 ? '#2ecc71' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: selectedSeats.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          Confirm Purchase ({selectedSeats.length})
        </button>
      </div>
    </div>
  );
}
