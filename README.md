# sk-mono

![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-ff3e00?style=flat-square)
![Version: dynamic](https://img.shields.io/npm/v/sk-mono?color=ff3e00&label=Version&style=flat-square)

SvelteKit monorepos made easy.

## What is this?

Currently it's *nothing*!

Work in progress, check back later.

## Install

[View it on NPM](https://www.npmjs.com/package/sk-mono)

You can install sk-mono with your favorite Node package manager:

```sh
npm install --save-dev sk-mono
pnpm add --save-dev sk-mono
yarn add --dev sk-mono
```

~~Or you may install it from [crates.io](https://crates.io/crates/sk-mono) with
[Cargo](https://www.rust-lang.org/learn/get-started):~~ *Not yet, use NPM for now.*

```sh
# cargo install sk-mono
```

## Building from source

*See the [license](./LICENSE.txt) for distribution permissions.*

You can build sk-mono from source with [Cargo](https://www.rust-lang.org/learn/get-started):

```sh
git clone https://github.com/WillsterJohnson/sk-mono ./sk-mono
cd sk-mono
cargo build --release
```

Be aware that sk-mono will build for Linux, Windows 32 bit, and Windows 64 bit
by default.

If you want to change the target platforms, you can do so with the `--target`
flag:

```sh
cargo build --release --target x86_64-unknown-linux-gnu # linux
cargo build --release --target x86_64-pc-windows-gnu    # windows 64 bit
cargo build --release --target i686-pc-windows-gnu      # windows 32 bit
cargo build --release --target x86_64-apple-darwin      # older macos
cargo build --release --target aarch64-apple-darwin     # newer macos
```

You can also remove the `build.target` key from `.cargo/config.toml` to build
for your current platform.

## License

sk-mono is distributed under the GNU General Public License v3.0.
See [the license file](LICENSE.txt) for more information.
