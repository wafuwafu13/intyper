import { add } from '../src/add'

test('1 + 2 = 3', () => {
  expect(add(1, 2)).toBe(3)
})

console.log(add(1, 2))
