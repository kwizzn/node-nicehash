# node-nicehash
> [nicehash.com](https://www.nicehash.com/docs) nodejs api client.

### Installation
```bash
npm install node-nicehash
```

### Getting started
```javascript
import Nicehash from 'node-nicehash'

const client = Nicehash()

const client2 = Nicehash({
  timeout: 5000 // http request timeout
})

client.account().then(data => console.log(data))
```
