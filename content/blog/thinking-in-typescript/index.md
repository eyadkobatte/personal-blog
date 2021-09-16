---
title: Thinking in TypeScript
date: '2021-09-05T12:14:41.153Z'
---

This is an evergrowing series of collections of my thoughts and observations from someone who has been using JavaScript for a while to start making TypeScript my primary language.

[Shorthand Initialization of Constructor With Keyword Arguments](#shorthand-initialization-of-constructor-with-keyword-arguments)

## <a name="shorthand-initialization-of-constructor-with-keyword-arguments"></a>Shorthand Initialization of Constructor With Keyword Arguments

Typescript offers a handy shorthand when setting up constructors for classes. It allows us to skip rewriting the same fields 3 times and letting us only declare them in the constructor. [Documentation here](https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties)

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

In the first example, we declare 2 private members (`firstName` & `lastName`). The constructor is set up with the 2 arguments. And the class members get initialized with values in the constructor, all in one line.

We saved rewriting the fields 2 more times with this shorthand. Very handy when working with many arguments in a single class.

But, this only works for positional-based arguments in constructors. So initializing an object with this class means, the arguments have to be in the right order.

```typescript
const person = new Person('First', 'Last');
```

This works very well for classes with a minimal number of arguments, but this can start getting out of hand. Let's assume a complex application that has the `Person` class but a lot more class members.

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

This is a contrived example, but the issue still exists with bigger-scale applications. Positional arguments are error-prone and can be a cause for issues.

We can solve this by using named arguments in the constructor instead. But the shorthand is not available anymore (yet!). So we are back to writing declarations and initializations all by ourselves.

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

This starts getting messy and can get a bit difficult to maintain as we now have more than one source of truth. Furthermore, adding new fields to the interface means writing initialization and declarations.

What we can do now is use the concept of declaration merging. [Documentation here](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)

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

Merging the interface and the class `Person` has made member declaration redundant. This is because the interface `Person` extends `PersonType`.

There is still another issue. Adding a new field to the interface would mean we still have to initialize the class member in the constructor. We can use a bit more code to make things easier.

By updating the constructor, we can initialize all class members in one line.

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

We now do not have to write the same fields again in more than one place. And extending the class for updates or maintenance requires updating only the interface
