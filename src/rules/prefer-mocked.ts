import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';
import { createRule } from './utils';

type ValidatedTsAsExpression = TSESTree.TSAsExpression & {
  typeAnnotation: TSESTree.TSTypeReference & {
    typeName: TSESTree.TSQualifiedName & {
      left: TSESTree.Identifier;
      right: TSESTree.Identifier;
    };
  };
};

function getFnName(
  node: TSESTree.Expression,
  sourceCode: string,
): string | null {
  if (node.type === AST_NODE_TYPES.TSAsExpression) {
    // case: `myFn as unknown as jest.Mock`
    return getFnName(node.expression, sourceCode);
  }

  return sourceCode.slice(...node.range);
}

export default createRule({
  name: __filename,
  meta: {
    docs: {
      description: 'Prefer jest.mocked() over (fn as jest.Mock)',
    },
    messages: {
      useJestMocked: 'Prefer jest.mocked({{ replacement }})',
    },
    schema: [],
    type: 'suggestion',
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      'TSAsExpression:has(TSTypeReference > TSQualifiedName:has(Identifier.left[name="jest"]):has(Identifier.right[name="Mock"],Identifier.right[name="MockedFunction"]))'(
        node: ValidatedTsAsExpression,
      ) {
        const fnName = getFnName(node.expression, context.sourceCode.text);

        if (!fnName) {
          return;
        }

        context.report({
          node,
          messageId: 'useJestMocked',
          data: {
            replacement: '',
          },
          fix(fixer) {
            return fixer.replaceText(node, `jest.mocked(${fnName})`);
          },
        });
      },
    };
  },
});
