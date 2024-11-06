export abstract class Repo<T> {

    abstract save(entity: T): void;
    abstract delete(id: string): void;
    abstract findById(id: string): Promise<T>;
}