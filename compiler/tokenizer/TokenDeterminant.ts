import IToken from "./IToken";

interface ITokenDeterminantResult<TokenEnum> {
    token?: IToken<TokenEnum>;
    current: number;
}

interface ITokenDeterminant<TokenEnum> {
    onToken: (input: string, current: number) => ITokenDeterminantResult<TokenEnum>;
}

export class TokenDeterminant<TokenEnum> implements ITokenDeterminant<TokenEnum> {

    multiple = false;
    type: TokenEnum;
    predicate: (char: string) => boolean;

    constructor(multiple = false, type: TokenEnum, predicate: (char: string) => boolean) {
        this.multiple = multiple;
        this.type = type;
        this.predicate = predicate;
    }

    onToken = (input: string, current: number) => {
        const char = input[current];
        if (this.predicate(char)) {
            if (this.multiple) return this.onMultipleTokens(input, current);
            else return this.onSingleToken(input, current);
        } else return {current};
    };

    private onSingleToken = (input: string, current: number): ITokenDeterminantResult<TokenEnum> => ({
        token: {value: input[current], type: this.type},
        current: ++current
    });

    private onMultipleTokens = (input: string, current: number): ITokenDeterminantResult<TokenEnum> => {
        let value = "";
        let char = input[current];
        while (this.predicate(input[current])) {
            value += char;
            char = input[++current];
        }

        return {token: {value, type: this.type}, current};
    }
}
