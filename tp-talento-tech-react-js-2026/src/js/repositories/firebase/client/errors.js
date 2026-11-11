// Errors
export class ConflictError extends Error {
     constructor(msg = "Este registro ya existe.") { super(msg); this.name = 'ConflictError'; }
}
export class PermissionError extends Error {
     constructor(msg = "No tienes autorización para realizar esta acción.") { super(msg); this.name = 'PermissionError'; }
}
export class TooManyRequestsError extends Error {
     constructor(msg = "Límite de solicitudes excedido. Intenta de nuevo más tarde.") { super(msg); this.name = 'TooManyRequestsError'; }
}
export class TimeoutError extends Error {
     constructor(msg = "La operación superó el tiempo límite de espera.") { super(msg); this.name = 'TimeoutError'; }
}
export class OfflineError extends Error {
     constructor(msg = "No se pudo establecer conexión. Verifica tu internet.") { super(msg); this.name = 'OfflineError'; }
}
export class NotFoundError extends Error {
     constructor(msg = "El registro solicitado no existe.") { super(msg); this.name = 'NotFoundError'; }
}
export class ConfigurationError extends Error {
     constructor(msg = "Error de configuración en la base de datos.") { super(msg); this.name = 'ConfigurationError'; }
}
export class BadGatewayError extends Error {
     constructor(code, msg) { super(`Error de infraestructura (${code}): ${msg}`); this.name = 'BadGatewayError'; }
}

// Handlers
export function handleCreateError(error) {
     const msg = error.message || 'Error al crear';
     switch (error.code) {
        case 'already-exists': throw new ConflictError();
        case 'permission-denied':
        case 'unauthenticated': throw new PermissionError();
        case 'resource-exhausted': throw new TooManyRequestsError();
        case 'deadline-exceeded': throw new TimeoutError();
        case 'unavailable': throw new OfflineError();
        default: throw new BadGatewayError(error.code, msg);
     }
}

export function handleUpdateError(error) {
    const msg = error.message || 'Error al actualizar';
    switch (error.code) {
        case 'not-found': throw new NotFoundError("El registro que intentas modificar no existe.");
        case 'permission-denied':
        case 'unauthenticated': throw new PermissionError();
        case 'resource-exhausted': throw new TooManyRequestsError();
        case 'deadline-exceeded': throw new TimeoutError();
        case 'unavailable': throw new OfflineError();
        default: throw new BadGatewayError(error.code, msg);
     }
}

export function handleReadError(error) {
     const msg = error.message || 'Error al leer';
     switch (error.code) {
        case 'not-found': throw new NotFoundError();
        case 'failed-precondition': throw new ConfigurationError("La consulta requiere crear un índice compuesto.");
        case 'permission-denied':
        case 'unauthenticated': throw new PermissionError();
        case 'resource-exhausted': throw new TooManyRequestsError();
        case 'deadline-exceeded': throw new TimeoutError();
        case 'unavailable': throw new OfflineError();
        default: throw new BadGatewayError(error.code, msg);
     }
}

export function handleDeleteError(error) {
     const msg = error.message || 'Error al eliminar';
     switch (error.code) {
        case 'permission-denied':
        case 'unauthenticated': throw new PermissionError();
        case 'resource-exhausted': throw new TooManyRequestsError();
        case 'deadline-exceeded': throw new TimeoutError();
        case 'unavailable': throw new OfflineError();
        default: throw new BadGatewayError(error.code, msg);
     }
}
