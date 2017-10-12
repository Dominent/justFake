/**
 * This library extends the swagger functionality, adding
 * support for Faker.js attributes in the swagger spec file,
 * by default it is the swagger.yaml file.
 * Also adds support for generating fake values dynamically
 * on each request.
 *
 * Current Fake data provider: 
 *    Faker.js -> https://github.com/Marak/faker.js/wiki
 * 
 * Example attributes [swagger.xaml]
 *    firstName:
 *      type: "string"
 *      x-faker: "jf.name.firstName()"
 * 
 * Requires initial configuration in index.js to be able
 * to intercept the responce before it is send to the receiver.
 * 
 * Example configuration [index.js]
 *   app.use((req, res, next) => justFake.intercept(req)(middleware.swaggerRouter(options)(req, res, next)));
 * 
 * Added support for query params
 *   x-faker: "[{username}, {password}]"
 */

 // TODO(Domi): Add multi value returns
 // TODO(Domi): Fakes only on 200 returns

 const helpers = require('./helpers');
 const queryProvider = require('./providers/queryProvider');
 const parser = require('./parser');

 const JSON_INDENTATION = 4;
 
 let providers = [
     queryProvider
 ]
 
 const justFake = (req, data) => {
     if (!req || !data) {
         return data;
     }
 
     if (helpers.isHtml(data) || req.originalUrl.toLowerCase().includes("docs")) {
         return data;
     }
 
     let template;
     let model;
     
     let schema = req.swagger.operation.responses['200'].schema;
 
     if (schema.items) {
         model = JSON.parse(data)[0];
         template = schema.items.properties;
     } else {
         template = schema.properties;
         model = JSON.parse(data);
     }
 
     let models = [];
     let templates = [];
 
     models.push(model);
     templates.push(template);
 
     try {
         while (models.length !== 0) {
 
             let modelItems = models.pop();
             let templateItems = templates.pop();
 
             for (let item in modelItems) {
 
                 if (!isNaN(item)) {
                     let tmp = modelItems[item];
 
                     if (helpers.isObject(tmp)) {
                         models.push(tmp);
                         templates.push(templateItems);
 
                         continue;
                     }
                 }
 
                 let modelValue = modelItems[item];
                 let templateValue = templateItems[item] || templateItems;
 
                 if (helpers.isObject(modelValue)) {
 
                     models.push(modelValue);
 
                     if (Array.isArray(modelValue)) {
                         if (templateValue['items']['properties']) {
                             templates.push(templateValue['items']['properties']);
                         } else {
                             templates.push(templateValue['items']);
                         }
                     } else {
                         templates.push(templateValue['properties']);
                     }
                 } else if (templateValue['x-faker']) {
                     modelItems[item] = parser.parse(templateValue['x-faker'], providers, req);
                 }
             }
         }
     } catch (error) {
         console.log(error.message);
     }
 
     return JSON.stringify(model, null, JSON_INDENTATION);
 }
 
module.exports = (http) => {
     let request;
 
     (function (end) {
         http.OutgoingMessage.prototype.end = function (data, encoding, callback) {
             end.call(this, justFake(request, data), encoding, callback);
         };
     }(http.OutgoingMessage.prototype.end));
 
     return {
         intercept: (req) => {
             request = req
             return (func) => func;
         },
         register: (provider) => {
             providers.push(provider);
         }
     }
 };
 