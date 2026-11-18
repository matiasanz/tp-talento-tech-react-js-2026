import { useState, useMemo, useCallback } from 'react';
import { Showing } from '../../../js/domain/showings';
import './SeatMap.css';

function buildSeatGridTemplate(rowsLayout) {
    const blocks = rowsLayout
        .map((blockSize) => `repeat(${blockSize}, minmax(0, 1fr))`)
        .join(' var(--aisle-width) ');

    return `var(--row-label-width) ${blocks}`;
}

function useSeatSelection(showingEntity) {
    const [selectedSeats, setSelectedSeats] = useState([]);

    const selectedSet = useMemo(() => new Set(selectedSeats), [selectedSeats]);

    const toggleSeat = useCallback(
        (globalNumber) => {
            if (!showingEntity.isSeatAvailable(globalNumber)) return;

            setSelectedSeats((prev) =>
                prev.includes(globalNumber)
                    ? prev.filter((n) => n !== globalNumber)
                    : [...prev, globalNumber].sort((a, b) => a - b)
            );
        },
        [showingEntity]
    );

    const getSeatStatus = useCallback(
        (globalNumber) => {
            if (!showingEntity.isSeatAvailable(globalNumber)) return 'sold';
            if (selectedSet.has(globalNumber)) return 'selected';
            return 'available';
        },
        [showingEntity, selectedSet]
    );

    return {
        selectedSeats,
        toggleSeat,
        getSeatStatus,
    };
}

function SeatLegend() {
    return (
        <div className="seat-map__legend">
            <span className="legend-item">
                <i className="legend-item__dot legend-item__dot--available" />
                Disponible
            </span>
            <span className="legend-item">
                <i className="legend-item__dot legend-item__dot--selected" />
                Seleccionada
            </span>
            <span className="legend-item">
                <i className="legend-item__dot legend-item__dot--sold" />
                Ocupada
            </span>
        </div>
    );
}

function SeatCell({ cell, rowLabel, status, onToggle }) {
    if (cell.type === 'aisle') {
        return <div aria-hidden="true" />;
    }

    const label = `Fila ${rowLabel}, Butaca ${cell.seatInRow}`;

    return (
        <button
            type="button"
            disabled={status === 'sold'}
            aria-pressed={status === 'selected'}
            aria-label={label}
            title={label}
            onClick={() => onToggle(cell.globalNumber)}
            className={`seat seat--${status}`}
        >
            {cell.seatInRow}
        </button>
    );
}

function SeatFooter({ selectedSeats, seatLabelsByNumber, availableCount, isSoldOut, onConfirm }) {
    const hasSelection = selectedSeats.length > 0;

    return (
        <div className="seat-map__footer">
            <p className="seat-map__summary">
                {isSoldOut ? (
                    <span className="seat-map__sold-out">Función agotada</span>
                ) : hasSelection ? (
                    <>
                        Butacas seleccionadas:{' '}
                        <strong>
                            {selectedSeats
                                .map((num) => seatLabelsByNumber.get(num) ?? `#${num}`)
                                .join(', ')}
                        </strong>{' '}
                        ({selectedSeats.length})
                    </>
                ) : (
                    <span className="seat-map__hint">
                        Presione las butacas que desee seleccionar ({availableCount} disponibles)
                    </span>
                )}
            </p>

            <button
                type="button"
                disabled={!hasSelection || isSoldOut}
                onClick={onConfirm}
                className="seat-map__confirm-btn"
            >
                Confirmar Compra ({selectedSeats.length})
            </button>
        </div>
    );
}

export function SeatMap({ showing, onConfirmPurchase }) {
    const showingEntity = useMemo(
        () => (showing instanceof Showing ? showing : new Showing(showing)),
        [showing]
    );

    const { auditorium } = showingEntity;
    const { selectedSeats, toggleSeat, getSeatStatus } = useSeatSelection(showingEntity);

    const rows = useMemo(() => auditorium.buildLayout(), [auditorium]);

    const seatGridTemplate = useMemo(
        () => buildSeatGridTemplate(auditorium.rowsLayout),
        [auditorium.rowsLayout]
    );

    const seatLabelsByNumber = useMemo(() => {
        const map = new Map();
        for (const row of rows) {
            for (const cell of row.cells) {
                if (cell.type !== 'aisle') {
                    map.set(cell.globalNumber, `${row.rowLabel}-${cell.seatInRow}`);
                }
            }
        }
        return map;
    }, [rows]);

    const handleConfirm = () => {
        onConfirmPurchase(showingEntity.id, selectedSeats);
    };

    return (
        <div className="seat-map">
            <h3>Sala {auditorium.name}</h3>
            <SeatLegend />

            <div className="seat-map__screen">PANTALLA</div>

            <div className="seat-map__grid">
                {rows.map((row, rowIndex) => (
                    <div
                        key={row.rowLabel ?? rowIndex}
                        className="seat-map__row"
                        style={{ '--seat-grid-template': seatGridTemplate }}
                    >
                        <span className="seat-map__row-label">{row.rowLabel}</span>

                        {row.cells.map((cell, cellIndex) => (
                            <SeatCell
                                key={
                                    cell.type === 'aisle'
                                        ? `aisle-${row.rowLabel ?? rowIndex}-${cellIndex}`
                                        : `seat-${cell.globalNumber}`
                                }
                                cell={cell}
                                rowLabel={row.rowLabel}
                                status={getSeatStatus(cell.globalNumber)}
                                onToggle={toggleSeat}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <SeatFooter
                selectedSeats={selectedSeats}
                seatLabelsByNumber={seatLabelsByNumber}
                availableCount={showingEntity.availableSeatsCount}
                isSoldOut={showingEntity.isSoldOut}
                onConfirm={handleConfirm}
            />
        </div>
    );
}