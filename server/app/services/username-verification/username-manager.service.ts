import { Service } from 'typedi';

@Service()
export class UsernameManagerService {
    sameNamesLobby(firstUsername: string, secondUsername: string): boolean {
        if (!firstUsername || !secondUsername) return false;
        return firstUsername.toLowerCase() === secondUsername.toLowerCase();
    }
}
