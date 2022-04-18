.PHONY: local http https

IP=$(shell hostname -I | cut -d' ' -f1)
PARCEL=./node_modules/parcel/lib/bin.js

setup:
	npm install

https:
	@sudo ${PARCEL} serve --https --port 443 --host "${IP}.nip.io" index.html

http:
	@sudo ${PARCEL} serve --port 80 --host "${IP}.nip.io" index.html

local:
	@sudo ${PARCEL} serve --port 80 --host "local.${IP}.nip.io" index.html

testnet:
	@sudo ${PARCEL} serve --port 80 --host "test.${IP}.nip.io" index.html

build:
	@sudo ${PARCEL} build --dist-dir docs index.html 
