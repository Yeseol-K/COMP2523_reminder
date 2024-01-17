class User {
  private _username: string;
  private _password: string;

  constructor(username: string, password: string) {
    this._username = username;
    this._password = password;
  }

  getUsername() {
    return this._username;
  }
  getPassword() {
    return this._password;
  }
  // getPassword() {
  //   return this._password;
  // }
  set password() {
    this._password
  }
}
const james = new User("james", "123");
console.log(james.getUsername()); //it's more safe than console.log(james.username)
james.getPassword
james.password = "123"; //different way to call SetPassword