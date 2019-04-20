import Tokenizer from "./compiler/tokenizer/Tokenizer";
import {TokenDeterminant} from "./compiler/tokenizer/TokenDeterminant";
import TokenType from "./compiler/tokenizer/TokenType";
import IComplexToken from "./compiler/tokenizer/IComplexToken";

const example = "1 + 2 - {hello} + 1.0 - 15 * 1.223";

const NUMBERS = /[0-9]/;
const LETTERS = /[a-zA-ZА-Яа-я]/;

const numberTokenDeterminant = new TokenDeterminant(true, TokenType.Number, char => NUMBERS.test(char));
const lettersTokenDeterminant = new TokenDeterminant(true, TokenType.String, char => LETTERS.test(char));
const spaceTokenDeterminant = new TokenDeterminant(false, TokenType.Space, char => char === " ");
const operatorTokenDeterminant = new TokenDeterminant(false, TokenType.Operator, char => "+-=/*".indexOf(char) >= 0);
const parenthesesTokenDeterminant = new TokenDeterminant(false, TokenType.Parenthesis, char => "({[]})".indexOf(char) >= 0);
const dotTokenDeterminant = new TokenDeterminant(false, TokenType.Dot, char => char === ".");

const floatComplexToken: IComplexToken<TokenType> = {
    type: TokenType.Number,
    tokenSequence: [TokenType.Number, TokenType.Dot, TokenType.Number]
};

const variableComplexToken: IComplexToken<TokenType> = {
    type: TokenType.Variable,
    tokenSequence: [TokenType.Parenthesis, TokenType.String, TokenType.Parenthesis]
};

const tokenizer = new Tokenizer([
    numberTokenDeterminant,
    lettersTokenDeterminant,
    spaceTokenDeterminant,
    operatorTokenDeterminant,
    parenthesesTokenDeterminant,
    dotTokenDeterminant
], [floatComplexToken, variableComplexToken]);

const tokens = tokenizer.tokenize(example);
console.table(tokens.filter(t => t.type !== TokenType.Space));
