This reproduces the issue where NodeJs leaks memory when shared conttext is used within modules

```
npm install
```
only cross-env is used to be able to set environment variables on linux and windows machines.

This step can be skipped but remember to limit nodejs max memory

Run the program with command
```
npm run start
```

The nodejs process will crash to OOM.

