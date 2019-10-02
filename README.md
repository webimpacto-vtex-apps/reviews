# Review app example

This is an example of how a review app would integrate with the store framework.

## Troubleshooting

## Blocks does not appear in the product page

Make sure you have in your `blocks.json`:

```js
"store.product": {
  "blocks": [
    // ...other blocks
    "product-reviews",
    "product-rating-summary",
    "product-questions-and-answers"
  ]
}
```

## Stars does not appear in shelf

Make sure you are using the block `product-summary.shelf`. This will not work if it uses the `product-summary`.

```js
"product-summary.shelf": {
  "children": [
    // ...other blocks
    "product-rating-inline",
    // ...other blocks
  ]
}
```
