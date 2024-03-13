import {User, UserList, Pets}  from './classes.js'

// Ist das die aktuelle?

/****************************************************************************
* global variables                                                          *
*****************************************************************************/
const userList: UserList = new UserList();


/*****************************************************************************
 * Event Handlers (callbacks)                                                *
 *****************************************************************************/
function addUser(event) {
	// Prevent the default behaviour of the browser (reloading the page)
	event.preventDefault();

	// Define JQuery HTML objects
	const addUserForm: JQuery = $('#add-user-form');
	const firstNameField: JQuery = $('#add-first-name-input');
	const lastNameField: JQuery = $('#add-last-name-input');
	const petNameField: JQuery = $('#add-pet-name-input');
	const petBirthField: JQuery = $('#add-birth-date-input');
	const petSexField: JQuery = $('#add-pet-sex-input');

	// Read values from input fields
	const firstName: string = firstNameField.val().toString().trim();
	const lastName: string = lastNameField.val().toString().trim();
	const petName: string = petNameField.val().toString().trim();
	const petBirth: number = Number(petBirthField.val());
	const petSex: string = petSexField.val().toString().trim();

	// Check if all required fields are filled in
	if (firstName && lastName) {
		if (petName && petBirth && petSex){

		// Create new user with Pet and add it to userList
		userList.addUser(new User(firstName, lastName, new Date(),new Pets(petName, petBirth, petSex)));
		console.log(userList);
		} else{
			userList.addUser(new User(firstName, lastName, new Date()));
		}
		// Reset form by triggering "reset"-event // Input For wird geleert
		addUserForm.trigger('reset');
		// Render message and user list
		renderMessage('User created');
		renderUserList(userList.getUsers());
	} else {
		renderMessage('Not all mandatory fields are filled in');
	}
}

function editUser(event) {
	// Prevent the default behaviour of the browser (reloading the page)
	event.preventDefault();

	// Define JQuery HTML objects
	const editModal: JQuery = $('#edit-user-modal');
	const editUserForm: JQuery = $('#edit-user-form');
	const firstNameInput: JQuery = $('#edit-first-name-input');
	const lastNameInput: JQuery = $('#edit-last-name-input');
	const idHiddenInput: JQuery = $('#edit-id-input');

	// Read values from input fields
	const userId: number = Number(idHiddenInput.val().toString().trim());
	const firstName: string = firstNameInput.val().toString().trim();
	const lastName: string = lastNameInput.val().toString().trim();

	if (firstName && lastName) {
		if (userList.editUser(userId, firstName, lastName)) {
			// Clear form and close modal
			editUserForm.trigger('reset');
			editModal.modal('hide');
			// Render message and user list
			renderMessage(`Successfully updated user ${firstName} ${lastName}`);
			renderUserList(userList.getUsers());
		} else { // The user could not be found, send error response
			renderMessage('The user to be updated could not be found');
		}
	} else { // Either firstName or lastName is missing
		renderMessage('Not all mandatory fields are filled in');
	}
}

function deleteUser(event) {
	// Get user id from button attribute 'data-user-id'
	const userId: number = $(event.currentTarget).data('user-id');
	// delete user and render message
	if (userList.deleteUser(userId)) {
		renderMessage('User deleted');
	} else {
		renderMessage('The user to be deleted could not be found');
	}
	// render user list
	renderUserList(userList.getUsers());
}

function openEditUserModal(event) {
	// Get user id from button attribute 'data-user-id'
	const userId: number = $(event.currentTarget).data('user-id');

	// Search user in userList and show it in modal edit window
	let user: User = userList.getUser(userId);
	if (user !== null) { // user with userIds found in userList
		renderEditUserModal(user);
	} else { // user with userId not found in userList
		renderMessage('The selected user can not be found');
	}
}
function searchUser(){

	let sortString: string = String($("#sorttable").val());
	renderUserList(userList.searchUser(sortString))
}
function sortUser(sort:string){

}

/*****************************************************************************
 * Render functions                                                          *
 *****************************************************************************/
function renderMessage(message: string) {
	// Define JQuery HTML Objects
	const messageWindow: JQuery = $('#messages');

	// Create new alert
	const newAlert: JQuery = $(`
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `);

	// Add message to DOM
	messageWindow.append(newAlert);

	// Auto-remove message after 5 seconds (5000ms)
	setTimeout(() => {
		newAlert.alert('close');
	}, 5000);
}

function renderUserList(userList: User[]) {
	// Define JQuery HTML objects
	const userTableBody: JQuery = $('#user-table-body');

	// Delete the old table of users from the DOM
	userTableBody.empty();
	// For each user create a row and append it to the user table
	for (const user of userList) {
		// Create html table row element...
		const tableEntry: JQuery = $(`
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>
                    <button class="btn btn-outline-dark btn-sm edit-user-button mr-4" data-user-id="${user.id}" >
                        <i class="fa fa-pen" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-outline-dark btn-sm delete-user-button" data-user-id="${user.id}">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                </td>
            </tr>
        `);

		// ... and append it to the table's body
		userTableBody.append(tableEntry);
	}
}

function renderEditUserModal(user: User) {
	// Define JQuery HTML objects
	const editUserModal: JQuery = $('#edit-user-modal');
	const editIdInput: JQuery = $('#edit-id-input'); // Hidden field for saving the user's id
	const editFirstNameInput: JQuery = $('#edit-first-name-input');
	const editLastNameInput: JQuery = $('#edit-last-name-input');

	// Fill in edit fields in modal
	editIdInput.val(user.id);
	editFirstNameInput.val(user.firstName);
	editLastNameInput.val(user.lastName);

	// Show modal
	editUserModal.modal('show');
}
function renderStatisticModal(){
	const PetModal: JQuery = $("#pet-modal")
	let anzahlHaustiere: number =0;
	let aeltestesHaustier: Pets =userList.getUsers()[0].pet;
	let durchschnittsalter: number=0;
	let Jahr: number = new Date().getFullYear()
	for (let i=0; i<userList.getUsers().length;i++){
		if (userList.getUsers()[i].pet){
			anzahlHaustiere++;
			if (aeltestesHaustier.petBirth > userList.getUsers()[i].pet.petBirth){
				aeltestesHaustier = userList.getUsers()[i].pet;

			}
			durchschnittsalter= durchschnittsalter + Jahr - userList.getUsers()[i].pet.petBirth
		}

	}
	durchschnittsalter = durchschnittsalter/anzahlHaustiere;
	console.log(anzahlHaustiere, aeltestesHaustier, durchschnittsalter);
	$("#anzahlHaustiere").html("Die Anzahl der Haustiere beträgt: " + anzahlHaustiere);
	$("#aeltestesHaustier").html("Das Aelteste Haustier ist: " + aeltestesHaustier.petName);
	$("#durchschnittsalter").html("Das Durchschnittsalter betraegt: " + durchschnittsalter);
	PetModal.modal('show');

}

/*****************************************************************************
 * Main Callback: Wait for DOM to be fully loaded                            *
 *****************************************************************************/
$(() => {
	// Define JQuery HTML objects
	const addUserForm: JQuery = $('#add-user-form');
	const editUserForm: JQuery = $('#edit-user-form');
	const userTableBody: JQuery = $('#user-table-body');
	const sortTable: JQuery = $("#sorttable");
	const hashlink: JQuery = $("#hashbutton");
	const firstlink: JQuery = $("#firstbutton");
	const lastlink: JQuery = $("#lastbutton");
	const petStatistiken: JQuery = $("#Statistik");
// debugger; /* sets a breakpoint for browser-debuggung */

	// Register listeners
	addUserForm.on('submit', addUser);
	editUserForm.on('submit', editUser);
	userTableBody.on('click', '.edit-user-button', openEditUserModal);
	userTableBody.on('click', '.delete-user-button', deleteUser);
	sortTable.on("keyup", searchUser );
	//hashlink.on("click", sortUser("hash"));
	//firstlink.on("click",sortUser("first"));
	//lastlink.on("click",sortUser("last"));
	petStatistiken.on("click",renderStatisticModal);
});

