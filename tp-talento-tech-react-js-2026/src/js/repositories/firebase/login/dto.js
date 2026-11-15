export class AuthResponseDto {
    constructor(data) {
        this.user = data.user ? {
            uid: data.user.uid,
            email: data.user.email,
            emailVerified: data.user.emailVerified,
            isAnonymous: data.user.isAnonymous,
            providerData: data.user.providerData?.map(p => ({
            providerId: p.providerId,
            uid: p.uid,
            displayName: p.displayName,
            email: p.email,
            phoneNumber: p.phoneNumber,
            photoURL: p.photoURL
            })) || [],
            stsTokenManager: {
            refreshToken: data.user.stsTokenManager?.refreshToken,
            accessToken: data.user.stsTokenManager?.accessToken,
            expirationTime: data.user.stsTokenManager?.expirationTime
            },
            createdAt: data.user.createdAt,
            lastLoginAt: data.user.lastLoginAt,
            apiKey: data.user.apiKey,
            appName: data.user.appName
        } : null;

        this.providerId = data.providerId || null;
        this._tokenResponse = data._tokenResponse ? {
            kind: data._tokenResponse.kind,
            localId: data._tokenResponse.localId,
            email: data._tokenResponse.email,
            displayName: data._tokenResponse.displayName,
            idToken: data._tokenResponse.idToken,
            registered: data._tokenResponse.registered,
            refreshToken: data._tokenResponse.refreshToken,
            expiresIn: data._tokenResponse.expiresIn
        } : null;

        this.operationType = data.operationType;
    }


    
    toSafeJSON() {
        const clone = JSON.parse(JSON.stringify(this));
        
        // Ocultar tokens sensibles si se van a imprimir en logs
        if (clone.user?.stsTokenManager) {
            clone.user.stsTokenManager.accessToken = "[REDACTED]";
            clone.user.stsTokenManager.refreshToken = "[REDACTED]";
        }
        if (clone._tokenResponse) {
            clone._tokenResponse.idToken = "[REDACTED]";
            clone._tokenResponse.refreshToken = "[REDACTED]";
        }

        return clone;
    }
    
    validate() {
        const errors = [];

        // Validate 'user'
        const user = this.user 
        if (!user || typeof user !== 'object') {
            errors.push('Falta el objeto "user" o no tiene el formato correcto.');
        } else {
            if (!user.uid || typeof user.uid !== 'string') {
                errors.push('El campo "user.uid" es obligatorio y debe ser un string.');
            }
            if (!user.email || typeof user.email !== 'string') {
                errors.push('El campo "user.email" es obligatorio y debe ser un string.');
            }
            if (typeof user.emailVerified !== 'boolean') {
                errors.push('El campo "user.emailVerified" debe ser un booleano.');
            }
            
            // Validate stsTokenManager
            if (!user.stsTokenManager || typeof user.stsTokenManager !== 'object') {
                errors.push('Falta el objeto "user.stsTokenManager".');
            } else {
                if (!user.stsTokenManager.accessToken) {
                    errors.push('Falta el token de acceso ("user.stsTokenManager.accessToken").');
                }
                if (!this.user.stsTokenManager.refreshToken) {
                    errors.push('Falta el token de refresco ("user.stsTokenManager.refreshToken").');
                }
            }
        }

        // Validate '_tokenResponse'
        if (!this._tokenResponse || typeof this._tokenResponse !== 'object') {
            errors.push('Falta el objeto "_tokenResponse" o no tiene el formato correcto.');
        } else {
            if (!this._tokenResponse.idToken) {
                errors.push('Falta el token de identidad ("_tokenResponse.idToken").');
            }
        }

        // Validate 'operationType'
        if (!this.operationType || typeof this.operationType !== 'string') {
            errors.push('El campo "operationType" es obligatorio y debe ser un string.');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}