export class UserDTO {
  constructor(name: string, words: number) {
    this.name = name;
    this.words = words;
  }

  name: string;
  words: number;
}

export class FormDataDTO {
  order: string;
  find: string;
  k: number;
}
