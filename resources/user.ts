export default class UserResource {
  public id: number;
  public username: string;
  public token: string | null = null;

  constructor({ id, username }: { id: number, username: string }) {
    this.id = id;
    this.username = username;
  }
}