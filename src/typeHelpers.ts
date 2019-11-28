/* ClassType
Represents any class constructor. */
/* tslint:disable-next-line:no-any eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type ClassType = { new (...args: any[]): any };

export type Properties<T extends ClassType> = keyof InstanceType<T>;
export type PropertyObject<T extends ClassType> = {
  [name in Properties<T>]: InstanceType<T>[name];
};

/* RemovePromise
Returns the type T inside of a Promise<T>. */
export type RemovePromise<T> = T extends Promise<infer R> ? R : never;

/* Usage
const Result = Promise.resolve(0); // Promise<number>
type TResult = RemovePromise<typeof Result> //number

*/

/*ClassMethodTypes
Returns a union of the public method types on a class.*/
export type ClassMethodTypes<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => void ? T[K] : never;
}[keyof T];

/* Usage 
class A {
    public a = (): void => {}
    public b(param: string): number { return 3; }
}

type MethodTypes = ClassMethodTypes<A>; // (() => void | (param: string) => number)
*/

/*ClassMethodNames
Returns a string union of public method names on a class.*/
export type ClassMethodNames<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => void ? K : never;
}[keyof T];

/* Usage

type MethodNames = ClassMethodNames<A>; // "a" | "b"
*/
