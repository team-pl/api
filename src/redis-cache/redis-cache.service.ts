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

  // NOTE: 특정 키의 데이터가 있는지 확인
  async isExists(key: string) {
    return await this.client.exists(key);
  }

  // NOTE: Redis에 특정 사용자가 특정 프로젝트를 클릭한 것을 저장
  async addUserLike(
    likeProjectKey: string,
    countKey: string,
    unlikeProjectKey: string,
    likeUserKey: string,
    unlikeUserKey: string,
    userId: string,
    projectId: string,
  ) {
    // NOTE: 특정 키 값에 사용자 ID가 포함되는지 확인

    const ttl = 60 * 60 * 24 * 2;

    const timestamp = Date.now(); // 현재 시간 (Unix 타임스탬프)

    // NOTE: 프로젝트별 좋아요 해지 목록에서 제거
    await this.client.srem(unlikeProjectKey, userId);

    // NOTE: 사용자별 좋아요 해지 목록에서 제거
    await this.client.srem(unlikeUserKey, projectId);

    // NOTE: 프로젝트별 좋아요 목록 추가
    await this.client.sadd(likeProjectKey, `${userId}|${timestamp}`);
    await this.client.expire(likeProjectKey, ttl);

    // NOTE: 사용자별 좋아요 목록 추가
    await this.client.sadd(likeUserKey, `${projectId}|${timestamp}`);
    await this.client.expire(likeUserKey, ttl);

    // NOTE: 프로젝트별 총 좋아요 수 키가 존재하는지 확인
    const exists = await this.client.exists(countKey);

    if (!exists) {
      // NOTE: 기존 키가 존재하지 않을때 키 생성 + 초기값 1로 세팅
      await this.client.setex(countKey, ttl, 1);
      return 1;
    } else {
      const total = await this.client.incr(countKey);
      await this.client.expire(countKey, ttl); // 새로운 만료 시간을 설정
      return total;
    }
  }

  async deleteUserLike(
    likeProjectKey: string,
    countKey: string,
    unlikeProjectKey: string,
    likeUserKey: string,
    unlikeUserKey: string,
    userId: string,
    projectId: string,
  ) {
    const ttl = 60 * 60 * 24 * 2;

    const timestamp = Date.now(); // 현재 시간 (Unix 타임스탬프)

    // NOTE: 프로젝트별 좋아요 목록에서 제거
    await this.client.srem(likeProjectKey, userId);

    // NOTE: 사용자별 좋아요 목록에서 제거
    await this.client.srem(likeUserKey, projectId);

    // NOTE: 프로젝트별 좋아요 해지 목록 추가
    await this.client.sadd(unlikeProjectKey, `${userId}|${timestamp}`);
    await this.client.expire(unlikeProjectKey, ttl);

    // NOTE: 사용자별 좋아요 해지 목록 추가
    await this.client.sadd(unlikeUserKey, `${projectId}|${timestamp}`);
    await this.client.expire(unlikeUserKey, ttl);

    const count = await this.client.decr(countKey);
    await this.client.expire(countKey, ttl);

    return count;
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

  // NOTE: 좋아요한 프로젝트와 사용자 ID 가져옴
  async getKeysByPattern(
    pattern: string,
  ): Promise<{ projectId: string; userId: string }[]> {
    const keys: string[] = [];
    let cursor = '0';
    const results: { projectId: string; userId: string }[] = [];

    do {
      const result = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = result[0];
      keys.push(...result[1]);
    } while (cursor !== '0');

    for (const key of keys) {
      const userId = await this.client.smembers(key);
      const projectId = key.split(':').pop(); // 마지막 부분 추출 (예: "likes:user:00000"에서 "00000")
      if (userId.length > 0) {
        results.push({ projectId, userId: userId[0] });
      }
    }

    return results;
  }

  // NOTE: 좋아요한 프로젝트와 총 좋아요 수를 가져옴
  async getTotalCount(
    pattern: string,
  ): Promise<{ projectId: string; totalCount: string }[]> {
    const keys: string[] = [];
    let cursor = '0';
    const results: { projectId: string; totalCount: string }[] = [];

    do {
      const result = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = result[0];
      keys.push(...result[1]);
    } while (cursor !== '0');

    for (const key of keys) {
      const totalCount = await this.client.get(key);
      const projectId = key.split(':').pop(); // 마지막 부분 추출 (예: "likes:project::00000"에서 "00000")
      results.push({ projectId, totalCount });
    }

    return results;
  }

  async getValue(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      console.log('ERROR: ', error);
    }
  }

  async getSetValue(key: string): Promise<string[] | null> {
    try {
      const values = await this.client.smembers(key); // Set의 모든 값 가져오기
      return values;
    } catch (error) {
      console.error('Redis smembers error:', error);
      return null;
    }
  }

  // NOTE: 특정 키에 특정 값이 포함되는지 확인하는 함수
  async isValueIncluded(key: string, value: string): Promise<boolean> {
    const storedValue = await this.getSetValue(key);

    if (storedValue) {
      const filteredData = storedValue.filter((data) => data.includes(value));
      return filteredData.length > 0 ? true : false;
    }
    return false;
  }

  // NOTE: 여러 키를 한 번에 삭제하는 함수(동기화 이후에 사용)
  async removeKeys(keys: string[]) {
    if (keys.length > 0) {
      await this.client.del(...keys);
      console.log(`Deleted keys: ${keys.join(', ')}`);
    }
  }
}
