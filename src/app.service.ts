import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from './auth/user.entity';
import { Seed } from './seed.class';
import { Tasks } from './tasks/entity/tasks.entity';

@Injectable()
export class AppService extends Seed {
  //entityManager is like a generic entity a type of ORM.
  constructor(entityManager: EntityManager) {
    super(entityManager);
    this.fakeData();
    //Partial is the helper function that make incomplete entity to map with error.
    // this.entityManager
    //   .save<User, Partial<User>>(User, [
    //     {
    //       username: 'user6',
    //       password: 'noman123',
    //     },
    //   ])
    //   .then((data): Array<Partial<User>> => {
    //     console.log(data);
    //     return data;
    //   })
    //   .catch(console.error);
  }
  private async fakeData(): Promise<void> {
    await this.fakeIt(User);

    //async await becuause we need to await for the user data to be faked first.
    this.fakeIt(Tasks);
  }
}
