import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisCacheService {
  private client: Redis;

  constructor(private redisService: RedisService) {
    this.client = this.redisService.getClient();
  }

  // NOTE: 특정 키에 대한 값을 캐시에 저장
  async set(key: string, value: any) {
    const transValue = JSON.stringify(value);
    const ttl = 60 * 60 * 24; // NOTE: Redis에 저장하는 시간을 1일로 설정
    return await this.client.setex(key, ttl, transValue);
  }

  // NOTE: 캐시에서 특정 키의 값을 검색
  async get<T>(key: string): Promise<T> {
    const data = await this.client.get(key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  // NOTE: 캐시에서 특정 키를 삭제
  async del(key: string) {
    return await this.client.del(key);
  }

  // NOTE: 캐시에서 모든 키를 삭제
  async flush() {
    return await this.client.flushall();
  }

  // NOTE: 좋아요 같은 기능처럼 수가 증가하는 데이터를 관리하기 위한 함수
  async increment(
    key: string,
    isMember: boolean,
    ttl: number = 60 * 60 * 24,
  ): Promise<Number> {
    const exists = await this.client.exists(key);
    // NOTE: 기존 키가 존재하는지 확인
    if (!exists) {
      // NOTE: 기존 키가 존재하지 않을때 키 생성 + 초기값 1로 세팅
      await this.client.setex(key, ttl, 1);
      return 1;
    } else {
      // NOTE: 기존 키 존재 + 1 증가
      if (isMember) {
        // NOTE: 혹시모를 상황 대비
        const total = await this.get(key);
        return Number(total);
      } else {
        const total = await this.client.incr(key);
        await this.client.expire(key, ttl); // 새로운 만료 시간을 설정
        return total;
      }
    }
  }

  async decrement(key: string, isMember: boolean, ttl: number = 60 * 60 * 24) {
    if (!isMember) {
      return Number(this.client.get(key));
    }
    const newLikeCount = await this.client.decr(key);
    if (newLikeCount < 0) {
      await this.client.setex(key, ttl, 0); // 만료 기간 재설정
      return 0;
    } else {
      await this.client.expire(key, ttl); // 새로운 만료 시간을 설정
      return newLikeCount;
    }
  }

  // NOTE: 특정 키의 데이터가 있는지 확인
  async isExists(key: string) {
    return await this.client.exists(key);
  }

  // NOTE: Redis에 특정 사용자가 특정 프로젝트를 클릭한 것을 저장
  async addUserLike(key: string, userId: string, unlikeKey: string) {
    // NOTE: 특정 키 값에 사용자 ID가 포함되는지 확인
    const isMember = await this.client.sismember(key, userId);

    const ttl = 60 * 60 * 24;

    // NOTE: 좋아요 해지 목록에서 제거
    await this.client.srem(unlikeKey, userId);

    // NOTE: 없을때 추가
    if (!isMember) {
      await this.client.sadd(key, userId);
      // NOTE: sadd에는 만료 시간을 정하지 못하므로 만료를 위해서 한 줄 추가
      await this.client.expire(key, ttl);
    }
    return { isMember: isMember === 1 ? true : false };
  }

  async deleteUserLike(key: string, userId: string, unlikeKey: string) {
    // NOTE: 특정 키 값에 사용자 ID가 포함되는지 확인
    const isMember = await this.client.sismember(key, userId);
    const isUnlikeMember = await this.client.sismember(unlikeKey, userId);

    const ttl = 60 * 60 * 24;

    // NOTE: 있을때 좋아요 목록에서 삭제
    if (isMember) {
      await this.client.srem(key, userId);
    }

    if (!isUnlikeMember) {
      // NOTE: 좋아요 해지 목록에 추가
      await this.client.sadd(unlikeKey, userId);
      // NOTE: sadd에는 만료 시간을 정하지 못하므로 만료를 위해서 한 줄 추가
      await this.client.expire(unlikeKey, ttl);
    }

    return { isMember: isMember === 1 ? true : false };
  }

  // NOTE: 특정 키 패턴을 가지고 잇는 키 배열 반환 함수
  async findKeysByPattern(pattern: string): Promise<string[]> {
    const keys = [];
    let cursor = '0';

    do {
      const reply = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        50,
      );
      cursor = reply[0];
      keys.push(...reply[1]);
    } while (cursor !== '0');

    return keys;
  }

  async findMembers(key: string) {
    return await this.client.smembers(key);
  }
}
