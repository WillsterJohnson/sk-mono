TAG=$1

mkdir ./bin/

mkdir ./bin/sk-mono-$TAG-linux-x86_64/
cp ./target/x86_64-unknown-linux-gnu/release/sk-mono ./bin/sk-mono-$TAG-linux-x86_64/sk-mono
cp ./target/x86_64-unknown-linux-gnu/release/libsk_mono.so ./bin/sk-mono-$TAG-linux-x86_64/lib.so
tar -czvf ./bin/sk-mono-$TAG-linux-x86_64.tar.gz -C ./bin/sk-mono-$TAG-linux-x86_64/ sk-mono lib.so

mkdir ./bin/sk-mono-$TAG-win64-x86_64/
cp ./target/x86_64-pc-windows-gnu/release/sk-mono.exe ./bin/sk-mono-$TAG-win64-x86_64/sk-mono.exe
cp ./target/x86_64-pc-windows-gnu/release/sk_mono.dll ./bin/sk-mono-$TAG-win64-x86_64/lib.dll
tar -czvf ./bin/sk-mono-$TAG-win64-x86_64.tar.gz -C ./bin/sk-mono-$TAG-win64-x86_64/ sk-mono.exe lib.dll

mkdir ./bin/sk-mono-$TAG-win32-i686/
cp ./target/i686-pc-windows-gnu/release/sk-mono.exe ./bin/sk-mono-$TAG-win32-i686/sk-mono.exe
cp ./target/i686-pc-windows-gnu/release/sk_mono.dll ./bin/sk-mono-$TAG-win32-i686/lib.dll
tar -czvf ./bin/sk-mono-$TAG-win32-i686.tar.gz -C ./bin/sk-mono-$TAG-win32-i686/ sk-mono.exe lib.dll
