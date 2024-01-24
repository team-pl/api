import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'src/entity/file.entity';
import { Repository } from 'typeorm';
import * as AWS from 'aws-sdk';
import { config } from 'dotenv';
import { v4 as uuid } from 'uuid';
import { EFileUsage } from 'src/type/file.type';

config();

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    usage: EFileUsage,
  ) {
    AWS.config.update({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });

    const id = uuid();

    const key = Date.now() + '/' + String(file.originalname);
    const bucket = process.env.BUCKET;
    const region = 'ap-northeast-2';

    const params = {
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
    };

    try {
      await new AWS.S3().putObject(params).promise();
      const returnedUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

      const file = await this.fileRepository.create({
        id,
        userId,
        url: returnedUrl,
        usage,
      });

      return await this.fileRepository.save(file);
    } catch (e) {
      console.log('FILE UPLOAD ERROR : ', e);
    }
    // try {
    //   const upload = await new AWS.S3()
    //     .createBucket({ Bucket: process.env.BUCKET })
    //     .promise();
    //   console.log(file);
    //   console.log(upload);
    // } catch (e) {
    //   console.log('ERROR : ', e);
    // }
  }
}
