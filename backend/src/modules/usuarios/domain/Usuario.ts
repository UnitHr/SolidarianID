
export interface UserProps {
    id: number;
    firstName: string;
    lastName: string;
    age: number;

}

export class User {

    protected constructor(private props: UserProps) {
    }

    get id(): number {
        return this.props.id;
    }

    get firstName(): string {
        return this.props.firstName;
    }

    get lastName(): string {
        return this.props.lastName;
    }

    get age(): number {
        return this.props.age;
    }

    public static create(props: UserProps): User {
        return new User(props);
    }

}