OUT_DIR := out

before-server-build = $(OUT_DIR)/node_modules

$(OUT_DIR)/node_modules:
	mkdir -p $@
	ln -s ../src/server $@

.PHONY: deps
deps:
	npm install

.PHONY: validate
validate: lint

.PHONY: lint
lint:
	node_modules/.bin/tslint -p src/server/tsconfig.json -t codeFrame && \
	node_modules/.bin/tslint -p src/client/tsconfig.json -t codeFrame

.PHONY: dev
dev:
	$(MAKE) -j2 server-dev build-client-watch

.PHONY: server-dev
server-dev:
	node_modules/.bin/nodemon --exec " \
		node_modules/.bin/ts-node --files=true -r tsconfig-paths/register \
			--project ./src/server/tsconfig.json \
			./src/server/app.ts" \
	-w ./src/server \
	-w ./res \
	-e ts,mustache

.PHONY: clean
clean:
	rm -rf $(OUT_DIR)

.PHONY: build
build: clean build-server build-client

.PHONY: build-server
build-server: $(before-server-build)
	node_modules/.bin/tsc -p src/server/tsconfig.json

.PHONY: build-server-watch
build-server-watch: $(before-server-build)
	node_modules/.bin/tsc -w -p src/server/tsconfig.json

.PHONE: build-server-production
build-server-production: $(before-server-build)
	node_modules/.bin/tsc -p src/server/tsconfig-production.json

.PHONY: run-server
run-server:
	node $(OUT_DIR)/server/app.js

.PHONY: build-client
build-client:
	node_modules/.bin/parallel-webpack

.PHONY: build-client-watch
build-client-watch:
	node_modules/.bin/parallel-webpack --watch

.PHONY: build-client-production
build-client-production:
	node_modules/.bin/parallel-webpack --mode=production

.PHONY: patch minor major
patch minor major:
	echo 1
