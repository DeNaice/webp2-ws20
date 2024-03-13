// Class representing a user
export class User {

    public id: number;
    public firstName: string;
    public lastName: string;
    public creationTime: Date;

    constructor(id: number,firstName: string, lastName: string, creationTime: Date) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.creationTime = creationTime;
        this.id = id;
    }
}

// Class representing a user list
export class UserList {
    private users: User[]; // using array to store user list

    constructor() { this.users = []; }

    getUsers() : User[] { return this.users; }
    addUser(user: User) { this.users.push(user); }
    deleteUser(userId: number) : boolean { // Create a new array without the user to delete
        let found : boolean = false;
        this.users = this.users.filter( (user : User) : boolean => {
            if (user.id === userId) {
                found = true;
                return false; // not to be copied
            } else {
                return true; // to be copied
            }
        } );
        return found;
    }
    getUser(userId: number) : User {
        // iterate through userList until user found (or end of list)
        for (const user of this.users) {
            if (userId === user.id ) {
                return (user);  // leave function with "user" when found
            }
        }
        return null; // leave function with "null" when not found
    }
    editUser(userId: number, firstName: string, lastName: string) : boolean {
        // iterate through userList until user found (or end of list)
        for (const user of this.users) {
            if (user.id === userId) {
                user.firstName = firstName;
                user.lastName = lastName;
                return true;  // leave function with "true" when found
            }
        }
        return false  // leave function with "False" when found
    }
}
