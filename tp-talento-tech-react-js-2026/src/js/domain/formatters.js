export function formatDateTime(dateTime) {
    const date = new Date(dateTime);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month} ${hours}:${minutes} hs`;
}

export function formatDateTimeToLocalISO(dateTimeString) {
    if (!dateTimeString) return "";
    
    const date = new Date(dateTimeString);
    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const nDigits = (number, digits) => String(Math.floor(Math.abs(number))).padStart(digits, "0");

    const hours = nDigits(offsetMinutes / 60, 2);
    const minutes = nDigits(offsetMinutes % 60, 2);

    return `${dateTimeString}:00${sign}${hours}:${minutes}`;
}


export function formatDuration(durationMinutes){
    const hours = Math.floor(durationMinutes/60).toString()
    const minutes = (durationMinutes%60).toString().padStart(2, '0')

    return `${hours} ${hours==1? 'h': 'hs'} ${minutes} m`
}
