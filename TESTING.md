# Rubric Visualization Project Testing

## Continuous Integration
This project has CI configured for Travis CI. To validate a push, Travis will:
- Install python/django requirements
- Install the "frontend" react project
- Create and migrate a DB
- Run django tests
- Run node tests
- Run eslint on the frontend

## Django Testing
This project is currently employing the Django default test-runner. To run tests, make sure you are in the project root:
```sh
$ ./manage.py test 
```

## Frontend/React Testing
We are using the following packages to test our frontend react application:
- Jest
- Enzyme
- Axe-core

### Adding frontend tests

If you would like to add a test for application code, simply take the name of the file `fileName.js` and add a test file in the same directory, like `fileName.spec.js`. This is simply convention; the test-runner will pick up any file with `spec.js` in its name.

### a11y testing
We are currently employing `axe-core` for a11y unit testing. We would also like to see where `pa11y-ci` may fit in.

#### axe-core
1. Mount the component to a DOM via enzyme (use `mountToDoc` test helper)
2. Get the mounted component's DOMNode, and pass it to axe-core along with rules configuration

Example:
```js
describe('My a11y Test Suite', () => {
  it('Tests with axe-core', () => {
    // - for the example, assume there is an App component
    // - see source for mountToDoc implementation
    const appComponent = mountToDoc(<App />);
    const appNode = appComponent.getDOMNode();
    const config = { rules: {} };
    axe.run(appNode, config, (err, { violations }) => {
      expect(err).toBe(null);
      expect(violations).toHaveLength(0);
      done();
    });
  });
});
```
