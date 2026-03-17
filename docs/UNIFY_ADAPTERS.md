Instead of two adapters, just use the callback style by default and make like.setScene a method that always exists.

Calling setScene will make that particular scene handle all of the callbacks, rather than the global handler.

Calling setScene(null) will revert to the global handler, love2d style.

This won't simplify our code drastically, but we should restructure accordingly.

SceneRunner won't be exposed, any more.

Also long paths are annoying. packages/like2d/src/adapters/ is too long, let's simplify. If we ever have multiple packages in the future, we can go back.

