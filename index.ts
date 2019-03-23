import Tokenizer from "./compiler/tokenizer/Tokenizer";
import {TokenDeterminant} from "./compiler/tokenizer/TokenDeterminant";
import TokenType from "./compiler/tokenizer/TokenType";

const example = "1 + 2 - {hello}";
const NUMBERS = /[0-9]/;
const LETTERS = /[a-zA-ZА-Яа-я]/i;

const numberTokenDeterminant = new TokenDeterminant(true, TokenType.Number, char => NUMBERS.test(char));
const lettersTokenDeterminant = new TokenDeterminant(true, TokenType.String, char => LETTERS.test(char));
const spaceTokenDeterminant = new TokenDeterminant(true, TokenType.Space, char => char === " ");
const operatorTokenDeterminant = new TokenDeterminant(false, TokenType.Operator, char => "+-=/*".indexOf(char) >= 0);
const parenthesesTokenDeterminant = new TokenDeterminant(false, TokenType.Parenthesis, char => "({})".indexOf(char) >= 0);

const tokenizer = new Tokenizer([
    numberTokenDeterminant,
    lettersTokenDeterminant,
    spaceTokenDeterminant,
    operatorTokenDeterminant,
    parenthesesTokenDeterminant
]);

const tokens = tokenizer.tokenize(example);
console.table(tokens);
