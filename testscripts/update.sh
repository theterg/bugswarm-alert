if [[ -z "$1" ]]; then
    echo "Usage: update.sh <ID to update>"
    exit 1
fi;
curl -i -X PUT -H "Content-Type: application/json" -d '{"smsnum":"+98887776666","swarmid":"156161a2b25b9d6d38b39e41d3c4ebabc59cb5c7","resourceid":"eb81af58239ac15f07f3643688069190145e852f","feed":"UPDATED","thresh":9.9}' http://localhost:3000/alerts/$1
