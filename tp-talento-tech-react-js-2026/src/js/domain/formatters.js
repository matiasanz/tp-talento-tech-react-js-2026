export function formatDateTime(dateTime) {
    const date = new Date(dateTime);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month} ${hours}:${minutes} hs`;
}

export function formatDateTimeToLocalISO(dateInput) {
    if (!dateInput) return "";

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";

    const pad = (num) => String(Math.floor(Math.abs(num))).padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const offsetHours = pad(offsetMinutes / 60);
    const offsetMins = pad(offsetMinutes % 60);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMins}`;
}


export function formatDuration(durationMinutes){
    const hours = Math.floor(durationMinutes/60).toString()
    const minutes = (durationMinutes%60).toString().padStart(2, '0')

    return `${hours} ${hours==1? 'h': 'hs'} ${minutes} m`
}
