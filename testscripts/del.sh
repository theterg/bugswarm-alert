if [[ -z "$1" ]]; then
    echo "Usage: del.sh <ID to delete>"
    exit 1
fi;
curl -X DELETE http://localhost:3000/alerts/$1
