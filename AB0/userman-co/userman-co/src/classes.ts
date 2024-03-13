//--- Class representing a user
export class User {
	private static userCounter: number = 1;  // unique user id
	public id: number;
	public firstName: string;
	public lastName: string;
	public creationTime: Date;
	public pet: Pets

	constructor(firstName: string, lastName: string, creationTime: Date, pet?:Pets) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.creationTime = creationTime;
		this.id = User.userCounter++;
		this.pet=pet;
	}
}

//--- Class representing a user list
export class UserList {
	private users: User[]; // using array to store user list

	constructor() {
		this.users = [];
	}

	getUsers(): User[] {
		return this.users;
	}

	addUser(user: User) {
		this.users.push(user);
	}

	deleteUser(userId: number): boolean {
		let found: boolean = false;
		// Create a new array without the user to delete
		this.users = this.users.filter((user: User): boolean => {
			if (user.id === userId) {
				found = true;
				return false; // not to be copied
			} else {
				return true; // to be copied
			}
		});
		return found;
	}

	getUser(userId: number): User {
		// iterate through userList until user found (or end of list)
		for (const user of this.users) {
			if (userId === user.id) {
				return (user);  // leave function with "user" when found
			}
		}
		return null; // leave function with "null" when not found
	}

	editUser(userId: number, firstName: string, lastName: string): boolean {
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
	 searchUser(sortWert:string){
		this.users= this.users.filter((user: User)  => {
	if (user.firstName.indexOf(sortWert) >=0||user.lastName.indexOf(sortWert) >=0 ){
		//springt nicht in den Return rein
		return user;
	}
		})
		 return this.users
	}
	sortUser(sortWert:string){



	}
}
	export class Pets {
	public petName: string;
	public petBirth: number;
	public petSex: string;

	constructor(petName:string, petBirth:number,petSex:string) {
		this.petName=petName;
		this.petBirth=petBirth;
		this.petSex=petSex;
	}
}
export class petListe{
	private pets: Pets[];
	constructor() {

		{this.pets= [];}
	}

}
