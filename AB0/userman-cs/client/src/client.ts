/*****************************************************************************
 * interface declaration                                                     *
 *****************************************************************************/
// Interface representing a user
interface User {
    id: number;
    firstName: string;
    lastName: string;
    creationTime: Date;
}

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

    // Read values from input fields
    const firstName: string = firstNameField.val().toString().trim();
    const lastName: string = lastNameField.val().toString().trim();

    // Check if all required fields are filled in
    if (firstName && lastName) {
        // userlist.addUser(new User(firstName, lastName, new Date()))
        $.ajax({
            url: '/user',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                firstName,
                lastName,
            }),
            contentType: 'application/json',
            success: (response) => {
                // render Message
                renderMessage(response.message);
                // Update local user list
                getList();
                // Reset the values of all elements in the form
                addUserForm.trigger('reset');
            },
            error: (jqXHRresponse) => {
                renderMessage(jqXHRresponse.responseJSON.message);
            },
        }).then(()=>{});
    } else {
        // Not all required fields are filled in, print error message
        renderMessage('Not all fields are filled. Please check the form');
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

    // Check if all required fields are filled in
    if (firstName && lastName) {
        $.ajax({
            url: '/user/' + userId,
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify({
                firstName,
                lastName,
            }),
            contentType: 'application/json',
            success: (response) => {
                // render Message
                renderMessage(response.message);
                // Update local user list
                getList();
                // Reset the values of all elements in the form
                editUserForm.trigger('reset');
            },
            error: (jqXHRresponse) => {
                renderMessage(jqXHRresponse.responseJSON.message);
            },
        }).then(()=>{});
    } else {
        // Not all required fields are filled in, print error message
        renderMessage('Not all fields are filled. Please check the form');
    }

    editModal.modal('hide');
}

function deleteUser(event) {
    // Get user id from button attribute 'data-user-id'
    const userId: number = $(event.currentTarget).data('user-id');

    // Perform ajax request to log out user
    $.ajax({
        url: '/user/' + userId,
        type: 'DELETE',
        dataType: 'json',
        success: (response) => {
            // render Message
            renderMessage(response.message);
            // Get new user list from server
            getList();
        },
        error: (jqXHRresponse) => {
            renderMessage(jqXHRresponse.responseJSON.message);
        },
    }).then(()=>{});
}

function openEditUserModal(event) {
    // Get user id from button attribute 'data-user-id'
    const userId: number = $(event.currentTarget).data('user-id');

    $.ajax({
        url: '/user/' + userId,
        type: 'GET',
        dataType: 'json',
        success: (response) => {
            renderEditUserModal(response.user);
        },
        error: (jqXHRresponse) => {
            renderMessage(jqXHRresponse.responseJSON.message);
        },
    }).then(()=>{});
}

function getList() {
    // Perform ajax request to update local user list
    $.ajax({
        url: '/users',
        type: 'GET',
        dataType: 'json',
        success: (response) => {
            renderUserList(response.userList);
        },
        error: (jqXHRresponse) => {
            renderMessage(jqXHRresponse.responseJSON.message);
        },
    }).then(()=>{});
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
                        <i class="fa fa-pencil" aria-hidden="true"></i>
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

/*****************************************************************************
 * Main Callback: Wait for DOM to be fully loaded                            *
 *****************************************************************************/
$(() => {
    // Define JQuery HTML objects
    const addUserForm: JQuery = $('#add-user-form');
    const editUserForm: JQuery = $('#edit-user-form');
    const userTableBody: JQuery = $('#user-table-body');

    // Register listeners
    addUserForm.on('submit', addUser); // Pass the event into the handler
    editUserForm.on('submit', editUser); // Pass the event into the handler
    userTableBody.on('click', '.edit-user-button', openEditUserModal); // Click listener for edit button
    userTableBody.on('click', '.delete-user-button', deleteUser); // Click listener for delete button

    getList();
});
