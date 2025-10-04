import { RetryMechanism } from "../contract/retry.contract";

export class BackoffMechanism implements RetryMechanism {
  async execute<T>(fn: () => Promise<T>, retries = 10): Promise<T> {
    let attempt = 0;
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    while (attempt < retries) {
      try {
        return await fn();
      } catch (error) {
        attempt++;
        if (attempt >= retries) throw error;
        await delay(2 ** attempt * 100); 
      }
    }

    throw new Error("all retries failed");
  }
}
