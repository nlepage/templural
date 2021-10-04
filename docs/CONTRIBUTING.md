# Contributing to templural

First of all thank you for expressing interest in templural!

We are very happy to welcome new contributors.

## How can I contribute?

### Pull requests

Pull requests are welcome, check out [our issue tracker][issues] to see if any contributions are needed.

Any types of contributions are welcome, for example [writing documentation](#writing-documentation).

Changes may be performed using only Github's UI, for example editing the README.md file or any other markdown file.

For information on how to setup a development environment, please refer to [Developer environment setup](#developer-environment-setup).

### Writing documentation

Documentation is an important part of this project.

No developer skills are needed to contribute to the documentation.

Documentation changes may be performed using only Github's UI.

For more information on how to write markdown files, see the [GitHub Markdown reference](https://github.com/github/docs/blob/main/contributing/content-markup-reference.md).

### Report a bug

If you think you have found a bug, please search [our issue tracker][issues] to see if anyone has already reported it.

If you are the first to have noticed it, please [create an issue][new-issue], and make sure to provide any information that might help us resolve it.

You are welcome to try and fix it by submitting a pull request if you would like to (see [Pull requests](#pull-requests)).

### Feature requests

We are open to feature requests, be sure to search [our issue tracker][issues] to see if anyone has already asked for it.

If not, please [create an issue][new-issue] describing what you want, what your use case is, and an example of code.

You are welcome to try and do it yourself by submitting a pull request if you would like to (see [Pull requests](#pull-requests)).

## Developer environment setup

1. [fork the project][fork]
2. Clone the project: `git clone git@github.com/<your name>/templural`
3. Run `yarn` to install dependencies
4. Create a branch: `git switch -c <your branch name>`
5. Perform and commit some modifications
6. Don't forget to add/update some tests, see [Tests](#tests)
7. [Open a pull request](https://github.com/nlepage/templural/compare) describing your changes

### Tests

If you write any code, be sure to write a test that goes with it in the [test directory][test-directory].

It is OK to write failing tests, you might want to [flag these as failing](https://github.com/avajs/ava/blob/main/docs/01-writing-tests.md#failing-tests) before proposing your changes.

Run `yarn test` to execute all the tests.

## Any questions?

If you are not sure whether to report a bug or ask for a new feature, or if you just have a question about anything, please use the [discussions tab][discussions].

## Code of conduct

In order to keep a happy and respectful atmosphere around the project, we expect everyone participating in it to follow our [Code of conduct][code-of-conduct].

[issues]: https://github.com/nlepage/templural/issues
[new-issue]: https://github.com/nlepage/templural/issues/new
[discussions]: https://github.com/nlepage/templural/discussions
[code-of-conduct]: https://github.com/nlepage/templural/blob/main/docs/CODE_OF_CONDUCT.md
[test-directory]: https://github.com/nlepage/templural/tree/main/test
[fork]: https://github.com/nlepage/templural/fork
