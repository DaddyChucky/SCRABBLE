import { expect } from 'chai';
import { describe } from 'mocha';
import { HttpException } from './http.exception';

describe('HttpException', () => {
    it('should create a simple HTTPException', () => {
        const createdMessage = 'Course created successfully';
        const httpException: HttpException = new HttpException(createdMessage);
        expect(httpException.message).to.equals(createdMessage);
    });
});
