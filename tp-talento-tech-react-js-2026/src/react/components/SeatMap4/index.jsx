import { useState, useMemo, useCallback, useEffect, Fragment } from 'react';
import { Showing, SeatSelection } from '../../../js/domain/showings';
import './seatmap.css';

export function SeatMap({ showing, maxSeatsPerPurchase, onConfirmPurchase }) {
    const showingEntity = useMemo(
        () => (showing instanceof Showing ? showing : new Showing(showing)),
        [showing]
    );

    const { auditorium } = showingEntity;

    const {
        selectedSeats,
        toggleSeat,
        clearSelection,
        getSeatStatus,
        isSeatDisabled,
    } = useSeatSelection(showingEntity, { maxSeatsPerPurchase });

    const rowLabels = useMemo(
        () => buildRowLabels(auditorium.rowsCount),
        [auditorium.rowsCount]
    );

    const seatsMatrix = useMemo(
        () => buildSeatsMatrix(auditorium),
        [auditorium]
    );

    const seatsGridTemplate = useMemo(
        () => buildSeatsGridTemplate(auditorium.rowsLayout),
        [auditorium.rowsLayout]
    );

    const seatLabelsByNumber = useMemo(
        () => buildSeatLabelsMap(seatsMatrix),
        [seatsMatrix]
    );

    const handleConfirm = () => {
        onConfirmPurchase?.(showingEntity.id, selectedSeats, clearSelection);
    };

    return (
        <div className="seat-map">
            <h3>Sala {auditorium.name}</h3>
            <SeatLegend />

            <div className="seat-map__stage">
                <div aria-hidden="true" className="seat-map__corner" />
                <div className="seat-map__screen-area">
                    <div className="seat-map__screen">PANTALLA</div>
                </div>

                {seatsMatrix.map((rowCells, rowIndex) => (
                    <Fragment key={rowLabels[rowIndex] ?? rowIndex}>
                        <span className="seat-map__row-label">
                            {rowLabels[rowIndex]}
                        </span>

                        <div
                            className="seat-map__row-seats"
                            style={{ '--seat-grid-template': seatsGridTemplate }}
                        >
                            {rowCells.map((cell) => (
                                <SeatCell
                                    key={cell.id}
                                    cell={cell}
                                    rowLabel={rowLabels[rowIndex]}
                                    status={getSeatStatus(cell.globalNumber)}
                                    disabled={isSeatDisabled(cell.globalNumber)}
                                    onToggle={toggleSeat}
                                />
                            ))}
                        </div>
                    </Fragment>
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

function SeatCell({ cell, rowLabel, status, disabled, onToggle }) {
    if (cell.type === 'aisle') {
        return <div aria-hidden="true" />;
    }

    const label = `Fila ${rowLabel}, Butaca ${cell.seatInRow}`;

    return (
        <button
            type="button"
            disabled={disabled}
            aria-pressed={status === 'selected'}
            aria-label={label}
            title={label}
            onClick={() => onToggle(cell.globalNumber)}
            className={`seat seat--${status}`}
        >
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

function useSeatSelection(showingEntity, options) {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const maxSeats = options?.maxSeatsPerPurchase ?? Infinity;

    useEffect(() => {
        setSelectedSeats((prev) =>
            prev.filter((seatNumber) => showingEntity.isSeatAvailable(seatNumber))
        );
    }, [showingEntity]);

    const toggleSeat = useCallback(
        (seatNumber) => {
            setSelectedSeats((prev) => {
                const selection = createSelectionFromState(showingEntity, prev, maxSeats);

                if (prev.includes(seatNumber)) {
                    selection.toggle(seatNumber);
                    return selection.selectedSeats;
                }

                if (!selection.canAddNewSeat(seatNumber)) {
                    return prev;
                }

                selection.toggle(seatNumber);
                return selection.selectedSeats;
            });
        },
        [showingEntity, maxSeats]
    );

    const clearSelection = useCallback(() => {
        setSelectedSeats([]);
    }, []);

    const getSeatStatus = useCallback(
        (seatNumber) => {
            if (!showingEntity.isSeatAvailable(seatNumber)) return 'sold';
            if (selectedSeats.includes(seatNumber)) return 'selected';
            return 'available';
        },
        [showingEntity, selectedSeats]
    );

    const isSeatDisabled = useCallback(
        (seatNumber) => {
            if (!showingEntity.isSeatAvailable(seatNumber)) return true;
            if (selectedSeats.includes(seatNumber)) return false;
            return selectedSeats.length >= maxSeats;
        },
        [showingEntity, selectedSeats, maxSeats]
    );

    return {
        selectedSeats,
        toggleSeat,
        clearSelection,
        getSeatStatus,
        isSeatDisabled,
    };
}

function createSelectionFromState(showingEntity, currentSeats, maxSeats) {
    const selection = new SeatSelection(showingEntity, { maxSeatsPerPurchase: maxSeats });
    for (const seatNumber of currentSeats) {
        if (selection.canAddNewSeat(seatNumber)) {
            selection.toggle(seatNumber);
        }
    }
    return selection;
}

function buildRowLabels(rowsCount) {
    return Array.from({ length: rowsCount }, (_, index) =>
        `F${String(index + 1).padStart(2, '0')}`
    );
}

function buildSeatsMatrix(auditorium) {
    const perRow = auditorium.seatsPerRow;

    return Array.from({ length: auditorium.rowsCount }, (_, rowIndex) => {
        const rowNumber = rowIndex + 1;
        const cells = [];
        let currentGlobal = rowIndex * perRow + 1;
        let currentInRow = 1;

        auditorium.rowsLayout.forEach((seatsInBlock, blockIndex) => {
            for (let i = 0; i < seatsInBlock; i++) {
                const globalNumber = currentGlobal++;
                cells.push({
                    type: 'seat',
                    id: `seat-${globalNumber}`,
                    globalNumber,
                    seatInRow: currentInRow++,
                    rowNumber,
                });
            }

            if (blockIndex < auditorium.rowsLayout.length - 1) {
                cells.push({
                    type: 'aisle',
                    id: `aisle-${rowNumber}-${blockIndex}`,
                });
            }
        });

        return cells;
    });
}

function buildSeatsGridTemplate(rowsLayout) {
    return rowsLayout
        .map((blockSize) => `repeat(${blockSize}, minmax(0, 1fr))`)
        .join(' var(--aisle-width) ');
}

function buildSeatLabelsMap(seatsMatrix) {
    const map = new Map();

    seatsMatrix.forEach((rowCells, rowIndex) => {
        const rowLabel = `F${String(rowIndex + 1).padStart(2, '0')}`;
        for (const cell of rowCells) {
            if (cell.type === 'seat') {
                map.set(cell.globalNumber, `${rowLabel}-${cell.seatInRow}`);
            }
        }
    });

    return map;
}