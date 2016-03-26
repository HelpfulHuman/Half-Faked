# Half-Faked [![Build Status](https://travis-ci.org/HelpfulHuman/Half-Faked.svg?branch=master)](https://travis-ci.org/HelpfulHuman/Half-Faked)

_Half-Faked_ is a tool for generating fake data for a given schema definition.  It was originally apart of the [Restfool](https://github.com/HelpfulHuman/Restfool) library as the `fixture()` function, but has since been isolated into its own module.  This tool can be used for creating more accurate and varied test cases, modeling data architecture, or even setting up mock services that deliver data for your front-end team(s) to develop against.

_Half-Faked_ helps you get something close to what your final data will look like, without being your final data!

## Getting Started

Install via `npm`:

> **Note:** We recommend installing the awesome [faker](https://www.npmjs.com/package/faker) library to use in conjunction with half-faked.

```
npm install --save-dev half-faked
```

Then, `require` it in your project like so...

```javascript
const createFactory = require('half-faked');
```

## Create a Factory

This library exposes a single function that accepts either an object literal or function that provides the desired output schema.  Any functional values found will be called and their results can will also be checked for functional values to invoke.

```
type createFactory = (Object|Func schema) -> Factory
```

The return value of this function is a "factory" function that will be used for generating `n` number of copies.

```
type Factory = (Integer count [, Object|Func modifier]) -> Array
```

> **Note:** As previously mentioned, we're using the [faker](https://www.npmjs.com/package/faker) library below to quickly generate some fake data.

```javascript
const createFactory = require('half-faked');
const faker = require('faker');

// object literal
const makeAddress = createFactory({
  street: faker.address.streetAddress,
  city: faker.address.city,
  state: faker.address.usState,
  country: 'usa',
  zipcode: faker.address.zipCode
});

// function
const makeUser = createFactory(function () {
  return {
    name: faker.name.firstName() + ' '+ faker.name.lastName(),
    email: faker.internet.email,
    password: faker.random.uuid,
    addresses: makeAddress(5)
  };
});
```

## Generating Data

Now that you've created a factory for your data, you can start creating rows using the returned factory function.  You can create a single item by providing no first argument, or you can create a collection of items by specifying a count of `1` or greater.

```javascript
var one = makeUser();
// => { name: 'Nick Glenn', email: ... }

var oneInArray = makeUser(1);
// => [ { name: 'Nick Glenn', email: ... } ]

var many = makeUser(5);
// => [ {...}, {...}, {...}, {...}, {...} ]
```

You can override the results of custom values by passing an object or function in as a second argument.  This is called a _modifier_.

Using an object as a second argument will simply merge the given object with the data of each row in the collection, overriding the value of any existing matched keys.

```javascript
var active = makeUser(2, { active: true });
// => [ {name: '...', active: true}, {name: '...', active: true} ]
```

Providing a function will give you a greater level of control.  The generated object will be passed to the function and whatever is returned will take its place.

```javascript
var users = makeUser(10, function (user) {
  if (user.email === 'admin@example.com') {
    user.password = '123456789';
  }

  return user;
});
```
