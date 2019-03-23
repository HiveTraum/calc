import IToken from "./IToken";
import {TokenDeterminant} from "./TokenDeterminant";
import TokenType from "./TokenType";


class Tokenizer<TokenEnum = TokenType> {
    determinants: TokenDeterminant<TokenEnum>[];

    constructor(determinants: TokenDeterminant<TokenEnum>[]) {
        this.determinants = determinants;
    }

    tokenize = (input: string): IToken<TokenEnum>[] => {
        let current = 0;
        const tokens: IToken<TokenEnum>[] = [];
        while (current < input.length) {
            const [token, cursor] = this.determineToken(input, current);
            current = cursor;
            tokens.push(token);
        }

        return tokens;
    };

    determineToken = (input: string, current: number): [IToken<TokenEnum>, number] => {

        for (const determinant of this.determinants) {
            const result = determinant.onToken(input, current);
            current = result.current;
            if (result.token) return [result.token, current];
        }

        throw new TypeError(`Не удалось распознать токен ${encodeURI(input[current])}`);
    }
}


export default Tokenizer;
