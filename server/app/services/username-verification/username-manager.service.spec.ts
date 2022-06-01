import { expect } from 'chai';
import { Container } from 'typedi';
import { UsernameManagerService } from './username-manager.service';
import * as specConstants from './username-manager.service.spec.constants';

describe('UsernameManagerService', () => {
    let service: UsernameManagerService;

    beforeEach(async () => {
        service = Container.get(UsernameManagerService);
    });

    it('two different valid usernames should return false', () => {
        for (let i = 0; i < specConstants.DIFFERENT_USERNAMES.length; ++i) {
            expect(service.sameNamesLobby(specConstants.DIFFERENT_USERNAMES[i], specConstants.USERNAMES[i])).to.equal(false);
        }
    });

    it('sameNamesLobby should return true with same username but with case difference (lower and upper)', () => {
        expect(service.sameNamesLobby(specConstants.USERNAME_ONLY_LOWERCASE, specConstants.USERNAME_WITH_UPPERCASE)).to.equal(true);
    });

    it('same valid usernames should return true', () => {
        for (const username of specConstants.USERNAMES) {
            expect(service.sameNamesLobby(username, username)).to.equal(true);
        }
    });

    it('first invalid username should return false', () => {
        expect(service.sameNamesLobby(specConstants.INVALID_USERNAME, specConstants.USERNAMES[0])).to.equal(false);
    });

    it('second invalid username should return false', () => {
        expect(service.sameNamesLobby(specConstants.USERNAMES[0], specConstants.INVALID_USERNAME)).to.equal(false);
    });
});
