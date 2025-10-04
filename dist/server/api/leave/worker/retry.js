"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackoffMechanism = void 0;
class BackoffMechanism {
    async execute(fn, retries = 10) {
        let attempt = 0;
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        while (attempt < retries) {
            try {
                return await fn();
            }
            catch (error) {
                attempt++;
                if (attempt >= retries)
                    throw error;
                await delay(2 ** attempt * 100);
            }
        }
        throw new Error("all retries failed");
    }
}
exports.BackoffMechanism = BackoffMechanism;
