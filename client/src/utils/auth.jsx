//toDo: tõstsin hetkel auth'i eraldi komponendiks. vist hea praktika ?



export const auth = {
    isAuthenticated: (keyType) => {
        try {
            const stored = sessionStorage.getItem(keyType);
            if (!stored) return false;

            const {timestamp, expiresIn} = JSON.parse(stored);
            return Date.now() - timestamp < expiresIn;
        } catch {
            return false;
        }
    },

    logout: (keyType) => {
        sessionStorage.removeItem(keyType);
    },

    getStoredKey: (keyType) => {
        try {
            const stored = sessionStorage.getItem(keyType);
            if (!stored) return null;

            const {key} = JSON.parse(stored);
            return key;
        } catch {
            return null;
        }
    }
};
