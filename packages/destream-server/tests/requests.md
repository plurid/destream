``` bash
curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:45321/ \
    --data '{"query":"query DestreamGetMessagerData {\n  destreamGetMessagerData {\n    status\n    data\n  }\n}"}'
```
