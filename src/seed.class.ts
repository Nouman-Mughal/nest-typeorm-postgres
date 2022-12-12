import { EntityManager } from 'typeorm';
import { faker } from '@faker-js/faker';
// import { randomBytes } from 'crypto';
import { Roles, User } from './auth/user.entity';
import * as bcrypt from 'bcrypt';
import { Tasks } from './tasks/entity/tasks.entity';
import { TaskStatus } from './tasks/tasks-status.enum';

export class Seed {
  private users: Array<Partial<User>>;
  private tasks: Array<Partial<Tasks>>;
  private salt: string;
  constructor(private readonly entityManager: EntityManager) {
    this.users = [];
    this.tasks = [];
  }

  async fakeIt(entity: any): Promise<void> {
    this.salt = await bcrypt.genSalt();
    switch (entity) {
      case User:
        return await this.addData(
          this.userData(),
          entity,
          (savedData: Array<Partial<User>>) => (this.users = savedData),
        );
      case Tasks:
        this.addData(
          this.tasksData(),
          entity,
          (savedData: Array<Partial<Tasks>>) => (this.tasks = savedData),
        );

      default:
        break;
    }
  }
  //we need to map each element otherwise all 100 element will be undefined.
  private userData(): Array<Partial<User>> {
    return this.arr().map<Partial<User>>(() => {
      return {
        email: faker.internet.email(),
        username: `${faker.name.firstName()} ${faker.name.lastName()}`,
        role: faker.helpers.arrayElement([Roles.user, Roles.admin]),
        // password: faker.internet.password(20, false),
        password: bcrypt.hashSync('secret', this.salt),
      };
    });
  }
  private tasksData(): Array<Partial<Tasks>> {
    return this.arr().map<Partial<Tasks>>(() => ({
      description: faker.lorem.paragraphs(),
      title: faker.lorem.words(),
      status: faker.helpers.arrayElement([
        TaskStatus.done,
        TaskStatus.in_progress,
        TaskStatus.open,
      ]),
      user: faker.helpers.arrayElement(this.users),
    }));
  }
  private arr(): undefined[] {
    return Array.from({ length: 50 });
  }
  // private addData(data, entity: any): void {
  //   this.entityManager
  //     .save(entity, data as any)
  //     .then(() => {
  //       console.log('seeding');
  //     })
  //     .catch(console.error);
  // }
  private async addData<T>(
    data: Array<Partial<T>>,
    entity: any,
    fun?: (savedData: Array<Partial<T>>) => void,
  ): Promise<void> {
    return this.entityManager
      .save<T, T>(entity, data as any)
      .then((savedData: Array<Partial<T>>) => {
        if (fun) {
          fun(savedData);
        }
        console.log(savedData);
      })
      .catch(console.error);
  }
}
