export abstract class PubSubService {
  abstract publish(trigger: string, payload: unknown): Promise<void>;

  abstract asyncIterator<T>(triggers: string | string[]): AsyncIterator<T>;
}
