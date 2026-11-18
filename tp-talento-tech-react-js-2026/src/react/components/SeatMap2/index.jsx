import { useState, useMemo, useCallback } from 'react';
import { Showing } from '../../../js/domain/showings';
import './SeatMap.css';

// ==========================================
// 1. HELPER DE PRESENTACIÓN (CSS Grid)
// ==========================================
const ROW_LABEL_WIDTH = '0.5fr';
const AISLE_WIDTH = '0.35fr';

function buildGridTemplate(rowsLayout) {
    const seatsAndAisles = rowsLayout
        .map((blockSize) => `repeat(${blockSize}, minmax(0, 1fr))`)
        .join(` ${AISLE_WIDTH} `);

    return `${ROW_LABEL_WIDTH} ${seatsAndAisles}`;
}

// ==========================================
// 2. CUSTOM HOOK (Lógica de selección)
// ==========================================
function useSeatSelection(showingEntity) {
    const [selectedSeats, setSelectedSeats] = useState([]);

    const toggleSeat = useCallback((globalNumber) => {
        if (!showingEntity.isSeatAvailable(globalNumber)) return;

        setSelectedSeats((prev) =>
            prev.includes(globalNumber)
                ? prev.filter((n) => n !== globalNumber)
                : [...prev, globalNumber].sort((a, b) => a - b)
        );
    }, [showingEntity]);

    const getSeatStatus = useCallback((globalNumber) => {
        if (!showingEntity.isSeatAvailable(globalNumber)) return 'sold';
        if (selectedSeats.includes(globalNumber)) return 'selected';
        return 'available';
    }, [showingEntity, selectedSeats]);

    return {
        selectedSeats,
        toggleSeat,
        getSeatStatus,
    };
}

// ==========================================
// 3. SUBCOMPONENTES DE INTERFAZ (UI)
// ==========================================
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

function SeatCell({ cell, rowNumber, status, onToggle }) {
    if (cell.type === 'aisle') {
        return <div aria-hidden="true" />;
    }

    return (
        <button
            type="button"
            disabled={status === 'sold'}
            onClick={() => onToggle(cell.globalNumber)}
            title={`Row ${rowNumber} - Seat ${cell.seatInRow}`}
            className={`seat seat--${status}`}
        >
            {cell.seatInRow}
        </button>
    );
}

function SeatRow({ row, rowIndex, gridTemplateColumns, getSeatStatus, onToggleSeat }) {
    return (
        <div
            className="seat-map__row"
            style={{ gridTemplateColumns }}
        >
            <span className="seat-map__row-label">{row.rowLabel}</span>

            {row.cells.map((cell) => (
                <SeatCell
                    key={cell.id}
                    cell={cell}
                    rowNumber={rowIndex + 1}
                    status={getSeatStatus(cell.globalNumber)}
                    onToggle={onToggleSeat}
                />
            ))}
        </div>
    );
}

function SeatFooter({ selectedSeats, availableCount, isSoldOut, onConfirm, rowSeatsCount }) {
    const hasSelection = selectedSeats.length > 0;

    return (
        <div className="seat-map__footer">
            <p className="seat-map__summary">
                {isSoldOut ? (
                    <span className="seat-map__sold-out">Función agotada</span>
                ) : hasSelection ? (
                    <>
                        Butacas seleccionadas: <strong>{}{selectedSeats.map(s=>`F${Math.ceil(s/rowSeatsCount)}-${s%rowSeatsCount||rowSeatsCount}`).join(', ')}</strong> ({selectedSeats.length})
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

// ==========================================
// 4. COMPONENTE PRINCIPAL
// ==========================================
export function SeatMap({ showing, onConfirmPurchase }) {
    const showingEntity = useMemo(
        () => (showing instanceof Showing ? showing : new Showing(showing)),
        [showing]
    );

    const { auditorium } = showingEntity;
    const { selectedSeats, toggleSeat, getSeatStatus } = useSeatSelection(showingEntity);

    const rowSeatsCount = auditorium.rowsLayout.reduce((a, b)=>a+b, 0)

    const rows = useMemo(
        () => auditorium.buildLayout(),
        [auditorium]
    );

    const gridTemplateColumns = useMemo(
        () => buildGridTemplate(auditorium.rowsLayout),
        [auditorium.rowsLayout]
    );

    const handleConfirm = () => {
        onConfirmPurchase(showingEntity.id, selectedSeats);
    };

    return (
        <div className="seat-map">
            <h3>Sala {auditorium.name}</h3>
            <SeatLegend />
        
            <div className="seat-map__screen">PANTALLA</div>
            <div className="seat-map__grid">
                {rows.map((row, index) => (
                    <SeatRow
                        key={index}
                        row={row}
                        rowIndex={index}
                        gridTemplateColumns={gridTemplateColumns}
                        getSeatStatus={getSeatStatus}
                        onToggleSeat={toggleSeat}
                    />
                ))}
            </div>
            
            <SeatFooter
                selectedSeats={selectedSeats}
                availableCount={showingEntity.availableSeatsCount}
                isSoldOut={showingEntity.isSoldOut}
                onConfirm={handleConfirm}
                rowSeatsCount={rowSeatsCount}
            />
        </div>
    );
}
