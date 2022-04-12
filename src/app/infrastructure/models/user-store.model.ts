export class UserStoreModel {
  constructor(
    public userName: string,
    public userRoles: string[],
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    // console.log("Now : " + new Date());
    //  console.log("Now : " + this._tokenExpirationDate);
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
      return null;
    return this._token;
  }

  get isAuth() : boolean{
    return !!this._token;
  }
}
