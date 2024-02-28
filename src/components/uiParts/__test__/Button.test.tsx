import type { SerializedStyles } from '@emotion/react';
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import renderer from 'react-test-renderer';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';
import { pink, size2 } from '../../../styles/const';
import { createSerializer, matchers } from '@emotion/jest';

expect.addSnapshotSerializer(createSerializer({ DOMElements: false }));
expect.extend(matchers);

describe('Button Test', () => {
  afterEach(() => {
    cleanup();
  });

  const mockOnClick = jest.fn();

  test.each([
    [true, 'submit'],
    [false, 'button'],
  ])('Props-isSubmit Test', (isSubmit: boolean, expected: string) => {
    render(
      <Button isSubmit={isSubmit} btnId="txt" onClick={mockOnClick}>
        Click me
      </Button>
    );

    const buttonElm = screen.getByRole('button');
    expect(buttonElm).toHaveAttribute('type', expected);
  });

  test.each`
    cssName
    ${undefined}
    ${[pink, size2]}
  `('Props-cssName Test', (cssName: SerializedStyles | SerializedStyles[]) => {
    const tree = renderer
      .create(
        <Button isSubmit={false} btnId="txt" cssName={cssName} onClick={mockOnClick}>
          Click me
        </Button>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  test('onClick Test', () => {
    render(
      <Button isSubmit={false} btnId="txt" onClick={mockOnClick}>
        Click me
      </Button>
    );
    const buttonElm = screen.getByRole('button');

    fireEvent.click(buttonElm);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
