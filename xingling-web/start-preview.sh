#!/bin/bash
cd /home/tony/xingling/xingling-web
export PATH=/home/tony/.openagents/nodejs/bin:/home/tony/.bun/bin:/usr/local/bin:/usr/bin:/bin
exec npx vite preview --host 0.0.0.0 --port 5178
