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
        this.rowsLayout = rowsLayout;
        this.rowsCount = rowsCount;
    }
    

    // Calculates the number of seats per row (e.g., 2 + 4 + 2 = 8)
    get seatsPerRow() {
        return this.rowsLayout.reduce((acc, seats) => acc + seats, 0);
    }

    // Calculates the total seating capacity (e.g., 8 * 12 = 96)
    get totalCapacity() {
        return this.seatsPerRow * this.rowsCount;
    }

    // Returns a plain object representation
    toPlainObject() {
        return {
            id: this.id,
            name: this.name,
            rowsLayout: [...this.rowsLayout],
            rowsCount: this.rowsCount
        };
    }
}

export class Showing {
    constructor({ id, dateTime, movieId, auditorium, soldSeats = [] }) {
        if (!id) throw new Error('Showing must have an id.');
        if (!movieId) throw new Error('Showing must have a movieId.');
        if (!auditorium) throw new Error('Showing must have an assigned auditorium.');

        this.id = id;
        this.dateTime = dateTime instanceof Date ? dateTime : new Date(dateTime);
        this.movieId = movieId;
        this.auditorium = auditorium instanceof Auditorium? auditorium: new Auditorium(auditorium);
        
        // Use a Set internally to prevent duplicates and enable O(1) lookups
        this._soldSeats = new Set(soldSeats);
    }

    // Returns sold seat numbers sorted in ascending order
    get soldSeats() {
        return Array.from(this._soldSeats).sort((a, b) => a - b);
    }

    // Returns the number of remaining available seats
    get availableSeatsCount() {
        return this.auditorium.totalCapacity - this._soldSeats.size;
    }

    // Checks whether all seats have been sold
    get isSoldOut() {
        return this.availableSeatsCount <= 0;
    }

    // Checks if a seat number exists within the auditorium and is not sold
    isSeatAvailable(seatNumber) {
        const isValidSeat = Number.isInteger(seatNumber) && 
                            seatNumber >= 1 && 
                            seatNumber <= this.auditorium.totalCapacity;
        if (!isValidSeat) return false;
        return !this._soldSeats.has(seatNumber);
    }

    // Business rule: sells a list of seats after validating their availability
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
    }

    // Serializes the entity into a plain object ready for Firestore persistence
    toPersistence() {
        return {
            id: this.id,
            dateTime: this.dateTime.toISOString(),
            movieId: this.movieId,
            auditorium: this.auditorium.toPlainObject(),
            soldSeats: this.soldSeats
        };
    }

    // Reconstructs the domain entity from a raw Firestore document
    static fromPersistence(data) {
        // Supports both native Firestore Timestamps and ISO date strings
        const parsedDate = data.dateTime && typeof data.dateTime.toDate === 'function'?
            data.dateTime.toDate(): new Date(data.dateTime);

        return new Showing({
            id: data.id,
            dateTime: parsedDate,
            movieId: data.movieId,
            auditorium: data.auditorium,
            soldSeats: data.soldSeats || []
        });
    }
}

export { Showing, Auditorium };
