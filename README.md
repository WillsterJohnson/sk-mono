# sk-mono

![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-ff3e00?style=flat-square)
![Version: dynamic](https://img.shields.io/npm/v/sk-mono?color=ff3e00&label=Version&style=flat-square)

SvelteKit monorepos made easy.

<!-- LINKS -->

<!-- max 5 wide, td should be emboldened for visual consistency -->
<!-- leave as few blank cells as possible. eg; 5 urls -> 1x5, 6 urls -> 2x3, etc -->

| [Installation] | [Usage] | [License] | [Contributing] |
|----------------|---------|-----------|----------------|

[Installation]: #installation
[Usage]: #usage
[License]: #license
[Contributing]: #contributing

<!-- /LINKS -->

## What is this?

Currently it's *nothing*!

sk-mono is going to be a fully featured command line utility for making,
managing, running, building, and deploying SvelteKit libraries and applications
from monorepos and single-workspace repos alike, using Rust for lightning fast
execution times.

Work in progress, check back later.

## Installation

*[View sk-mono on npmjs.com](https://www.npmjs.com/package/sk-mono)*

You can install sk-mono with your favorite Node package manager:

```sh
npm install --save-dev sk-mono
pnpm add --save-dev sk-mono
yarn add --dev sk-mono
```

## Usage

Once installed, sk-mono can be run with the `sk-mono` command:

```sh
sk-mono --version
```

Hyphens are a pain though, so sk-mono has two builtin aliases:

```sh
skmono --version
skm --version
```

## Contributing

**Important: sk-mono is written almost entirely in Rust. Aside from a short
install script, there is no JavaScript here.**

Currently sk-mono is not currently accepting code contributions.

If you have found a bug, have an idea for a feature, or think there's a better
way to do something, please open an issue.

## License

sk-mono is distributed under the GNU General Public License v3.0.
See [the license file](LICENSE.txt) for more information.
