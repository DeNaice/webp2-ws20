/*****************************************************************************
 * Import package                                                            *
 *****************************************************************************/
import express = require ('express');
import mysql = require('mysql');
import {Connection, MysqlError} from 'mysql'
import { Request, Response } from 'express';
import { User, UserList } from '../model/user';

/*****************************************************************************
 * Define global variables                                                   *
 *****************************************************************************/
let userList : UserList = new UserList();

/*****************************************************************************
 * Define and start web-app server, define json-Parser                       *
 *****************************************************************************/
const app = express();
app.listen(8080, () => {
    console.log('Server started: http://localhost:8080');
});
app.use(express.json());
 // Konfiguration zur Datenbank- Verbindung
const database: Connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '',
    database: 'userman'
})
database.connect((err: MysqlError) => {
    if (err) {
        console.log('Database connection ist fehlgeschlagen: ', err);
    }   else {
        console.log('Database is connected');
    }
});



/*****************************************************************************
 * STATIC ROUTES                                                             *
 *****************************************************************************/
const basedir: string = __dirname + '/../..';  // get rid of /server/src
app.use('/', express.static(basedir + '/client/views'));
app.use('/css', express.static(basedir + '/client/css'));
app.use('/src', express.static(basedir + '/client/src'));
app.use('/jquery', express.static(basedir + '/client/node_modules/jquery/dist'));
app.use('/popperjs', express.static(basedir + '/client/node_modules/popper.js/dist'));
app.use('/bootstrap', express.static(basedir + '/client/node_modules/bootstrap/dist'));
app.use('/font-awesome', express.static(basedir + '/client/node_modules/font-awesome'));

/*****************************************************************************
 * HTTP ROUTES: USER, USERS                                                  *
 *****************************************************************************/
/**
 * @api {post} /user Create a new user
 * @apiName postUser
 * @apiGroup User
 * @apiVersion 2.0.0
 *
 * @apiParam {string} firstName First name of the user
 * @apiParam {string} lastName Last name of the user
 *
 * @apiSuccess {string} message Message stating the new user has been created successfully
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "message":"Successfully created new user"
 * }
 *
 * @apiError (Client Error) {400} NotAllMandatoryFields The request did not contain all mandatory fields
 *
 * @apiErrorExample NotAllMandatoryFields:
 * HTTP/1.1 400 Bad Request
 * {
 *     "message":"Not all mandatory fields are filled in"
 * }
 */
app.post('/user', (req: Request, res: Response) => {
    // Read data from request body
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;
    // add a new user if first- and lastname exist
    if (firstName && lastName) {
        // Create new user
       let data: [string, string, string] = [
           new Date().toLocaleString(),
           firstName,
           lastName
       ]
        let query: string = "INSERT INTO userList (creationTime, firstName, lastName) VALUES (?, ?, ?);";
        database.query(query,data, (err: MysqlError, result: any) =>{
            if (err || result === null ){
                res.status(400).send({
                    message: "An error occured while creating the new user."
                });
            } else {
                // Send response
                res.status(201).send({
                    message: 'Successfully created new user',
                });
            }
        });

    } else {
        res.status(400).send({
            message: 'Not all mandatory fields are filled in',
        });
    }
});

/**
 * @api {get} /user:userId Get user with given id
 * @apiName getUser
 * @apiGroup User
 * @apiVersion 2.0.0
 *
 * @apiParam {number} userId The id of the requested user
 *
 * @apiSuccess {User} user The requested user object
 * @apiSuccess {string} message Message stating the user has been found
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "user":{
 *         "id":1,
 *         "firstName":"Peter",
 *         "lastName":"Kneisel",
 *         "creationTime":"2018-10-21 14:19:12"
 *     },
 *     "message":"Successfully got user"
 * }
 *
 *  @apiError (Client Error) {404} NotFound The requested user can not be found
 *
 * @apiErrorExample NotFound:
 * HTTP/1.1 404 Not Found
 * {
 *     "message":"The requested user can not be found."
 * }
 */
app.get('/user/:userId', (req: Request, res: Response) => {
    // Read data from request parameters
    let data: number = Number(req.params.userId);
    let query: string = 'SELECT * FROM userlist WHERE id = ?;';

   database.query(query, data, (err: MysqlError, rows:any) => {
       if(err){
           res.status(500).send({
              message: 'Database requested failed' + err
           });
       } else {
           if(rows.length ===1){
               res.status(200).send({
                  message: 'Successfully got user',
                  user: new User(
                      rows[0].id,
                      rows[0].firstName,
                      rows[0].lastName,
                      new Date(rows[0].creationTime))
               });
           } else {
               res.status(404).send({
                  message: 'The requested user can not be found'
               });
           }
       }

    });

});

/**
 * @api {put} /user/:userId Update user with given id
 * @apiName putUser
 * @apiGroup User
 * @apiVersion 2.0.0
 *
 * @apiParam {number} userId The id of the requested user
 * @apiParam {string} firstName The (new) first name of the user
 * @apiParam {string} lastName The (new) last name of the user
 *
 * @apiSuccess {string} message Message stating the user has been updated
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "message":"Successfully updated user ..."
 * }
 *
 * @apiError (Client Error) {400} NotAllMandatoryFields The request did not contain all mandatory fields
 * @apiError (Client Error) {404} NotFound The requested user can not be found
 *
 * @apiErrorExample NotAllMandatoryFields:
 * HTTP/1.1 400 Bad Request
 * {
 *     "message":"Not all mandatory fields are filled in"
 * }
 *
 * @apiErrorExample NotFound:
 * HTTP/1.1 404 Not Found
 * {
 *     "message":"The user to update could not be found"
 * }
 */
// The requested User can not be found on Client !!?? //
app.put('/user/:userId', (req: Request, res: Response) => {
    // Read data from request
    const userId: number = Number(req.params.userId);
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;
    // Create Query and data
    let data: [string, string, number] = [firstName, lastName, userId];
    let query: string = 'UPDATE userlist SET firstName = ?, lastName = ? WHERE id = ?;';
    // PUT-ITI-N

   // execute database query
    database.query(query, data, (err: MysqlError, result: any) =>{
        if (err){
            res.status(500).send({
                message: 'Databaserequest failed' + err
            });
        } else {
            if (result.affectedRows ===1){
                // User got updated
                res.status(200).send({
                   message: 'Successfully updated User: ' + userId
                });
            } else {
                // Wenn User nicht geupdated werden konnte
                res.status(404).send({
                   message: 'Updating new User'
                });
            }
        }
    })
});

/**
 * @api {delete} /user/:userId Delete user with given id
 * @apiName deleteUser
 * @apiGroup User
 * @apiVersion 2.0.0
 *
 * @apiParam {number} userId The id of the requested user
 *
 * @apiSuccess {string} message Message stating the user has been updated
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "message":"Successfully deleted user ..."
 * }
 */
app.delete('/user/:userId', (req: Request, res: Response) => {
    // Read data from request
    const userId: number = Number(req.params.userId);
    let data: number = userId;
    let query: string = 'DELETE FROM userlist WHERE id = ?;';
    // delete user
    database.query(query, data, (err:MysqlError, result: any) =>{
        if (err){
            res.status(500).send({
               message: 'Database request failed: ' + err
            });
        } else {
            if (result.affectedRows === 1){
                res.status(200).send({
                   message: 'Successfully deleted user ' + userId
                });
            } else {
                res.status(400).send({
                   message: 'The requested user can not be deleted'
                });
            }
        }
    })
});

/**
 * @api {get} /users Get all users
 * @apiName getUsers
 * @apiGroup Users
 * @apiVersion 2.0.0
 *
 * @apiSuccess {User[]} userList The list of all users
 * @apiSuccess {string} message Message stating the users have been found
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "userList": [
 *      {
 *        "firstName": "Hans",
 *        "lastName": "Mustermann",
 *        "creationTime": "2018-11-04T13:02:44.791Z",
 *        "id": 1
 *     },
 *      {
 *        "firstName": "Bruce",
 *        "lastName": "Wayne",
 *        "creationTime": "2018-11-04T13:03:18.477Z",
 *        "id": 2
 *      }
 *    ]
 *    "message":"Successfully requested user list"
 * }
 */
app.get('/users', (req: Request, res: Response) => {

    let query: string = "SELECT * FROM userlist;";

    database.query(query, (err: MysqlError, rows: any) =>{
        if(err){
            res.status(500).send({
                message: "Database request failed: " + err
            })
        } else {
            let userlist: User[] = [];
            //Durchläuft jede row von rows
            for(let row of rows){
                let user: User = new User(
                    row.id,
                    row.firstName,
                    row.lastName,
                    new Date(row.creationTime)
                    );
                userlist.push(user);
            }
            // Send user list to client
            res.status(200).send({
                userList: userlist,
                message: 'Successfully requested user list'
            });
        }
    });
});

