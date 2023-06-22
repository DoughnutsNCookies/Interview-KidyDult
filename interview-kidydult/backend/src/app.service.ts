import { Injectable } from '@nestjs/common';

interface Hello {
  string: string;
}

@Injectable()
export class AppService {
  getHello(): Hello {
    return {
      string: 'Hello World!',
    };
  }
}
