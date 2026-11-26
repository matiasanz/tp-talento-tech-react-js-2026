export class Auditorium {
    constructor({ id, name, rowsLayout, rowsCount }) {
        if (!id || !name) throw new Error('Auditorium must have an id and a name.');
        if (!Array.isArray(rowsLayout) || rowsLayout.length === 0) {
            throw new Error('rowsLayout must be a valid non-empty array.');
        }
        if (!rowsCount || rowsCount <= 0) {
            throw new Error('rowsCount must be greater than 0.');
        }

        this.id = id;
        this.name = name;
        this.rowsLayout = Object.freeze([...rowsLayout]);
        this.rowsCount = rowsCount;

        this._seatsPerRow = this.rowsLayout.reduce((acc, seats) => acc + seats, 0);
        this._totalCapacity = this._seatsPerRow * this.rowsCount;

        Object.freeze(this);
    }

    get seatsPerRow() {
        return this._seatsPerRow;
    }

    get totalCapacity() {
        return this._totalCapacity;
    }
}

export class Showing {
    constructor({ id, dateTime, movieId, auditorium, soldSeats = [] }, {skipId = false}) {
        if (!skipId && !id) throw new Error('Showing must have an id.');
        if (!movieId) throw new Error('Showing must have a movieId.');
        if (!auditorium) throw new Error('Showing must have an assigned auditorium.');

        this.id = id;
        this.dateTime = dateTime instanceof Date ? dateTime : new Date(dateTime);
        this.movieId = movieId;
        this.auditorium = auditorium instanceof Auditorium ? auditorium : new Auditorium(auditorium);
        this._soldSeats = new Set(soldSeats);

        Object.freeze(this);
    }

    get soldSeats() {
        return Array.from(this._soldSeats).sort((a, b) => a - b);
    }

    get availableSeatsCount() {
        return this.auditorium.totalCapacity - this._soldSeats.size;
    }

    get isSoldOut() {
        return this.availableSeatsCount <= 0;
    }

    isSeatAvailable(seatNumber) {
        return (
            Number.isInteger(seatNumber) &&
            seatNumber >= 1 &&
            seatNumber <= this.auditorium.totalCapacity &&
            !this._soldSeats.has(seatNumber)
        );
    }
}

export class SeatSelection {
    constructor(showing, maxSeats = Infinity, initialSeats = []) {
        this.showing = showing;
        this.maxSeats = maxSeats;
        this._selectedSeats = new Set(
            [...initialSeats]
                .filter((seat) => showing.isSeatAvailable(seat))
                .slice(0, maxSeats)
        );

        Object.freeze(this);
    }

    get selectedSeats() {
        return Array.from(this._selectedSeats).sort((a, b) => a - b);
    }

    get count() {
        return this._selectedSeats.size;
    }

    get isEmpty() {
        return this.count === 0;
    }

    hasSeat(seatNumber) {
        return this._selectedSeats.has(seatNumber);
    }

    canAddNewSeat(seatNumber) {
        return this.showing.isSeatAvailable(seatNumber) && this._selectedSeats.size < this.maxSeats;
    }

    toggle(seatNumber) {
        const nextSeats = new Set(this._selectedSeats);

        if (nextSeats.has(seatNumber)) {
            nextSeats.delete(seatNumber);
            return new SeatSelection(this.showing, this.maxSeats, nextSeats);
        }

        if (!this.canAddNewSeat(seatNumber)) {
            return this;
        }

        nextSeats.add(seatNumber);
        return new SeatSelection(this.showing, this.maxSeats, nextSeats);
    }

    clear() {
        if (this.isEmpty) return this;
        return new SeatSelection(this.showing, this.maxSeats);
    }

    syncWithShowing(nextShowing, nextMaxSeats = this.maxSeats) {
        if (this.showing === nextShowing && this.maxSeats === nextMaxSeats) {
            return this;
        }

        return new SeatSelection(nextShowing, nextMaxSeats, this._selectedSeats);
    }
}
