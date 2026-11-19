export class Showing {
    constructor({ id, dateTime, movieId, auditorium, soldSeats = [] }) {
        if (!id) throw new Error('Showing must have an id.');
        if (!movieId) throw new Error('Showing must have a movieId.');
        if (!auditorium) throw new Error('Showing must have an assigned auditorium.');

        this.id = id;
        this.dateTime = dateTime instanceof Date ? dateTime : new Date(dateTime);
        this.movieId = movieId;
        this.auditorium = auditorium instanceof Auditorium? auditorium: new Auditorium(auditorium);
        this._soldSeats = new Set(soldSeats);
        this._availableSeatsCount = this.auditorium.totalCapacity - this._soldSeats.size;
    }

    get soldSeats() {
        return Array.from(this._soldSeats).sort((a, b) => a - b);
    }

    get availableSeatsCount() {
        return this._availableSeatsCount;
    }

    get isSoldOut() {
        return this._availableSeatsCount <= 0;
    }

    isSeatAvailable(seatNumber) {
        const isValidSeat =
            Number.isInteger(seatNumber) &&
            seatNumber >= 1 &&
            seatNumber <= this.auditorium.totalCapacity;

        if (!isValidSeat) return false;
        return !this._soldSeats.has(seatNumber);
    }

    sellSeats(seatNumbers) {
        if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
            throw new Error('At least one seat number must be provided.');
        }

        for (const seat of seatNumbers) {
            if (!this.isSeatAvailable(seat)) {
                throw new Error(`Seat ${seat} is invalid or already sold.`);
            }
        }

        for (const seat of seatNumbers) {
            this._soldSeats.add(seat);
        }

        this._availableSeatsCount = this.auditorium.totalCapacity - this._soldSeats.size;
    }
}

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
        this.rowsLayout = [...rowsLayout];
        this.rowsCount = rowsCount;

        this._seatsPerRow = this.rowsLayout.reduce((acc, seats) => acc + seats, 0);
        this._totalCapacity = this._seatsPerRow * this.rowsCount;
    }

    get seatsPerRow() {
        return this._seatsPerRow;
    }

    get totalCapacity() {
        return this._totalCapacity;
    }
}

export class SeatSelection {
    constructor(showing, options = {}) {
        this.showing = showing;
        this.maxSeats = options.maxSeatsPerPurchase ?? Infinity;
        this._selectedSeats = new Set();
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

    toggle(seatNumber) {
        if (this._selectedSeats.has(seatNumber)) {
            this._selectedSeats.delete(seatNumber);
            return
        }

        if(!this.canAddNewSeat(seatNumber))
            throw new Error('tried to add invalid seat')

        this._selectedSeats.add(seatNumber);
    }

    clear() {
        this._selectedSeats.clear();
    }

    canAddNewSeat(seatNumber) {
        return this.showing.isSeatAvailable(seatNumber) && (this._selectedSeats.size < this.maxSeats)
    }
}