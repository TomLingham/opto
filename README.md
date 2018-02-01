# Opto

Optionals in JavaScript have never been so necessary!
-----------------------------------------------------

Opto is an optional implementation with a built in match function. It works
nicely promise values, and behaves like an expression (inspired by Rust's
Optional type).

### Usage

```javascript
import { Some, None, match } from 'opto';

async function findProduct(id) {
  const result = await db.find('products', { id });

  return result.length === 1
    ? Some(result[0])
    : None();
}

const app = async (req, res) => {
  const product = await findProduct(id);

  const message = match(product)(
    Some(product => `Product ${product.name} is in stock!`),
    None(() => 'Sorry, That product does not exist.');
  );

  res.end(message);
};
```