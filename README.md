# Myarn (WIP)
This project is working in progress.  
If use myarn, cannot be held responsible.

Myarn is Minecraft Server Manager.
Like package manager.

## Install

### Deno
Install with Deno
```sh
deno install -f --allow-read --allow-write --allow-net=api.github.com,objects.githubusercontent.com --allow-env --unstable -n myarn https://github.com/myarn/myarn/raw/0.0.1/myarn.ts
```
Or run direct
```sh
deno run --allow-read --allow-write --allow-net=api.github.com,objects.githubusercontent.com --allow-env --unstable https://github.com/myarn/myarn/raw/0.0.1/myarn.ts
```

### Linux, Mac, Windows without Deno
Comming soon.

## Roadmap

- [ ] Install plugins commands
  - [ ] From GitHub
  - [ ] ~~From Spigot~~
- [ ] Init command
  - [ ] From current server
- [ ] Checksum
- [ ] Dashboard
   - [ ] API
