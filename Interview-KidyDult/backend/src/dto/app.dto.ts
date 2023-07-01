export class UserDTO {
  constructor(name: string, count: number) {
    this.name = name;
    this.count = count;
  }

  name: string;
  count: number;
}

export class FormDataDTO {
  order: string;
  find: string;
  k: number;
}
