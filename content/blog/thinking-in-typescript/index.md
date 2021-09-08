---
title: Thinking in TypeScript
date: '2021-09-05T12:14:41.153Z'
---

This is an evergrowing series of collections of my thoughts and observations from someone who has been using JavaScript for a while to start making TypeScript my primary language.

[Shorthand Initialisation of Constructor With Keyword Arguments](#shorthand-initialisation-of-constructor-with-keyword-arguments)

## <a name="shorthand-initialisation-of-constructor-with-keyword-arguments"></a>Shorthand Initialisation of Constructor With Keyword Arguments

Typescript offers a handy shorthand when setting up constructors for classes, allowing us to skip rewriting the same fields 3 times and letting us only declare them in the constructor.

```typescript
class Person {
  constructor(private firstName: string, private lastName: string) {}
}
```

The above snippet is the shorthand for writing the below.

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

In the first example, we declare 2 private members (`firstName` & `lastName`), the constructor is set up in with the 2 arguments, and also the value from the constructor is saved to the class members, all in one line.

We saved rewriting the fields 2 more times with this shorthand. Very handy!

But, this only works for positional based constructors. So initalising an object with this class means, the arguments have to be passed in the right order.

```typescript
const person = new Person('First', 'Last');
```

This works very well for classes with a minimal number of arguments, but this can quickly start getting out of hand. Lets assume a complex application that has the `Person` class but a lot more fields are being used

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

This is definitely a contrived example, but the issue still exists with bigger scale applications. Positional arguments are error prone and can cause issues even with type checking from TypeScript.

The obvious answer to this is keyword arguments by passing an object to the constructor rather than individual arguments.

But the shorthand is not available anymore (yet!). So we are back to this

```typescript
interface PersonType {
  firstName: string;
  lastName: string;
  address: Address;
  phone: number;
  email: string;
  designation: Designation;
  personalDetails: Personal;
}

class Person {
  firstName: string;
  lastName: string;
  address: Address;
  phone: number;
  email: string;
  designation: Designation;
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

This starts getting messy easily and can get a bit difficult to maintain as we now have another interface as well. Furthermore, adding new fields to the interface, means adding 2 lines in the constructor and the class member declaration.

What we can do now is use the concept of declaration merging.

```typescript
interface PersonType {
  firstName: string;
  lastName: string;
  address: Address;
  phone: number;
  email: string;
  designation: Designation;
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

As you can see, we now have made declaring members in the class redundant. We can say the interface `Person` extends `PersonType`. So we now have an interface with the same name as the class that has all the fields that will be used in the class. We now merge the interface with a class by creating a class with the same name.

There is still another issue. Adding a new field to the interface would mean we still have to set the variable in the constructor to initialise the value. We can use a bit more code to make that easier for us.

By only changing the constructor, we can assign all fields that come to the constructor to the class members

```typescript
interface PersonType {
  firstName: string;
  lastName: string;
  address: Address;
  phone: number;
  email: string;
  designation: Designation;
  personalDetails: Personal;
}

interface Person extends PersonType {}

class Person {
  constructor(args: PersonType) {
    Object.assign(this, args);
  }
}
```

We have solved our 2 problems

1. Writing fields again and again.
2. Extending this class out for updates requires updating only the interface
