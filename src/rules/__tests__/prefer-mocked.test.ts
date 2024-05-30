import path from 'path';
import dedent from 'dedent';
import rule from '../prefer-mocked';
import { FlatCompatRuleTester as RuleTester } from './test-utils';

function getFixturesRootDir(): string {
  return path.join(__dirname, 'fixtures');
}

const rootPath = getFixturesRootDir();

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    sourceType: 'module',
    tsconfigRootDir: rootPath,
    project: './tsconfig.json',
  },
});

ruleTester.run('prefer-mocked', rule, {
  valid: [
    dedent`
      import { foo } from './foo';
      foo();
    `,

    dedent`
      import { foo } from './foo';
      jest.mocked(foo).mockReturnValue(1);
    `,

    dedent`
      import { bar } from './bar';
      bar.mockReturnValue(1);
    `,

    dedent`
      import { foo } from './foo';
      sinon.stub(foo).returns(1);
    `,

    dedent`
      import { foo } from './foo';
      foo.mockImplementation(() => 1);
    `,

    dedent`
      const obj = { foo() {} };
      obj.foo();
    `,

    dedent`
      const mockFn = jest.fn();
      mockFn.mockReturnValue(1);
    `,

    dedent`
      const arr = [() => {}];
      arr[0]();
    `,

    dedent`
      const obj = { foo() {} };
      obj.foo.mockReturnValue(1);
    `,

    dedent`
      const obj = { foo() {} };
      jest.spyOn(obj, 'foo').mockReturnValue(1);
    `,

    dedent`
      type MockType = jest.Mock;
      const mockFn = jest.fn();
      (mockFn as MockType).mockReturnValue(1);
    `,
  ],
  invalid: [
    {
      code: dedent`
        import { foo } from './foo';
        
        (foo as jest.Mock).mockReturnValue(1);
      `,
      output: dedent`
        import { foo } from './foo';
        
        (jest.mocked(foo)).mockReturnValue(1);
      `,
      options: [],
      errors: [
        {
          messageId: 'useJestMocked',
          column: 2,
          line: 3,
        },
      ],
    },
    {
      code: dedent`
        import { foo } from './foo';
        
        (foo as jest.Mock).mockImplementation(1);
      `,
      output: dedent`
        import { foo } from './foo';
        
        (jest.mocked(foo)).mockImplementation(1);
      `,
      options: [],
      errors: [
        {
          messageId: 'useJestMocked',
          column: 2,
          line: 3,
        },
      ],
    },
    {
      code: dedent`
        import { foo } from './foo';
        
        (foo as unknown as jest.Mock).mockReturnValue(1);
      `,
      output: dedent`
        import { foo } from './foo';
        
        (jest.mocked(foo)).mockReturnValue(1);
      `,
      options: [],
      errors: [
        {
          messageId: 'useJestMocked',
          column: 2,
          line: 3,
        },
      ],
    },
    {
      code: dedent`
        import { Obj } from './foo';
        
        (Obj.foo as jest.Mock).mockReturnValue(1);
      `,
      output: dedent`
        import { Obj } from './foo';
        
        (jest.mocked(Obj.foo)).mockReturnValue(1);
      `,
      options: [],
      errors: [
        {
          messageId: 'useJestMocked',
          column: 2,
          line: 3,
        },
      ],
    },
    {
      code: dedent`
        ([].foo as jest.Mock).mockReturnValue(1);
      `,
      output: dedent`
        (jest.mocked([].foo)).mockReturnValue(1);
      `,
      options: [],
      errors: [
        {
          messageId: 'useJestMocked',
          column: 2,
          line: 1,
        },
      ],
    },
    {
      code: dedent`
        import { foo } from './foo';
        
        (foo as jest.MockedFunction).mockReturnValue(1);
      `,
      output: dedent`
        import { foo } from './foo';
        
        (jest.mocked(foo)).mockReturnValue(1);
      `,
      options: [],
      errors: [
        {
          messageId: 'useJestMocked',
          column: 2,
          line: 3,
        },
      ],
    },
    {
      code: dedent`
        import { foo } from './foo';
        
        (foo as jest.MockedFunction).mockImplementation(1);
      `,
      output: dedent`
        import { foo } from './foo';
        
        (jest.mocked(foo)).mockImplementation(1);
      `,
      options: [],
      errors: [
        {
          messageId: 'useJestMocked',
          column: 2,
          line: 3,
        },
      ],
    },
    {
      code: dedent`
        import { foo } from './foo';
        
        (foo as unknown as jest.MockedFunction).mockReturnValue(1);
      `,
      output: dedent`
        import { foo } from './foo';
        
        (jest.mocked(foo)).mockReturnValue(1);
      `,
      options: [],
      errors: [
        {
          messageId: 'useJestMocked',
          column: 2,
          line: 3,
        },
      ],
    },
    {
      code: dedent`
        import { Obj } from './foo';
        
        (Obj.foo as jest.MockedFunction).mockReturnValue(1);
      `,
      output: dedent`
        import { Obj } from './foo';
        
        (jest.mocked(Obj.foo)).mockReturnValue(1);
      `,
      options: [],
      errors: [
        {
          messageId: 'useJestMocked',
          column: 2,
          line: 3,
        },
      ],
    },
    {
      code: dedent`
        (new Array(0).fill(null).foo as jest.MockedFunction).mockReturnValue(1);
      `,
      output: dedent`
        (jest.mocked(new Array(0).fill(null).foo)).mockReturnValue(1);
      `,
      options: [],
      errors: [
        {
          messageId: 'useJestMocked',
          column: 2,
          line: 1,
        },
      ],
    },
    {
      code: dedent`
        (jest.fn(() => foo) as jest.MockedFunction).mockReturnValue(1);
      `,
      output: dedent`
        (jest.mocked(jest.fn(() => foo))).mockReturnValue(1);
      `,
      options: [],
      errors: [
        {
          messageId: 'useJestMocked',
          column: 2,
          line: 1,
        },
      ],
    },
    {
      code: dedent`
        const mockedUseFocused = useFocused as jest.MockedFunction<typeof useFocused>;
      `,
      output: dedent`
        const mockedUseFocused = jest.mocked(useFocused);
      `,
      options: [],
      errors: [
        {
          messageId: 'useJestMocked',
          column: 26,
          line: 1,
        },
      ],
    },
    {
      code: dedent`
        const filter = (MessageService.getMessage as jest.Mock).mock.calls[0][0];
      `,
      output: dedent`
        const filter = (jest.mocked(MessageService.getMessage)).mock.calls[0][0];
      `,
      options: [],
      errors: [
        {
          messageId: 'useJestMocked',
          column: 17,
          line: 1,
        },
      ],
    },
  ],
});
