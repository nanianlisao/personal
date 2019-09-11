var assert = require('assert');
// 生成 AssertionError 以便稍后比较错误的消息：
const { message } = new assert.AssertionError({
    actual: 1,
    expected: 2,
    operator: 'strictEqual'
});
// 验证错误的输出：
try {
    assert.strictEqual(1, 2);   // 比较 1 和 2 是否严格相等
} catch (err) {
    assert(err instanceof assert.AssertionError);  // assert 模块抛出的所有错误都是 AssertionError 类的实例。
    assert.strictEqual(err.message, message)   // 错误消息等价上面message
    assert.strictEqual(err.name, 'AssertionError [ERR_ASSERTION]');
    assert.strictEqual(err.actual, 1);
    assert.strictEqual(err.expected, 2);
    assert.strictEqual(err.code, 'ERR_ASSERTION');
    assert.strictEqual(err.operator, 'strictEqual');
    assert.strictEqual(err.generatedMessage, true);
}

// 严格模式 和 遗留模式 见文档
// assert.equal(actual, expected[, message]) ==
// assert.strictEqual(actual, expected[, message]) ===  // 和js中的=== 不同 不会去比较两个变量的引用地址，但一样会比较原型链

assert.equal(1, 2 - 1) // OK 1 == 2-1 
assert.equal(1, '1') // OK 1 == '1' 
// assert.strictEqual(1, '1') // Error! 1 !== '1'    


// assert.deepStrictEqual({ a: 1 }, { a: '1' }); // Error! 1 !== '1' 

var a = {}, b = {}, c = Object.create(null)
assert.deepStrictEqual(a, b); // OK 使用 SameValue 比较。
// assert.deepStrictEqual(a, c); // Error! Object.create(null) 没有__proto__， 而{}对象都具有__proto__。
assert.deepStrictEqual(NaN, NaN); // OK 使用 SameValue 比较。
const symbol1 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });

assert.deepStrictEqual(new String('foo'), Object('foo')); // OK 因为对象与解封装后的字符串都是相同的


// assert.ok(value[, message]) 测试 value 是否为真值。 等同于 assert.equal(!!value, true, message)。
assert.ok(true) // ok
assert.ok(1) // ok
// assert.ok(typeof 123 === 'string'); // error
// assert.ok(false)  // error






