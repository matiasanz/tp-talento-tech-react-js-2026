import { useState, useMemo, useCallback, memo } from 'react';
import { Showing, SeatSelection } from '../../../js/domain/showings';
import { formatRowLabel } from './utils';
import './seatmap.css';

export function SeatMap({ showing, previousSelectedSeats=[], maxSeatsPerPurchase = Infinity, onConfirmPurchase }) {
    const showingEntity = useMemo(
        () => (showing instanceof Showing ? showing : new Showing(showing)),
        [showing]
    );

    const { auditorium } = showingEntity;
    const { selection, toggleSeat, clearSelection } = useSeatSelection(
        showingEntity,
        maxSeatsPerPurchase,
        previousSelectedSeats
    );

    const gridTemplate = useMemo(
        () => auditorium.rowsLayout.map((n) => `repeat(${n}, 1fr)`).join(' var(--aisle-width, 1rem) '),
        [auditorium.rowsLayout]
    );

    const handleConfirm = () => {
        onConfirmPurchase?.(selection.selectedSeats);
    };

    return (
        <section className="seat-map" aria-labelledby="seat-map-title">
            <header className="seat-map__header">
                <h3 id="seat-map-title">Sala {auditorium.name}</h3>
                <SeatLegend />
            </header>

            <div className="seat-map__stage" role="grid" aria-label="Mapa de butacas">
                <div aria-hidden="true" className="seat-map__corner" />
                <div className="seat-map__screen-area" role="presentation">
                    <div className="seat-map__screen">PANTALLA</div>
                </div>

                {Array.from({ length: auditorium.rowsCount }, (_, rowIndex) => (
                    <SeatRow
                        key={rowIndex}
                        rowIndex={rowIndex}
                        auditorium={auditorium}
                        gridTemplate={gridTemplate}
                        showing={showingEntity}
                        selection={selection}
                        onToggle={toggleSeat}
                    />
                ))}
            </div>

            <SeatFooter
                selection={selection}
                availableCount={showingEntity.availableSeatsCount}
                isSoldOut={showingEntity.isSoldOut}
                onConfirm={handleConfirm}
                onClearSelection={clearSelection}
            />
        </section>
    );
}

const SeatRow = memo(function SeatRow({ rowIndex, auditorium, gridTemplate, showing, selection, onToggle }) {
    const { rowsLayout, seatsPerRow } = auditorium;
    const rowNumber = rowIndex + 1
    const rowLabel = formatRowLabel(rowNumber);
    const rowStart = rowIndex * seatsPerRow;
    let seatOffset = 0;

    return (
        <>
            <span className="seat-map__row-label" aria-hidden="true">
                {rowLabel}
            </span>

            <div
                role="row"
                className="seat-map__row-seats"
                style={{ '--seat-grid-template': gridTemplate }}
            >
                {rowsLayout.flatMap((blockSize, blockIndex) => {
                    const blockStart = seatOffset;
                    seatOffset += blockSize;

                    const seats = Array.from({ length: blockSize }, (_, i) => {
                        const seatInRow = blockStart + i + 1;
                        const globalNumber = rowStart + seatInRow;
                        const isAvailable = showing.isSeatAvailable(globalNumber);
                        const isSelected = selection.hasSeat(globalNumber);
                        const status = !isAvailable ? 'sold' : isSelected ? 'selected' : 'available';
                        const disabled = !isAvailable || (!isSelected && !selection.canAddNewSeat(globalNumber));

                        return (
                            <SeatCell
                                key={globalNumber}
                                globalNumber={globalNumber}
                                rowLabel={String(rowNumber).padStart(2, "0")}
                                seatInRow={seatInRow}
                                status={status}
                                disabled={disabled}
                                onToggle={onToggle}
                            />
                        );
                    });

                    return blockIndex > 0
                        ? [<div key={`aisle-${blockIndex}`} aria-hidden="true" />, ...seats]
                        : seats;
                })}
            </div>
        </>
    );
});

function SeatCell({ globalNumber, rowLabel, seatInRow, status, disabled, onToggle }) {
    const label = `Fila ${rowLabel}, Butaca ${seatInRow}`;

    return (
        <button
            type="button"
            role="gridcell"
            disabled={disabled}
            aria-pressed={status === 'selected'}
            aria-label={label}
            title={label}
            onClick={() => onToggle(globalNumber)}
            className={`seat seat--${status}`}
        />
    );
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

function SeatFooter({ selection, availableCount, isSoldOut, onConfirm, onClearSelection }) {
    return (
        <div className="seat-map__footer">
            <p className="seat-map__summary">
                {isSoldOut ? (
                    <span className="seat-map__sold-out">Función agotada</span>
                ) : !selection.isEmpty ? (
                    <>
                        Butacas seleccionadas:{' '}
                        {String(selection.count).padStart(2, 0)}
                    </>
                ) : (
                    <span className="seat-map__hint">
                        Presione las butacas que desee seleccionar ({availableCount} disponibles)
                    </span>
                )}
            </p>

            <button
                type="button"
                disabled={selection.isEmpty || isSoldOut}
                onClick={onConfirm}
                className="seat-map__confirm-btn"
            >
                Confirmar Compra
            </button>
            <button
                type="button"
                disabled={selection.isEmpty}
                onClick={onClearSelection}
                className="seat-map__cancel-btn"
            >
                Limpiar mi selección
            </button>
        </div>
    );
}

function useSeatSelection(showingEntity, maxSeatsPerPurchase, previousSelectedSeats = []) {
    const [rawSelection, setRawSelection] = useState(
        () => new SeatSelection(showingEntity, maxSeatsPerPurchase, previousSelectedSeats)
    );

    const selection = rawSelection.syncWithShowing(showingEntity, maxSeatsPerPurchase);

    const toggleSeat = useCallback(
        (seatNumber) => {
            setRawSelection((prev) =>
                prev.syncWithShowing(showingEntity, maxSeatsPerPurchase).toggle(seatNumber)
            );
        },
        [showingEntity, maxSeatsPerPurchase]
    );

    const clearSelection = useCallback(() => {
        setRawSelection((prev) => prev.clear());
    }, []);

    return { selection, toggleSeat, clearSelection };
}