define(function (require, exports, module) {
  "use strict";
  
  var oop = require("../lib/oop");
  var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
  
  var EncryScriptHighlightRules = function () {
    
    var keywords = (
        "and|or|case|match|return|if|else|unlock"
    );
    
    var builtinConstants = (
        "true|false|base58"
    );
    
    var builtinFunctions = (
        "checkSig|checkType|pkFromAddress|unixTime"
    );
    
    var builtinTypes = (
        "Any|Bool|String|Bytes|Long|Int|Float|Double|Dict|List|Option"
    );
    
    var libraryRoots = (
        "context|state|proof"
    );
    
    var builtinStructures = (
        "context|reference"
    );
    
    var keywordMapper = this.createKeywordMapper({
      "constant.library": builtinStructures,
      "function.buildin": builtinFunctions,
      "support.type": builtinTypes,
      "constant.language": builtinConstants,
      "keyword": keywords,
      "keyword.control": "return"
    }, "identifier");
    
    var decimalInteger = "(?:(?:[1-9]\\d*)|(?:0))";
    var hexInteger = "(?:0[xX][\\dA-Fa-f]+)";
    var binInteger = "(?:0[bB][01]+)";
    var integer = "(?:" + decimalInteger + "|" + hexInteger + "|" + binInteger + ")";
    
    var exponent = "(?:[eE][+-]?\\d+)";
    var fraction = "(?:\\.\\d+)";
    var intPart = "(?:\\d+)";
    var floatNumber = "(?:(?:" + intPart + "?" + fraction + ")|(?:" + intPart + "\\.))";
    
    var stringEscape = "\\\\(x[0-9A-Fa-f]{2}|[0-7]{3}|[\\\\abfnrtv'\"]|U[0-9A-Fa-f]{8}|u[0-9A-Fa-f]{4})";
    
    var identifierRe = "[a-zA-Z\\$_][a-zA-Z\\d\\$_]*";
    
    this.$rules = {
      "start": [{
        token: "string",
        regex: '"(?=.)',
        next: "double-quoted-string"
      }, {
        token: "string",
        regex: "'(?=.)",
        next: "quoted-string"
      }, {
        token: "constant.numeric",
        regex: floatNumber
      }, {
        token: "constant.numeric",
        regex: integer + "[lL]\\b"
      }, {
        token: ["storage.type", "text", "variable"],
        regex: "(let)( *)(" + identifierRe + ")\\b"
      }, {
        token: ["entity.name.section", "punctuation.operator", "entity.other"],
        regex: "(" + identifierRe + ")(\\.)(" + identifierRe + ")",
      }, {
        token: ["keyword", "text", "entity.name.function", "paren.lparen"],
        regex: "(def)( *)(" + identifierRe + ")(\\()",
        next: "function-arguments"
      }, {
        token: ["support.function"],
        regex: "(" + identifierRe + ")(?=\\()"
      }, {
        token: "constant.numeric",
        regex: integer + "\\b"
      }, {
        token: keywordMapper,
        regex: identifierRe + "\\b",
      }, {
        token: "keyword",
        regex: "->",
      }, {
        token: "keyword.operator",
        regex: "\\+|\\-|\\*|\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|="
      }, {
        token: "paren.lparen",
        regex: "[\\[\\(\\{]"
      }, {
        token: "paren.rparen",
        regex: "[\\]\\)\\}]"
      }, {
        token: "text",
        regex: "\\s+"
      }],
      "double-quoted-string": [{
        token: "constant.language.escape",
        regex: stringEscape
      }, {
        token: "string",
        regex: "\\\\$",
        next: "qqstring"
      }, {
        token: "string",
        regex: '"|$',
        next: "start"
      }, {
        defaultToken: "string"
      }],
      "quoted-string" : [{
        token : "constant.language.escape",
        regex : stringEscape
      }, {
        token : "string",
        regex : "\\\\$",
        next  : "quoted-string"
      }, {
        token : "string",
        regex : "'|$",
        next  : "start"
      }, {
        defaultToken: "string"
      }],
      "function-arguments": [
        {
          token: ["variable.parameter", "punctuation.operator", "text", "support.type"],
          regex: "(" + identifierRe + ")(:)( *)(" + builtinTypes + ")"
        }, {
          token: "punctuation.operator",
          regex: "[, :]+"
        }, {
          token: "punctuation.operator",
          regex: "$"
        }, {
          token: "empty",
          regex: "",
          next: "start"
        }
      ]
    };
  };
  
  oop.inherits(EncryScriptHighlightRules, TextHighlightRules);
  
  exports.EncryScriptHighlightRules = EncryScriptHighlightRules;
});