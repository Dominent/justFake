# JustFake

## Description

 >This library extends the swagger functionality, adding
 support for Faker.js attributes in the swagger spec file,
 by default it is the swagger.yaml file.
 Also adds support for generating fake values dynamically
 on each request.

## Fake Data Provider

>Current fake data provider:
    [ Faker.js](https://github.com/Marak/faker.js/wiki)

## Example Attributes

>Example attributes -> swagger.xaml
```yaml
   firstName:
      type: "string"
      x-faker: "jf.name.firstName()"
```

## Configuration

>Requires initial configuration in index.js to be able
to intercept the responce before it is send to the receiver.
 
### Example configuration -> index.js

```javascript
   app.use((req, res, next) => justFake.intercept(req)
    (middleware.swaggerRouter(options)(req, res, next)));
```
 
## Providers

* **Query Provider**
    > Added support for usage of query params in generating data. 
    
    ```yaml
        /authentication/login?username=John&password=Doe

        x-faker: "[{username}, {password}]" -> [
            'John',
            'Doe'
        ]
    ```
 