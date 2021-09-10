---
title: Thinking in TypeScript
date: '2021-09-05T12:14:41.153Z'
---

This is an evergrowing series of collections of my thoughts and observations from someone who has been using JavaScript for a while to start making TypeScript my primary language.

[Shorthand Initialisation of Constructor With Keyword Arguments](#shorthand-initialisation-of-constructor-with-keyword-arguments)

## <a name="shorthand-initialisation-of-constructor-with-keyword-arguments"></a>Shorthand Initialisation of Constructor With Keyword Arguments

Typescript offers a handy shorthand when setting up constructors for classes, allowing us to skip rewriting the same fields 3 times and letting us only declare them in the constructor. [Documentation here](https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties)

```typescript
class Person {
  constructor(private firstName: string, private lastName: string) {}
}
```

The above snippet is the same as writing

```typescript
class Person {
  private firstName: string;
  private lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
```

In the first example, we declare 2 private members (`firstName` & `lastName`), the constructor is set up with the 2 arguments, and also the value from the constructor is assigned to the class members, all in one line.

We saved rewriting the fields 2 more times with this shorthand. Very handy when working with multiple number of arguments in a single class.

But, this only works for positional based arguments in constructors. So initalising an object with this class means, the arguments have to be passed in the right order.

```typescript
const person = new Person('First', 'Last');
```

This works very well for classes with a minimal number of arguments, but this can quickly start getting out of hand. Lets assume a complex application that has the `Person` class but a lot more class members.

```typescript
class Person {
  constructor(
    private firstName: string,
    private lastName: string,
    private address: Address,
    private phone: number,
    private email: string,
    private designation: string,
    private personalDetails: Personal,
  ) {}
}
```

This is definitely a contrived example, but the issue still exists with bigger scale applications. Positional arguments are error prone and can be a cause for issues.

We can solve this by using named arguments in the constructor instead. But the shorthand is not available anymore (yet!). So we are back to individually declaring the members, passing them to the constructor, and also assigning them all by ourselves.

```typescript
interface PersonType {
  firstName: string;
  lastName: string;
  address: Address;
  phone: number;
  email: string;
  designation: string;
  personalDetails: Personal;
}

class Person {
  firstName: string;
  lastName: string;
  address: Address;
  phone: number;
  email: string;
  designation: string;
  personalDetails: Personal;

  constructor(args: PersonType) {
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.address = args.address;
    this.phone = args.phone;
    this.email = args.email;
    this.designation = args.designation;
    this.personalDetails = args.personalDetails;
  }
}
```

This starts getting messy easily and can get a bit difficult to maintain as we now have multiple sources of truth as well. Furthermore, adding new fields to the interface, means adding 2 lines in the constructor and the class member declaration.

What we can do now is use the concept of declaration merging.

```typescript
interface PersonType {
  firstName: string;
  lastName: string;
  address: Address;
  phone: number;
  email: string;
  designation: string;
  personalDetails: Personal;
}

interface Person extends PersonType {}

class Person {
  constructor(args: PersonType) {
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.address = args.address;
    this.phone = args.phone;
    this.email = args.email;
    this.designation = args.designation;
    this.personalDetails = args.personalDetails;
  }
}
```

Merging the interface `Person` with the class `Person` has made declaration of the members redundant because the interface `Person` extends `PersonType`.

There is still another issue. Adding a new field to the interface would mean we still have to initialise the class member in the constructor. We can use a bit more code to make things easier.

By only changing the constructor implementation, we can assign all fields that come to the constructor to the class members.

```typescript
interface PersonType {
  firstName: string;
  lastName: string;
  address: Address;
  phone: number;
  email: string;
  designation: string;
  personalDetails: Personal;
}

interface Person extends PersonType {}

class Person {
  constructor(args: PersonType) {
    Object.assign(this, args);
  }
}
```

This solves the issue of extending the interface and having one single source of truth.

We now do not have write the same fields again in multiple places, and extending the class out for updates or maintenance requires updating only the interface
