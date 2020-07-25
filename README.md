
# adonis5-swagger
> Swagger, Adonis5, SwaggerUI

[![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url]

Create API documentation easily in Adonis 5 using [Swagger](https://swagger.io/specification/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Installation](#installation)
- [Sample Usage](#sample-usage)
- [Best usage](#best-usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation
```bash
npm i --save adonis5-swagger
```
Compile your code:
```bash
node ace serve --watch
```
Connect all dependences:
```bash
node ace invoke adonis5-swagger
```
* For other configuration, please update the `config/swagger.ts`.

# Sample Usage
* Add new route:
  ```js
  Route.get('/api/hello', 'TestController.hello')
  ```

* Create `TestController` using `node ace make:controller Test` command:
  ```js
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  
  export default class TestController {
    /**
    * @swagger
    * /api/hello:
    *   get:
    *     tags:
    *       - Test
    *     summary: Sample API
    *     parameters:
    *       - name: name
    *         description: Name of the user
    *         in: query
    *         required: false
    *         type: string
    *     responses:
    *       200:
    *         description: Send hello message
    *         example:
    *           message: Hello Guess
    */
    public async hello({ request, response }: HttpContextContract) {
      const name = request.input('name', 'Guess')
      return response.send({ message: 'Hello ' + name })
    }
  }
  ```

* You can also define the schema in the Models:
  ```js
  import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
  
  /** 
  *  @swagger
  *  definitions:
  *    User:
  *      type: object
  *      properties:
  *        id:
  *          type: uint
  *        username:
  *          type: string
  *        email:
  *          type: string
  *        password:
  *          type: string
  *      required:
  *        - username
  *        - email
  *        - password
  */
  export default class User extends BaseModel {
  }
  ```

* Or create a separate file containing documentation from the APIs in either TS or YAML formats, sample structure:
  ```bash
  project
  ├── app
  ├── config 
  ├── docs
  │   ├── controllers
  │   │   ├── **/*.ts
  │   │   ├── **/*.yml
  │   └── models
  │       ├── **/*.ts
  │       ├── **/*.yml
  ```
# Best usage
* Create files into docs/swagger, for example docs/swagger/auth.yml may contains:

```YAML
/api/auth/login:
  post:
    tags:
      - Auth
    security: []
    description: Login
    parameters:
      - name: credentials
        in:  body
        required: true
        schema:
          properties:
            phone:
              type: string
              example: '1234567890'
              required: true
    produces:
      - application/json
    responses:
      200:
        description: Success
```
* You can change default settings in config/swagger.ts
* For other sample in YAML and JS format, please refer to this [link](/sample).

Open http://localhost:3333/docs in your browser
For detail usage, please check the Swagger specification in this [SwaggerSpec](https://swagger.io/specification/)

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"

[npm-image]: https://img.shields.io/npm/v/adonis5-swagger.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/adonis5-swagger "npm"

[license-image]: https://img.shields.io/npm/l/adonis5-swagger?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"
