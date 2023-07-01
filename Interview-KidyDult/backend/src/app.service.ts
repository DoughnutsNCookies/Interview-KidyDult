import { Injectable } from '@nestjs/common';
import { UserDTO, FormDataDTO } from './dto/app.dto';
import * as fs from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async readFile(filePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const lines = data.split('\n');
          resolve(lines);
        }
      });
    });
  }

  checkFormData(formData: FormDataDTO) {
    if (
      formData.order === undefined ||
      (formData.order !== 'ASC' && formData.order !== 'DESC')
    )
      throw new Error('Missing or invalid order - ASC or DESC only');

    if (
      formData.find === undefined ||
      (formData.find !== 'WORD' && formData.find !== 'SENT')
    )
      throw new Error('Missing or invalid find - WORD or SENT only');

    if (formData.k === undefined || formData.k < 1)
      throw new Error('Missing or invalid k - positive integers only');
  }

  async generateOutputForAll(
    filePaths: string[],
    formData: FormDataDTO,
  ): Promise<UserDTO[]> {
    this.checkFormData(formData);
    const map: Map<string, number> = new Map<string, number>();
    const users: UserDTO[] = [];

    for (const file of filePaths) {
      const fileContent = await this.readFile(file);
      for (let line of fileContent) {
        if (line.startsWith('<')) {
          const matchResult = line.match(/<([^>]*)>/);
          if (matchResult) {
            const name = matchResult[1];
            if (formData.find.toUpperCase() === 'WORD')
              map.set(name, (map.get(name) || 0) + line.split(' ').length - 1);
            else map.set(name, (map.get(name) || 0) + 1);
          }
        }
			}
			fs.unlink(file, (err) => { });
    }

    const sortedMap = new Map(
      [...map.entries()].sort((a, b) =>
        formData.order.toUpperCase() === 'DESC' ? b[1] - a[1] : a[1] - b[1],
      ),
    );
    for (let i = 0; i < formData.k && i < sortedMap.size; i++) {
      const key = Array.from(sortedMap.keys())[i];
      users.push(new UserDTO(key, sortedMap.get(key)));
    }
    return users;
  }

  async generateOutputForPer(filePaths: string[], formData: FormDataDTO) {
    const users: UserDTO[][] = [];

    for (const file of filePaths) {
      const output = await this.generateOutputForAll([file], formData);
      users.push(output);
    }
    return users;
  }
}
