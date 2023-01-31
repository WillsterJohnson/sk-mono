# Installs the sk-mono binary and library file from local target folder.

OS=$1
BIN_FILE=""
LIB_FILE=""
LIB_EXT=""
if [ "$OS" = "linux" ]; then
  OS="x86_64-unknown-linux-gnu"
  BIN_FILE="sk-mono"
  LIB_FILE="libsk_mono"
  LIB_EXT=".so"
elif [ "$OS" = "win64" ]; then
  OS="x86_64-pc-windows-gnu"
  BIN_FILE="sk-mono.exe"
  LIB_FILE="sk_mono"
  LIB_EXT=".dll"
elif [ "$OS" = "win32" ]; then
  OS="i686-pc-windows-gnu"
  BIN_FILE="sk-mono.exe"
  LIB_FILE="sk_mono"
  LIB_EXT=".dll"
else
  echo "OS not supported"
  echo "Supported OSes: linux, win64, win32"
  echo "usage: dev.sh <OS>"
  exit 1
fi

cargo build --release
cp ./target/$OS/release/$BIN_FILE ./sk-mono
chmod 755 ./sk-mono
cp ./target/$OS/release/$LIB_FILE$LIB_EXT ./lib$LIB_EXT
chmod 755 ./lib$LIB_EXT
