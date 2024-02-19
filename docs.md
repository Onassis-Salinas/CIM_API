# Api coding instructions and documentation

## Methods and Models

This is the use of the **sendError** function, this function needs to be used when sending an error to the client.

```js
//sendError({response_object}, {error_ code}, {error_object}||{personalized_string})
sendError(res, 400, "UserName Incorrect")
sendError(res, 500, err)
```

## Documentation
Use a swagger in every endpoint to specify the path, classify the endpoint and add the props

```js

   /**
   * @swagger
   * /login:
   *   post:
   *     description: Login to the application
   *     tags: [Users, Login]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: password
   *         description: User's password.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: login
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Login'
   */
router.post("/employee", getEmployees)
```




