// retry mechanism contract

export interface RetryMechanism {
  execute<T>(fn: () => Promise<T>, retries?: number): Promise<T>;
}
