import IToken from "./IToken";
import {TokenDeterminant} from "./TokenDeterminant";
import TokenType from "./TokenType";
import IComplexToken from "./IComplexToken";


class Tokenizer<TokenEnum = TokenType> {
    determinants: TokenDeterminant<TokenEnum>[];
    complexTokens: IComplexToken<TokenEnum>[];

    constructor(determinants: TokenDeterminant<TokenEnum>[], complexTokens: IComplexToken<TokenEnum>[] = []) {
        this.determinants = determinants;
        this.complexTokens = complexTokens;
    }

    tokenize = (input: string): IToken<TokenEnum>[] => {
        let current = 0;
        const tokens: IToken<TokenEnum>[] = [];
        while (current < input.length) {
            const [token, cursor] = this.determineToken(input, current);
            current = cursor;
            tokens.push(token);
        }

        return this.swapComplexTokens(tokens);
    };

    swapComplexTokens = (tokens: IToken<TokenEnum>[]): IToken<TokenEnum>[] => {

        let resultingTokens = tokens;

        for (const complexToken of this.complexTokens) {
            const complexTokenBitMask = complexToken.tokenSequence.join("");
            let result = true;
            while (result) {
                let index = resultingTokens.map(t => t.type).join("").indexOf(complexTokenBitMask);
                const value = resultingTokens.slice(index, index + complexTokenBitMask.length).map(t => t.value).join("");
                resultingTokens.splice(index, complexTokenBitMask.length, {
                    value,
                    type: complexToken.type
                });
                index = resultingTokens.map(t => t.type).join("").indexOf(complexTokenBitMask);
                result = index >= 0;
            }
        }

        return resultingTokens;
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
