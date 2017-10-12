# JustFake

## Description

 >This library extends the [swagger](https://swagger.io/) functionality, adding
 support for Faker.js attributes in the swagger spec file,
 by default it is the swagger.yaml file.
 Also adds support for generating fake values dynamically
 on each request.

## Fake Data Provider

>Current fake data provider:
    [Faker.js](https://github.com/Marak/faker.js/wiki)

## Attributes
>Valid Custom Keys supported by swagger editor 

### Example -> swagger.xaml

```yaml
   firstName:
      type: "string"
      x-faker: "jf.name.firstName()"
```

## Configuration

>Requires initial configuration in index.js to be able
to intercept the responce before it is send to the receiver.
 
### Example -> index.js

```javascript
   app.use((req, res, next) => justFake.intercept(req)
    (middleware.swaggerRouter(options)(req, res, next)));
```
 
## Providers

* **Query Provider**
    > Added support for query params in generated data. 
    
    ```yaml
        URL -> /authentication/login?username=John&password=Doe

        x-faker: "[{username}, {password}]" -> [
            'John',
            'Doe'
        ]
    ```

## Register Providers

>Allows to easily extend the current functionality by registering a new provider. The providers are called when the statement is being processed.

### Example
```javascript
justFake.register((statement, req) => {
  // Do your magic!
})
```
 