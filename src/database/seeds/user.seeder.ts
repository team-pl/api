import { User } from 'src/entity/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(User);
    await repository.insert([
      {
        id: '5bbc46d2-8ce8-11ee-b9d1-0242ac120002 ',
        name: '지혀니',
        phone: '010-7364-8501',
        email: 'jihyeonlim311@gmail.com',
      },
    ]);
  }
}
